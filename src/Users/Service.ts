import { Injectable } from '@nestjs/common'

import type * as Api from '@generated/graphql'

import { PrismaService } from 'common/prisma.service'
import { selectUserFields } from 'common/builder/users'
import { BuilderService } from 'common/builder/Service'

import { UserRepository } from './Repository'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private repository: UserRepository, private builder: BuilderService) {}

  public async create(input: Api.CreateUserInput): Promise<Api.InputUser> {
    const id = await this.repository.create(input)

    return { userId: id }
  }

  public async getUsers(requesterId: string, input: Api.GetUsersInput): Promise<Api.User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        id: {
          in: input.ids,
        },
      },
      select: {
        ...selectUserFields(),
      },
    })

    return this.builder.buildApiUsersAndStatuses(users, requesterId)
  }

  public async getApiById(requesterId: string, id: string) {
    const result = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        ...selectUserFields(),
        photo: {
          select: {
            blurHash: true,
            date: true,
            id: true,
            url: true,
          },
        },
      },
    })
    if (!result) {
      return undefined
    }

    return this.builder.buildApiUser(result, requesterId) as Api.User
  }

  public async getApiByPhone(requesterId: string, phoneNumber: string) {
    const result = await this.prisma.user.findUnique({
      where: {
        phoneNumber,
      },
      select: {
        ...selectUserFields(),
      },
    })
    if (!result) {
      return undefined
    }
    // result.blo
    return this.builder.buildApiUser(result, requesterId) as Api.User
  }

  public async getById(userId: string) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    })
  }

  public async getByPhone(phoneNumber: string) {
    return this.prisma.user.findUnique({
      where: {
        phoneNumber,
      },
    })
  }
}
