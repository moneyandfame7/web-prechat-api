import { Injectable } from '@nestjs/common'
import type { SearchGlobalInput } from '@generated/graphql'

import { PrismaService } from 'common/prisma.service'
import { buildApiUser, selectUserFieldsToBuild } from 'common/builder/users'

@Injectable()
export class SearchRepository {
  constructor(private prisma: PrismaService) {}
  /**
   * Search users by username/firstName/lastName, which contact of requesterId.
   *
   * @returns
   */
  public async searchKnownUsers(requesterId: string, input: SearchGlobalInput) {
    const users = await this.prisma.user.findMany({
      where: {
        addedByContacts: {
          some: {
            ownerId: requesterId,
          },
        },
        OR: [
          {
            addedByContacts: {
              some: {
                OR: [
                  {
                    firstName: { contains: input.query, mode: 'insensitive' },
                  },
                  {
                    lastName: { contains: input.query, mode: 'insensitive' },
                  },
                ],
              },
            },
          },
          {
            username: { contains: input.query, mode: 'insensitive' },
          },
        ],
      },
      take: input.limit ?? undefined,
      select: selectUserFieldsToBuild(),
    })

    return users.map((u) => buildApiUser(requesterId, u))
  }

  public async searchGlobalUsers(requesterId: string, input: SearchGlobalInput) {
    /* JUST USERS */
    const users = await this.prisma.user.findMany({
      where: {
        username: { contains: input.query, mode: 'insensitive' },
        addedByContacts: {
          none: {
            ownerId: requesterId,
          },
        },
      },
      take: input.limit ?? undefined,
      select: selectUserFieldsToBuild(),
    })

    return users.map((u) => buildApiUser(requesterId, u))
  }

  public async searchKnownChats(requesterId: string, input: SearchGlobalInput) {
    /**  */
    // return this.prisma.chats.findMany({
    //   where:{
    //     participants:{
    //       some:{
    //         /*  */
    //       }
    //     }
    //   }
    // })
    return []
  }

  public async searchGlobalChats(input: SearchGlobalInput) {
    return []
  }
}
