import type { MessageEntity } from '@generated/graphql'
import { Injectable } from '@nestjs/common'
import { type PrismaChat, selectChatFields } from 'common/builder/chats'
import { PrismaService } from 'common/prisma.service'
import type { Nullable } from 'types/other'

import * as Api from '@generated/graphql'
import { selectMessageFields } from 'common/builder/messages'
import { InvalidEntityIdError } from 'common/errors'
import { orderHistory } from 'common/helpers/messages'
import { MSG_HISTORY_LIMIT } from 'common/constants'

@Injectable()
export class MessagesRepository {
  public constructor(private prisma: PrismaService) {}

  public async getHistory(input: Api.GetHistoryInput) {
    const { direction } = input

    switch (direction) {
      case Api.HistoryDirection.Around: {
        if (!input.offsetId) {
          throw new InvalidEntityIdError('messages.getHistory')
        }
        const limit = input.limit ? Math.round(input.limit / 2) : MSG_HISTORY_LIMIT / 2

        console.log({ limit })
        const backwards = await this.getHistoryBackward({ ...input, limit }, input.includeOffset ?? true)
        const forwards = await this.getHistoryForward({ ...input, limit }, false)

        const around = [...backwards, ...forwards]

        return orderHistory(around)
      }

      case Api.HistoryDirection.Backwards: {
        const backwards = await this.getHistoryBackward(input, input.includeOffset ?? true)

        // return backwards
        return orderHistory(backwards)
      }

      case Api.HistoryDirection.Forwards: {
        const forwards = await this.getHistoryForward(input, input.includeOffset ?? true)

        return orderHistory(forwards)
      }
    }
  }

  public async getHistoryBackward(input: Api.GetHistoryInput, includeOffset = false) {
    const cursor = input.offsetId ? { cursor: { id: input.offsetId } } : undefined

    console.log({ input })
    return this.prisma.message.findMany({
      where: {
        chatId: input.chatId,
      },
      ...(cursor && cursor),

      take: Math.abs(input.limit || MSG_HISTORY_LIMIT) + (!includeOffset ? 0 : 1),
      skip: !includeOffset && cursor ? 1 : 0,
      // skip: 1,
      include: {
        ...selectMessageFields(),
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  public async getHistoryForward(input: Api.GetHistoryInput, includeOffset = false) {
    const cursor = input.offsetId ? { cursor: { id: input.offsetId } } : undefined
    return this.prisma.message.findMany({
      where: {
        chatId: input.chatId,
      },

      ...(cursor && cursor),

      take: -Math.abs(input.limit || MSG_HISTORY_LIMIT), //
      skip: !includeOffset && cursor ? 1 : 0,

      include: {
        ...selectMessageFields(),
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  public async create(
    requesterId: string,
    input: { text?: Nullable<string>; chat: PrismaChat; entities?: Nullable<MessageEntity[]>; id: string },
  ) {
    const { text, chat, entities, id } = input
    // const createdMessage = await this.prisma.message.create({
    //   data: {
    //     id,
    //     senderId: requesterId,
    //     chatId: chat.id,
    //     text,
    //     ...(entities ? { entities: { toJSON: () => entities } } : {}),
    //   },
    //   include:{
    //     ...selectMessageFields()
    //   }
    // })
    const updChat = await this.prisma.chat.update({
      where: {
        id: chat.id,
      },
      data: {
        // lastMessageId: message.id,
        lastMessage: {
          create: {
            id,
            text,
            chat: {
              connect: {
                id: chat.id,
              },
            },
            sender: {
              connect: {
                id: requesterId,
              },
            },
            // senderId:'',
            // chatId: undefined,
            // senderId: undefined,
            entities: {
              toJSON: () => entities,
            },
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
