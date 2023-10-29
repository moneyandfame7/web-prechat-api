import type * as Prisma from '@prisma/client'

import { Injectable } from '@nestjs/common'

import { getRandomColor } from 'Media'

import { NotFoundEntityError } from 'common/errors'
import { PrismaService } from 'common/prisma.service'
import { isSavedMessages, isUserId } from 'common/helpers/chats'
import { generateId } from 'common/helpers/generateId'

import type { InputPeer } from 'types/Chats'
import { selectChatFields } from 'common/selectors'

@Injectable()
export class ChatsRepository {
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

  public async findMember(chatId: string, userId: string) {
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
  /**
   * @internal
   */
  public async createSavedMessages(requesterId: string) {
    await this.prisma.chat.create({
      data: {
        id: requesterId,
        type: 'chatTypePrivate',
        color: getRandomColor(),
        title: 'Saved Messages',
        fullInfo: {
          create: {
            members: {
              create: {
                userId: requesterId,
                // id: user.id,
              },
            },
          },
        },
      },
    })
  }
  /**
   * @internal
   */
  public async createServiceChat(user: Prisma.User) {
    await this.prisma.chat.create({
      data: {
        id: generateId('chat'),
        title: 'Prechat',
        type: 'chatTypePrivate',
        color: 'BLUE',
        isPrivate: true,
        isService: true,
        fullInfo: {
          create: {
            members: {
              create: {
                userId: user.id,
              },
            },
          },
        },
      },
    })
  }

  // public async findChatWithSelf(requesterId: string) {
  //   return this.prisma.chat.findFirst({
  //     where: {

  //     },
  //   })
  // }

  public async getPrivateChat(requesterId: string, userId: string) {
    return this.prisma.chat.findFirst({
      where: {
        type: 'chatTypePrivate',
        fullInfo: {
          members: {
            some: {
              userId: userId,
            },
          },

          AND: {
            members: {
              some: {
                userId: requesterId,
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
  public async getSavedMessages(requesterId: string) {
    return this.prisma.chat.findUnique({
      where: {
        id: requesterId,
      },
      include: {
        ...selectChatFields(),
      },
    })
  }

  public async getPeerById(requesterId: string, peerId: string) {
    if (isSavedMessages(requesterId, peerId)) {
      return this.getSavedMessages(requesterId)
    }
    if (isUserId(peerId)) {
      return this.getPrivateChat(requesterId, peerId)
    }

    return this.findById(peerId)
  }

  public async createPrivate(requesterId: string, userId: string) {
    const chatId = generateId('chat')

    return this.prisma.chat.create({
      data: {
        id: chatId,
        // id: crypto.randomUUID(),
        type: 'chatTypePrivate',
        title: `${requesterId}+${userId}`,

        fullInfo: {
          create: {
            members: {
              create: [
                {
                  //
                  /**
                   * мейбі проблема ось тут? ( а я думаю саме тут, бо
                   * коли створили групу - то там створились ці айдішники, і ще раз не МОЖНА їх використати? то тоді можливо просто в prisma прибрати унікальні айді?) )
                   *
                   * ... - ну да, я єблан просто трошки.
                   */
                  // id: requesterId,
                  userId: requesterId,
                  unreadCount: 0,
                },
                {
                  // id: userId,
                  userId: userId,
                  unreadCount: 1,
                },
              ],
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
