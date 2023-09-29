import { Injectable } from '@nestjs/common'

import type * as Api from '@generated/graphql'

import { selectChatFields, createChatMembers } from 'common/builder/chats'

import { PrismaService } from '../common/prisma.service'
import { ChatRepository } from './Repository'
import { getRandomColor } from 'Media'
import { BuilderService } from 'common/builder/Service'
import { selectUserFieldsToBuild } from 'common/builder/users'
import { NotFoundEntityError, UsernameNotOccupiedError } from 'common/errors'
import type { WithTypename } from 'types/other'
import { createMessageAction } from 'common/builder/messages'
import { generateId } from 'common/helpers/generateId'

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repo: ChatRepository,
    private builder: BuilderService,
  ) {}

  public async createGroup(requesterId: string, input: Api.CreateGroupInput) {
    const memberIds = [...(input.users ? new Set([...input.users, requesterId]) : requesterId)]
    const chatId = generateId('chat')
    await this.prisma.chat.create({
      data: {
        id: chatId,
        type: 'chatTypeGroup',
        title: input.title,
        fullInfo: {
          create: {
            ...createChatMembers(requesterId, memberIds),
          },
        },
        isPrivate: true,
        color: getRandomColor(),
      },
      include: {
        ...selectChatFields(),
      },
    })

    const updated = await this.prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
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
            senderId: requesterId,
          },
        },
      },
      include: {
        ...selectChatFields(),
      },
    })
    // result.lastMessage?.action.
    // const members = result.fullInfo?.members.map((m) => m.user)
    // const users = members ? await this.users.buildApiUserAndStatuses(members, requesterId) : []
    // const chat = buildApiChat(requesterId, result)

    return updated
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
          },
        },
        lastMessage: {
          create: {
            action: {
              create: createMessageAction({ '@type': 'channelCreate' }, requesterId),
            },
            chatId,
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
      return this.builder.buildApiChat(exist, requesterId)
    }

    const result = await this.repo.createPrivate(requesterId, input.userId)

    return this.builder.buildApiChat(result, requesterId)
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
    })
  }

  public async getChatsTest(requesterId: string, input: Api.GetChatsInput) {
    // this.prisma.chat.findMany({
    //   where: {
    //     fullInfo: {
    //       members: {
    //         some: {
    //           userId: requesterId,
    //         },
    //       },
    //     },
    //     ...(input.archived && {
    //       inFolders: {
    //         some: {
    //           orderId: FOLDER_ID_ARCHIVED,
    //         },
    //       },
    //     }),
    //   },
    //   ...(input.offset && { skip: input.offset }),
    //   ...(input.limit && { take: input.limit }),
    // })
    const test = await this.prisma.chatMember.findMany({
      where: {
        userId: requesterId,
        ...(input.archived && { isArchived: true }),
      },
      include: {
        chatInfo: {
          include: {
            chat: true,
          },
        },
      },
    })
  }

  public async getChat(chatId: string, requesterId: string): Promise<Api.Chat> {
    const chat = await this.repo.findById(chatId)
    if (!chat) {
      throw new NotFoundEntityError('chats.getChatFull')
    }

    return this.builder.buildApiChat(chat, requesterId)
  }

  public async getChatFull(chatId: string, requesterId: string): Promise<Api.ChatFull> {
    const chat = await this.repo.findById(chatId)
    if (!chat) {
      throw new NotFoundEntityError('chats.getChatFull')
    }

    return this.builder.buildApiChatFull(chat, requesterId)
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
        ...selectUserFieldsToBuild(),
      },
    })
    if (user) {
      const builded = await this.builder.buildApiUserAndStatus(user, requesterId)
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
      const builded = this.builder.buildApiChat(chat[0], requesterId)
      return {
        ...builded,
        __typename: 'Chat',
      }
    }

    throw new UsernameNotOccupiedError('chats.resolveUsername')
  }
}
