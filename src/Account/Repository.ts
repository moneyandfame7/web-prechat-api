import { Injectable } from '@nestjs/common'
import { PrismaService } from 'common/prisma.service'

@Injectable()
export class AccountRepository {
  public constructor(private prisma: PrismaService) {}

  public async getPassword(requesterId: string) {
    return this.prisma.twoFaAuth.findUnique({
      where: {
        userId: requesterId,
      },
    })
  }
}
