import type * as Prisma from '@prisma/client'

import { NotFoundEntityError } from 'common/errors'
import { PrismaService } from 'common/prisma.service'

import { getUserName } from 'common/helpers/users'
import { Injectable } from '@nestjs/common'
import { selectChatFields } from 'common/builder/chats'
import { getRandomColor } from 'Media'
import type { InputPeer } from 'types/chats'

@Injectable()
export class ChatRepository {
  constructor(private prisma: PrismaService) {}

  public async leaveChat(chatId: string, requesterId: string) {
    const member = await this.findMember(chatId, requesterId)
    if (!member) {
      throw new NotFoundEntityError('chats.leaveChat')
    }
    await this.prisma.chatMember.delete({
      where: {
        id: member.id,
      },
    })
  }

  private findMember(chatId: string, userId: string) {
    return this.prisma.chatMember.findFirst({
      where: {
        userId,
        chatInfo: {
          chatId,
        },
      },
    })
  }
  // при створюванні юзера, одразу створювати чат з айді як у юзера, а потім, коли надсилати повідомлення, перевіряти, чи існує цей чат, якщо ні - оновлювати його і додавати мене....??

  public async createSavedMessages(user: Prisma.User) {
    await this.prisma.chat.create({
      data: {
        id: user.id,
        type: 'chatTypePrivate',
        color: user.color,
        title: getUserName(user),
        fullInfo: {
          create: {
            members: {
              create: {
                userId: user.id,
                id: user.id,
              },
            },
          },
        },
      },
    })
  }

  public async getPrivateChat(requesterId: string, userId: string) {
    return this.prisma.chat.findFirst({
      where: {
        type: 'chatTypePrivate',
        fullInfo: {
          members: {
            some: {
              id: userId,
            },
          },
          AND: {
            members: {
              some: {
                id: requesterId,
              },
            },
          },
        },
      },
      include: {
        ...selectChatFields(),
      },
    })
  }

  public async createPrivate(requesterId: string, userId: string) {
    return this.prisma.chat.create({
      data: {
        type: 'chatTypePrivate',
        title: `${requesterId}+${userId}`,

        fullInfo: {
          create: {
            members: {
              createMany: {
                data: [
                  {
                    id: requesterId,
                    userId: requesterId,
                  },
                  {
                    id: userId,
                    userId: userId,
                  },
                ],
              },
            },
          },
        },
        color: getRandomColor(),
        isPrivate: false,
      },
      include: {
        ...selectChatFields(),
      },
    })
  }

  public async findById(chatId: string) {
    console.log({ chatId })
    return this.prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      include: {
        ...selectChatFields(),
      },
    })
  }

  public async findByPeerOrCreate(requesterId: string, peer: InputPeer) {
    if ('userId' in peer) {
      const chat = await this.getPrivateChat(requesterId, peer.userId)

      return chat || this.createPrivate(requesterId, peer.userId)
    }

    return this.findById(peer.chatId)
  }
}
