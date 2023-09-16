import { Injectable } from '@nestjs/common'

import type * as Api from '@generated/graphql'

import { PrismaService } from '../common/prisma.service'

import { buildApiUser, selectUserFieldsToBuild } from 'common/builder/users'
import { UserRepository } from './Repository'
import { BuilderService } from 'common/builder/Service'

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
        ...selectUserFieldsToBuild(),
      },
    })

    return this.builder.buildApiUsersAndStatuses(users, requesterId)
  }

  public async getTwoFaByPhone(phoneNumber: string) {
    return this.prisma.user.findUnique({
      where: {
        phoneNumber,
      },
      select: {
        twoFaAuth: {
          select: {
            email: true,
            hint: true,
            // password:true
          },
        },
      },
    })
  }

  public async getApiById(requesterId: string, id: string) {
    const result = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        ...selectUserFieldsToBuild(),
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

    return buildApiUser(requesterId, result) as Api.User
  }

  public async getApiByPhone(requesterId: string, phoneNumber: string) {
    const result = await this.prisma.user.findUnique({
      where: {
        phoneNumber,
      },
      select: {
        ...selectUserFieldsToBuild(),
      },
    })
    if (!result) {
      return undefined
    }

    return buildApiUser(requesterId, result) as Api.User
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
