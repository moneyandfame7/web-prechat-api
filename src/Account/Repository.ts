import { Injectable } from '@nestjs/common'
import type * as Api from '@generated/graphql'

import { PrismaService } from 'common/prisma.service'
import { selectUserFields } from 'common/selectors'

@Injectable()
export class AccountRepository {
  public constructor(private prisma: PrismaService) {}

  public async getActiveSessions(requesterId: string) {
    return this.prisma.session.findMany({
      where: {
        userId: requesterId,
      },
    })
  }

  public async createAuthorization(input: Api.SessionData, requesterId: string) {
    return this.prisma.session.create({
      data: {
        ...input,
        userId: requesterId,
      },
    })
  }

  public async updateUserLastActivity(currentSession: Api.Session) {
    const now = new Date()

    const user = await this.prisma.user.update({
      where: {
        id: currentSession.userId,
      },
      data: {
        lastActivity: now,
      },
      select: {
        ...selectUserFields(),
      },
    })

    return user
  }
}
