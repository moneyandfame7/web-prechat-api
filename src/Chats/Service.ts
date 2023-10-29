import { Injectable } from '@nestjs/common'

import type * as Api from '@generated/graphql'

import { getRandomColor } from 'Media'

import { PrismaService } from 'common/prisma.service'
import { BuilderService } from 'common/builders/Service'
import { createMessageAction } from 'common/selectors'
import { generateId } from 'common/helpers/generateId'
import { NotFoundEntityError, UsernameNotOccupiedError } from 'common/errors'

import type { WithTypename } from 'types/helpers'

import { ChatsRepository } from './Repository'
import { FIRST_MSG_ID } from 'common/constants'
import { createChatMembers, isSelf, selectChatFields, selectUserFields } from 'common/selectors'

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repo: ChatsRepository,
    private builder: BuilderService,
  ) {}

  public async createGroup(requesterId: string, input: Api.CreateGroupInput) {
    const memberIds = [...(input.users ? new Set([...input.users, requesterId]) : requesterId)]
    const chatId = generateId('chat')

    return this.prisma.chat.create({
      data: {
        id: chatId,
        type: 'chatTypeGroup',
        title: input.title,
        fullInfo: {
          create: {
            ...createChatMembers(requesterId, memberIds),
            members: {
              create: memberIds.map((u) => ({
                // id: u,
                unreadCount: isSelf(requesterId, u) ? 0 : 1,
                isOwner: isSelf(requesterId, u),
                isAdmin: isSelf(requesterId, u),
                inviterId: requesterId,
                userId: u,
                lastMessage: {
                  create: {
                    action: {
                      create: createMessageAction(
                        {
                          '@type': 'chatCreate',
                          payload: { title: input.title },
                        },
                        requesterId,
                      ),
                    },
                    chatId,
                    orderedId: FIRST_MSG_ID,
                    senderId: requesterId,
                  },
                },
                // admin permissions created when i add new admins
                // adminPermissions:{
                //   create:{
                //     canAddNewAdmins:isSelf(requesterId,u),

                //   }
                // }
              })),
            },
          },
        },
        isPrivate: true,
        color: getRandomColor(),
      },
      include: {
        ...selectChatFields(),
      },
    })
  }

  public async createChannel(requesterId: string, input: Api.CreateChannelInput) /* : Promise<ChatCreatedUpdate> */ {
    const memberIds = [...(input.users ? new Set([...input.users, requesterId]) : requesterId)]
    const chatId = generateId('chat')

    const result = await this.prisma.chat.create({
      data: {
        id: chatId,
        type: 'chatTypeChannel',
        title: input.title,

        fullInfo: {
          create: {
            ...createChatMembers(requesterId, memberIds),

            description: input.description,
            members: {
              create: memberIds.map((u) => ({
                unreadCount: isSelf(requesterId, u) ? 0 : 1,
                isOwner: isSelf(requesterId, u),
                isAdmin: isSelf(requesterId, u),
                inviterId: requesterId,
                userId: u,
                lastMessage: {
                  create: {
                    action: {
                      create: createMessageAction({ '@type': 'channelCreate' }, requesterId),
                    },
                    chatId,
                    orderedId: FIRST_MSG_ID,
                    senderId: requesterId,
                  },
                },
              })),
            },
          },
        },
        lastMessage: {
          create: {
            action: {
              create: createMessageAction({ '@type': 'channelCreate' }, requesterId),
            },
            chatId,
            orderedId: FIRST_MSG_ID,
            senderId: requesterId,
          },
        },

        color: getRandomColor(),
        isPrivate: false,
      },
      include: {
        ...selectChatFields(),
      },
    })
    return result
    // const members = result.fullInfo?.members.map((m) => m.user)
    // const users = members ? await this.users.buildApiUserAndStatuses(members, requesterId) : []
    // const chat = buildApiChat(requesterId, result)
    // return { users, chat }
  }

  /* Returns exist or created chat. */
  public async createPrivate(requesterId: string, input: { userId: string }) {
    const exist = await this.repo.getPrivateChat(requesterId, input.userId)
    if (exist) {
      return this.builder.chats.build(requesterId, exist)
    }

    const result = await this.repo.createPrivate(requesterId, input.userId)

    return this.builder.chats.build(requesterId, result)
  }

  /**
   * 1. Можливо не створювати чат, при створюванні контакту. Створювати чат, якщо
   * немає чату з таким айді як в юзера ( якось в тайтл зберігати назву чата??? а мб)
   * айдішнік по іншому якось генерувати?
   * колор чату - це колор юзера в приватному чаті треба робити...
   *
   * Sessions ID.
   * Google -  e7fb5128-7c5d-411b-9587-c4accf0152a9
   * Safari - 651fe60e-ae2f-4b9b-8aa7-dd5f7357cca4
   */
  public async getChats(requesterId: string) {
    return this.prisma.chat.findMany({
      where: {
        fullInfo: {
          members: {
            some: {
              // userId: requesterId,
              userId: requesterId,
            },
          },
        },
      },
      include: {
        ...selectChatFields(),
      },
      // select:{
      //   fullInfo:{
      //     select:{
      //       _count:{
      //         select:{
      //           members:true
      //         }
      //       }
      //     }
      //   }
      // }
    })
  }

  public async getCommonGroups(requesterId: string, input: Api.GetCommonGroupsInput): Promise<Api.Chat[]> {
    const result = await this.prisma.chat.findMany({
      where: {
        type: 'chatTypeGroup',
        fullInfo: {
          members: {
            some: {
              AND: [{ userId: requesterId }, { userId: input.userId }],
            },
          },
        },
      },
      ...(input.limit && { take: input.limit }),
      include: {
        ...selectChatFields(),
      },
    })

    return this.builder.chats.buildMany(requesterId, result)
  }

  public async getChat(chatId: string, requesterId: string): Promise<Api.Chat> {
    const chat = await this.repo.findById(chatId)
    if (!chat) {
      throw new NotFoundEntityError('chats.getChatFull')
    }

    return this.builder.chats.build(requesterId, chat)
  }

  public async getChatFull(chatId: string, requesterId: string): Promise<Api.ChatFull> {
    const chat = await this.repo.findById(chatId)
    if (!chat) {
      throw new NotFoundEntityError('chats.getChatFull')
    }

    return this.builder.chats.buildFull(requesterId, chat)
  }

  public async resolveUsername(username: string, requesterId: string): Promise<WithTypename<Api.Peer> | undefined> {
    if (username[0] === '@') {
      username.slice(1)
    }
    const user = await this.prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: 'insensitive',
        },
        // id: requesterId,
      },
      select: {
        ...selectUserFields(),
      },
    })
    if (user) {
      const builded = this.builder.users.buildWithStatus(requesterId, user)
      return {
        ...builded,
        __typename: 'User',
      }
    }

    const chat = await this.prisma.chat.findMany({
      where: {
        inviteLink: {
          equals: `p.me/${username}`,
          mode: 'insensitive',
        },
      },
      include: {
        ...selectChatFields(),
      },
    })

    if (chat[0]) {
      const builded = this.builder.chats.build(requesterId, chat[0])
      return {
        ...builded,
        __typename: 'Chat',
      }
    }

    throw new UsernameNotOccupiedError('chats.resolveUsername')
  }
}
