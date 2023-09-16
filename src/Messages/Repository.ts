import { Injectable } from '@nestjs/common'
import { type PrismaChat, selectChatFields } from 'common/builder/chats'
import { PrismaService } from 'common/prisma.service'
import type { Nullable } from 'types/other'

@Injectable()
export class MessagesRepository {
  public constructor(private prisma: PrismaService) {}

  public async create(requesterId: string, input: { text?: Nullable<string>; chat: PrismaChat }) {
    const { text, chat } = input

    const updChat = await this.prisma.chat.update({
      where: {
        id: chat.id,
      },
      data: {
        // lastMessageId: message.id,
        lastMessage: {
          create: {
            text,
            chatId: chat.id,
            senderId: requesterId,
          },
        },
        fullInfo: {
          update: {
            members: {
              updateMany: {
                where: {
                  userId: {
                    not: requesterId,
                  },
                },
                data: {
                  unreadCount: {
                    increment: 1,
                  },
                },
              },
            },
          },
        },
      },
      include: {
        ...selectChatFields(),
      },
    })

    const { lastMessage } = updChat

    return { message: lastMessage!, chat: updChat }
  }

  // public async createAction(requesterId: string, input: { data: any; chat: PrismaChat }) {
  //   const message = await this.prisma.message.create({
  //     data: {
  //       chatId: input.chat.id,
  //       action: {
  //         create: {
  //           chatCreate: {
  //             create: {
  //               title: input.chat.title,
  //             },
  //           },
  //           memberId: requesterId,
  //         },
  //       },
  //     },
  //   })
  // }

  // public delete(requsterId: string, messageId: string) {}
}
