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
import { ChatRepository } from 'Chats/Repository'
import { InvalidChatId, InvalidPeerId } from 'common/errors/Chats'
import { isUserId } from 'common/helpers/chats'

@Injectable()
export class MessagesRepository {
  public constructor(private prisma: PrismaService, private chats: ChatRepository) {}

  /**
   * @todo handle private chats
   */
  public async getHistory(requesterId: string, input: Api.GetHistoryInput) {
    const { direction } = input
    const chat = await this.chats.getPeerById(requesterId, input.chatId)

    if (!chat) {
      if (isUserId(input.chatId)) {
        return []
      }
      throw new InvalidPeerId('messages.getHistory')
    }
    /**
     * If it's private group and history for new - false, then select messages
     * where minDate - joinDate member.
     */

    const { id: chatId } = chat
    switch (direction) {
      case Api.HistoryDirection.Around: {
        if (!input.offsetId) {
          throw new InvalidEntityIdError('messages.getHistory')
        }
        const limit = input.limit ? Math.round(input.limit / 2) : MSG_HISTORY_LIMIT / 2

        const backwards = await this.getHistoryBackward(
          requesterId,
          { ...input, chatId, limit },
          input.includeOffset ?? true,
        )
        const forwards = await this.getHistoryForward(requesterId, { ...input, chatId, limit }, false)

        const around = [...backwards, ...forwards]

        return orderHistory(around)
      }

      case Api.HistoryDirection.Backwards: {
        const backwards = await this.getHistoryBackward(requesterId, { ...input, chatId }, input.includeOffset ?? true)

        // return backwards
        return orderHistory(backwards)
      }

      case Api.HistoryDirection.Forwards: {
        const forwards = await this.getHistoryForward(requesterId, { ...input, chatId }, input.includeOffset ?? true)

        return orderHistory(forwards)
      }
    }
  }

  public async getHistoryBackward(requesterId: string, input: Api.GetHistoryInput, includeOffset = false) {
    const cursor = input.offsetId ? { cursor: { id: input.offsetId } } : undefined

    return this.prisma.message.findMany({
      where: {
        chatId: input.chatId,
        ...this.processNotDeleted(requesterId),
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

  public async getHistoryForward(requesterId: string, input: Api.GetHistoryInput, includeOffset = false) {
    const cursor = input.offsetId ? { cursor: { id: input.offsetId } } : undefined
    return this.prisma.message.findMany({
      where: {
        chatId: input.chatId,
        ...this.processNotDeleted(requesterId),
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

  private processNotDeleted(requesterId: string) {
    return {
      isDeletedForAll: {
        not: true,
      },
      deletedByUsers: {
        some: {
          users: {
            some: {
              id: requesterId,
            },
          },
        },
      },
    }
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

  /* Drafts. */

  public async saveDraft(prismaChatMemberId: string, input: Api.SaveDraftInput) {
    /* If has text - update or create new. */
    /* @todo - переробити, щоб не створювати нові таблиці, просто змінювати draft і все */
    return this.prisma.chatMember.update({
      where: {
        id: prismaChatMemberId,
      },
      data: {
        draft: input.text,
      },
    })
  }

  /* DRAFTS IN NOT CREATED CHAT: */
}
