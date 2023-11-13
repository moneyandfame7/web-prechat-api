import { Injectable } from '@nestjs/common'
import type { Prisma } from '@prisma/client'

import { BuilderService } from 'common/builders/Service'
import { PrismaService } from 'common/prisma.service'
import { selectChatFields, selectDocumentFields, selectMessageFields, selectPhotoFields } from 'common/selectors'

@Injectable()
export class MediaRepository {
  public constructor(private prisma: PrismaService, private builder: BuilderService) {}

  public async createAvatar(requesterId: string, photo: Prisma.PhotoCreateInput) {
    return this.prisma.photo.create({
      data: {
        ...photo,
        user: {
          connect: {
            id: requesterId,
          },
        },
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
  }

  public async createPhoto(photo: Prisma.PhotoUncheckedCreateInput) {
    return this.prisma.photo.create({
      data: {
        ...photo,
        ...(photo.messageId && { messageId: photo.messageId }),
      },
      select: {
        ...selectPhotoFields(),
        message: {
          include: {
            ...selectMessageFields(),
            chat: {
              include: {
                ...selectChatFields(),
              },
            },
          },
        },
      },
    })
  }

  public async createDocument(document: Prisma.DocumentUncheckedCreateInput) {
    return this.prisma.document.create({
      data: {
        ...document,
        ...(document.messageId && { messageId: document.messageId }),
      },
      select: {
        ...selectDocumentFields(),
        message: {
          include: {
            ...selectMessageFields(),
            chat: {
              include: {
                ...selectChatFields(),
              },
            },
          },
        },
      },
    })
  }
}
