import { Injectable } from '@nestjs/common'
import { PrismaService } from 'common/prisma'
import type * as Api from '@generated/graphql'
import type { Nullable } from 'types/other'
import { InvalidFolderId } from 'common/errors/Folders'
import { selectChatFields } from 'common/builder/chats'
import { FOLDER_ID_ALL } from 'common/constants'
@Injectable()
export class FoldersRepository {
  public constructor(private prisma: PrismaService) {}

  public async add(requesterId: string, input: Api.AddChatFolderInput) {
    const { pinnedChats, excludedChats, includedChats, ...primaryFields } = input
    const folder = await this.prisma.chatFolder.create({
      data: {
        userId: requesterId,
        ...primaryFields,
        ...this.connectChats({ pinnedChats, excludedChats, includedChats }),
      },
      include: {
        excludedChats: {
          include: {
            ...selectChatFields(),
          },
        },
        includedChats: {
          include: {
            ...selectChatFields(),
          },
        },
        pinnedChats: {
          include: {
            ...selectChatFields(),
          },
        },
      },
    })

    await this.prisma.user.update({
      where: {
        id: requesterId,
      },
      data: {
        orderedFoldersIds: {
          push: folder.orderId,
        },
      },
    })

    return folder
  }

  public async delete(requesterId: string, folderId: number) {
    const { foldersNotBuilded, orderedIds } = await this.getAll(requesterId)
    const folder = foldersNotBuilded.find((f) => f.orderId === folderId)

    if (!folder) {
      throw new InvalidFolderId('folders.delete')
    }
    const exlcluded = orderedIds.filter((id) => id !== folderId)

    return this.prisma.user
      .update({
        where: {
          id: requesterId,
        },
        data: {
          folders: {
            delete: {
              id: folder.id,
            },
          },
          orderedFoldersIds: {
            set: exlcluded,
          },
        },
      })
      .then(() => true)
  }

  public async getAll(requesterId: string) {
    const foldersNotBuilded = await this.prisma.chatFolder.findMany({
      where: {
        userId: requesterId,
      },
      include: {
        excludedChats: {
          include: {
            ...selectChatFields(),
          },
        },
        includedChats: {
          include: {
            ...selectChatFields(),
          },
        },
        pinnedChats: {
          include: {
            ...selectChatFields(),
          },
        },
      },
    })

    const { orderedFoldersIds } = await this.prisma.user.findFirstOrThrow({
      where: {
        id: requesterId,
      },
      select: {
        orderedFoldersIds: true,
      },
    })

    return { foldersNotBuilded, orderedIds: orderedFoldersIds }
  }

  public async createDefaultFolder(requesterId: string) {
    await this.prisma.user.update({
      where: {
        id: requesterId,
      },
      data: {
        folders: {
          create: {
            orderId: FOLDER_ID_ALL,
            title: 'All',
            excludeArchived: true,
          },
        },
        orderedFoldersIds: [FOLDER_ID_ALL],
      },
    })
  }

  private connectChats({
    pinnedChats,
    excludedChats,
    includedChats,
  }: {
    pinnedChats: Nullable<string[]> | undefined
    excludedChats: Nullable<string[]> | undefined
    includedChats: Nullable<string[]> | undefined
  }) {
    return {
      ...(pinnedChats?.length && {
        pinnedChats: {
          connect: pinnedChats.map((id) => ({
            id,
          })),
        },
      }),
      ...(excludedChats?.length && {
        pinnedChats: {
          connect: excludedChats.map((id) => ({
            id,
          })),
        },
      }),
      ...(includedChats?.length && {
        pinnedChats: {
          connect: includedChats.map((id) => ({
            id,
          })),
        },
      }),
    }
  }
}
