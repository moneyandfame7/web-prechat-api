import { Injectable } from '@nestjs/common'
import type { Prisma } from '@prisma/client'
import { BuilderService } from 'common/builder/Service'
import { selectUserFields } from 'common/builder/users'
import { PrismaService } from 'common/prisma'

@Injectable()
export class MediaRepository {
  public constructor(private prisma: PrismaService, private builder: BuilderService) {}

  public async createPhoto(requesterId: string, photo: Prisma.PhotoCreateInput) {
    return this.prisma.photo.create({
      data: {
        ...photo,
        user: {
          connect: {
            id: requesterId,
          },
        },
        // userId: requesterId,
      },
      select: {
        date: true,
        blurHash: true,
        height: true,
        width: true,
        id: true,
        url: true,
      },
    })

    // return this.builder.build(result, requesterId)
  }
}
