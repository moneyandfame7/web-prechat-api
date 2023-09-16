import { Injectable } from '@nestjs/common'
import type * as Api from '@generated/graphql'

import { PrismaService } from 'common/prisma.service'

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

  public create(input: Api.SessionData, userId: string) {
    return this.prisma.session.create({
      data: {
        ...input,
        userId,
      },
    })
  }

  public findByUser(requesterId: string) {
    return this.prisma.session.findMany({
      where: {
        userId: requesterId,
      },
    })
  }

  public getById(id: string) {
    return this.prisma.session.findUnique({
      where: {
        id,
      },
    })
  }

  public async deleteById(id: string) {
    return this.prisma.session.delete({
      where: {
        id,
      },
    })
  }

  public async updateActivity(id: string): Promise<Api.Session> {
    return this.prisma.session.update({
      where: {
        id,
      },
      data: {
        activeAt: new Date(),
      },
    })
  }

  public async deleteExceptCurrent(currentSession: Api.Session): Promise<Api.Session[]> {
    return this.prisma.$transaction(async (tx) => {
      const sessionsToDelete = await tx.session.findMany({
        where: {
          userId: currentSession.userId,
          NOT: {
            id: currentSession.id,
          },
        },
      })
      const idsToDelete = sessionsToDelete.map((s) => s.id)

      await tx.session.deleteMany({
        where: {
          id: {
            in: idsToDelete,
          },
        },
      })

      return sessionsToDelete
    })
  }
}
