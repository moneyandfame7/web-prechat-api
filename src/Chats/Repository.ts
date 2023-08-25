import { ChatType } from '@prisma/client'

import type { CreateChannelInput, CreateGroupInput } from '@generated/graphql'

import type { PrismaService } from 'common/prisma.service'
import { isSelf } from 'common/builder/users'

export class ChatRepository {
  constructor(private prisma: PrismaService) {}

  public async createGroup(input: CreateGroupInput) {
    return this.prisma.chat.create({
      data: {
        type: ChatType.chatTypeGroup,
        title: input.title,
        fullInfo: {
          create: {
            members: {
              createMany: {
                data: input.users.map((id) => ({
                  userId: id,
                })),
              },
            },
          },
        },
      },
    })
  }

  public async createChannel(requesterId: string, memberIds: string[], input: CreateChannelInput) {
    return this.prisma.chat.create({
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
            members: true,
          },
        },
      },
    })
  }
}
