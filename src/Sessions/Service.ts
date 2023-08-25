import { Injectable } from '@nestjs/common'
import type { SessionData } from '@generated/graphql'

import { PrismaService } from 'common/prisma.service'

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

  public create(input: SessionData, userId: string) {
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
    try {
      await this.prisma.session.delete({
        where: {
          id,
        },
      })
      return true
    } catch (e) {
      return false
    }
  }
}
