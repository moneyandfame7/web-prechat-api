import { Injectable } from '@nestjs/common'

import * as Api from '@generated/graphql'
import { ChatsRepository } from 'Chats'

import { InvalidEntityIdError, InvalidMessageIdError } from 'common/errors'
import { orderHistory } from 'common/helpers/messages'
import { MSG_HISTORY_LIMIT } from 'common/constants'
import { PrismaService } from 'common/prisma.service'
import { InvalidPeerId } from 'common/errors/Chats'
import { isUserId } from 'common/helpers/chats'
import { selectChatFields, selectMessageFields } from 'common/selectors'

import type { CreateMessageInput } from '../interfaces/messages'

@Injectable()
export class MessagesRepository {
  public constructor(private prisma: PrismaService, private chats: ChatsRepository) {}

  /**
   * @todo handle private chats
   */
  public async getHistory(requesterId: string, input: Api.GetHistoryInput) {
    const { direction } = input
    const chat = await this.chats.getPeerById(requesterId, input.chatId)

    if (!chat) {
      //
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
  /* 
  inc 2555 - 2555W out 
  inc 2556 - 2556W out 
  inc 2559 - 2559W out 
  inc 2568 - 2568v out 
  inc 2569 - 2569v out 
  inc 2570 - 2570v out 
  inc 2571 - 2571v out 
  inc 2572 - 2572v out 
  inc 2573 - 2573v out 
  inc 2574 - 2574v out - scroll start FROM HERE
  inc 2575 - 2575v out 
  inc 2576 - 2576v out 
- unreadCount - 9
- lastReadOutgoing - 2559
- lastReadIncoming - 2574
  */

  public async readHistory(requesterId: string, input: Api.ReadHistoryInput) {
    const member = await this.chats.findMember(input.chatId, requesterId)

    if (!member) {
      throw new InvalidEntityIdError('messages.readHistory')
    }
    const message = await this.getByOrderId(input.chatId, input.maxId)

    if (!message) {
      throw new InvalidMessageIdError('messages.readHistory')
    }
    // не буде працювати, якщо були якісь видаленні повідомлення, тому мб варто видаленні просто помічати флагом isDeleted???
    const newUnreadCount = await this.prisma.message.count({
      where: {
        chatId: input.chatId,
        senderId: {
          not: requesterId,
        },
        orderedId: {
          gt: input.maxId,
        },
      },
    })

    const update = await this.prisma.chatMember.update({
      where: {
        id: member.id,
      },
      data: {
        lastReadIncomingMessageId: input.maxId,
        unreadCount: newUnreadCount,
      },
      include: {
        chatInfo: {
          include: {
            chat: {
              include: {
                ...selectChatFields(),
              },
            },
          },
        },
      },
    })

    return { newUnreadCount, affectedChat: update.chatInfo.chat }
  }

  private async getByOrderId(chatId: string, id: number) {
    return this.prisma.message.findFirst({
      where: {
        chatId,
        orderedId: id,
      },
    })
  }

  public async getHistoryBackward(requesterId: string, input: Api.GetHistoryInput, includeOffset = false) {
    const cursor = input.offsetId ? { cursor: { id: input.offsetId } } : undefined

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

  public async getHistoryForward(requesterId: string, input: Api.GetHistoryInput, includeOffset = false) {
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

  public async create(requesterId: string, input: CreateMessageInput) {
    const { text, chat, entities, id, orderedId } = input
    const updChat = await this.prisma.chat.update({
      where: {
        id: chat.id,
      },
      data: {
        lastMessage: {
          create: {
            id,
            text,
            orderedId,
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
        // fullInfo:{
        //   include:{
        //     members:{
        //       include:{

        //       }
        //     }
        //   }
        // }
      },
    })

    const { lastMessage } = updChat
    // updChat.lastMessage.
    return { message: lastMessage!, chat: updChat }
  }

  public async delete(requesterId: string, input: Api.DeleteMessagesInput) {
    const affectedChat = await this.prisma.$transaction(async (tx) => {
      const promises = input.ids.map(async (id) => {
        return tx.message.delete({
          where: {
            id,
          },
          include: {
            chat: {
              include: {
                ...selectChatFields(),
              },
            },
          },
        })
      })
      const result = await Promise.all(promises)
      const chatId = result[0].chat.id
      const newLastMessage = await tx.message.findFirst({
        where: {
          chatId: result[0].chat.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
      const updatedChat = await tx.chat.update({
        where: {
          id: chatId,
        },
        data: {
          lastMessage: {
            connect: {
              id: newLastMessage?.id,
            },
          },
        },
        include: {
          ...selectChatFields(),
        },
      })

      return updatedChat
    })
    return affectedChat
  }

  public async edit(requesterId: string, input: Api.EditMessageInput) {
    const { /*  chatId, */ messageId, text } = input
    return this.prisma.message.update({
      where: {
        id: messageId,
        // chatId, // optional?
      },
      data: {
        text,
        editedAt: new Date(),
      },
      include: {
        ...selectMessageFields(),
        chat: {
          include: {
            ...selectChatFields(),
          },
        },
      },
    })
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
