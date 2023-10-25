import { Injectable } from '@nestjs/common'
import type * as Api from '@generated/graphql'

import { getRandomColor } from 'Media'
import { ChatsRepository } from 'Chats/Repository'

import { PrismaService } from 'common/prisma.service'
import { unformatString } from 'common/utils/unformatString'
import { generateId } from 'common/helpers/generateId'

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService, private chats: ChatsRepository) {}

  public async create(input: Api.CreateUserInput) {
    const created = await this.prisma.user.create({
      data: {
        id: generateId('user'),
        firstName: input.firstName,
        lastName: input.lastName,
        phoneNumber: unformatString(input.phoneNumber),
        color: getRandomColor(),
      },
    })
    /**
     * By default, we are creating folder, saved messages and service chat
     */
    // this.chats.createSavedMessages(created)
    this.chats.createServiceChat(created)
    // this.folders.createDefaultFolder(created.id)

    return created.id
  }
}
