import { Injectable } from '@nestjs/common'

import type {
  AddChatMembersInput,
  ChatInput,
  ChatSettings,
  CreateChannelInput,
  CreateGroupInput,
  DeleteChatMemberInput,
  User,
  ChatCreatedUpdate,
} from '@generated/graphql'

import { buildApiUser, isSelf, selectUserFieldsToBuild } from 'common/builder/users'
import { buildApiChat, buildApiChatSettings } from 'common/builder/chats'

import { PrismaService } from '../common/prisma.service'
import { ChatRepository } from './Repository'

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService, private readonly repo: ChatRepository) {}

  public async createGroup(requesterId: string, input: CreateGroupInput) {
    const result = await this.prisma.chat.create({
      data: {
        type: 'chatTypeGroup',
        title: input.title,
        fullInfo: {
          create: {
            members: {
              createMany: {
                data: input.users.map((u) => ({
                  inviterId: requesterId,
                  userId: u,
                  isAdmin: isSelf(requesterId, u),
                  isOwner: isSelf(requesterId, u),
                  unreadCount: isSelf(requesterId, u) ? 0 : 1,
                })),
              },
            },
          },
        },
        isPrivate: false,
      },
      include: {
        fullInfo: {
          include: {
            members: true,
          },
        },
      },
    })

    return buildApiChat(requesterId, result)
  }

  public async createChannel(requesterId: string, input: CreateChannelInput): Promise<ChatCreatedUpdate> {
    const memberIds = [...(input.users ? new Set([...input.users, requesterId]) : requesterId)]

    const result = await this.prisma.chat.create({
      data: {
        title: input.title,

        type: 'chatTypeChannel',
        fullInfo: {
          create: {
            members: input.users
              ? {
                  createMany: {
                    data: memberIds.map((u) => ({
                      unreadCount: isSelf(requesterId, u) ? 0 : 1,
                      isOwner: isSelf(requesterId, u),
                      isAdmin: isSelf(requesterId, u),
                      inviterId: requesterId,
                      userId: u,
                    })),
                  },
                }
              : undefined,
            description: input.description,
          },
        },

        isPrivate: false,
      },
      include: {
        fullInfo: {
          include: {
            members: {
              include: {
                member: {
                  select: {
                    ...selectUserFieldsToBuild(),
                  },
                },
              },
            },
          },
        },
      },
    })

    const forBuildUsers = result.fullInfo!.members.map((u) => u.member)
    const chat = buildApiChat(requesterId, result)
    const users = forBuildUsers?.map((u) => buildApiUser(requesterId, u))
    return {
      chat,
      users,
    }
  }

  public async getChats(requesterId: string) {
    const result = await this.prisma.chat.findMany({
      where: {
        fullInfo: {
          members: {
            some: {
              userId: requesterId,
            },
          },
        },
      },
      include: {
        fullInfo: {
          include: {
            members: true,
          },
        },
      },
    })

    if (!result || result.length === 0) {
      return []
    }

    return result.map((c) => buildApiChat(requesterId, c))
  }

  public async addChatMembers(input: AddChatMembersInput) {
    return true
  }

  public async deleteChatMember(input: DeleteChatMemberInput) {
    return true
  }

  public async deleteChat(input: ChatInput) {
    return true
  }

  public async getChatSettings(
    requesterId: string,
    input: ChatInput,
  ): Promise<
    | {
        users: User[]
        settings: ChatSettings
      }
    | undefined
  > {
    const result = await this.prisma.chat.findUnique({
      where: {
        id: input.chatId,
      },
      select: {
        fullInfo: {
          select: {
            members: {
              include: {
                member: {
                  select: {
                    ...selectUserFieldsToBuild(),
                  },
                },
              },
            },
          },
        },
      },
    })
    if (!result || !result.fullInfo) {
      return undefined
    }

    const users = result.fullInfo.members?.map((m) => buildApiUser(requesterId, m.member))
    const settings = buildApiChatSettings(users)

    return {
      users,
      settings,
    }
  }
}
