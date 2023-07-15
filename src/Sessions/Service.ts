import { Injectable } from '@nestjs/common'
import { PrismaService } from 'prisma.service'

import { SessionData } from './Types'

@Injectable()
export class SessionService {
  constructor(private readonly prismaService: PrismaService) {}

  public create(input: SessionData, userId: string) {
    console.log(userId)
    return this.prismaService.session.create({
      data: {
        ...input,
        userId,
      },
    })
  }

  public findByUser() {}

  public deleteById() {}

  public deleteAllByUser() {}
}
