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
import { InvalidPeerId } from 'common/errors/Chats'
import { isUserId } from 'common/helpers/chats'
import type { Prisma } from '@prisma/client'
import { CreateMessageInput } from 'types/messages'

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

    console.log({ chatId })
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

        // isDeletedForAll:{
        //   not:{

        //   }
        // }
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
      AND: [
        {
          OR: [{ isDeletedForAll: { equals: null } }, { isDeletedForAll: { not: true } }],
          deletedByUsers: {
            every: {
              NOT: {
                userId: requesterId,
              },
            },
            // every: {
            //   NOT: {
            //     userId: requesterId,
            //   },
            // },
            // none: {
            // id: requesterId,
            // },
          },
        },
      ],
    } satisfies Prisma.MessageWhereInput
  }

  public async create(requesterId: string, input: CreateMessageInput) {
    const { text, chat, entities, id, orderedId } = input
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
            // senderId:'',
            // chatId: undefined,
            // senderId: undefined,
            entities: {
              toJSON: () => entities,
            },

            // orderedId,
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
    const { ids, deleteForAll } = input
    const affectedChat = await this.prisma.$transaction(async (tx) => {
      const promises = ids.map((id) => {
        return tx.message.update({
          where: {
            id,
          },
          data: {
            isDeletedForAll: deleteForAll,
            deletedByUsers: {
              create: {
                userId: requesterId,
              },
            },
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

      const affectedChat = result[0].chat

      return affectedChat
    })

    return {
      affectedChat,
    }

    // return this.prisma.message.updateMany({
    //   where: {
    //     id: {
    //       in: input.ids,
    //     },
    //   },
    //   data: {},
    // })
  }

  public async edit(requesterId: string, input: Api.EditMessageInput) {
    const { chatId, messageId, text } = input
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
