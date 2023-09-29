import { Injectable } from '@nestjs/common'
import type * as Api from '@generated/graphql'

import { getRandomColor } from 'Media'

import { PrismaService } from 'common/prisma.service'
import { unformatString } from 'common/utils/unformatString'
import { buildPrivacySettings } from 'common/builder/users'
import { ChatRepository } from 'Chats/Repository'
import { generateId } from 'common/helpers/generateId'
import { FoldersRepository } from 'Folders/Repository'

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService, private chats: ChatRepository, private folders: FoldersRepository) {}

  public async create(input: Api.CreateUserInput) {
    const created = await this.prisma.user.create({
      data: {
        id: generateId('user'),
        firstName: input.firstName,
        lastName: input.lastName,
        phoneNumber: unformatString(input.phoneNumber),
        privacySettings: buildPrivacySettings(),
        color: getRandomColor(),
      },
    })
    /**
     * By default, we are creating folder, saved messages and service chat
     */
    // this.chats.createSavedMessages(created)
    this.chats.createServiceChat(created)
    this.folders.createDefaultFolder(created.id)

    return created.id
  }
}
