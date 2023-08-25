import { Injectable } from '@nestjs/common'

import type * as Api from '@generated/graphql'

import { FirebaseService } from 'common/Firebase/Service'
import { PrismaService } from '../common/prisma.service'

import { buildApiUser, buildPrivacySettings, buildUserFullInfo, selectUserFieldsToBuild } from 'common/builder/users'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private firebaseService: FirebaseService) {}

  public async create({ firstName, lastName, phoneNumber }: Api.CreateUserInput) {
    return this.prisma.user.create({
      data: {
        firstName,
        lastName,
        phoneNumber,
        fullInfo: buildUserFullInfo(),
        privacySettings: buildPrivacySettings(),
      },
    })
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

    return users.map((user) => buildApiUser(requesterId, user))
  }

  public async getUserFull(input: Api.UserInput): Promise<Api.UserFull> {
    const result = await this.prisma.user.findFirstOrThrow({
      where: {
        id: input.userId,
      },
      select: {
        fullInfo: {
          select: {
            avatar: true,
            bio: true,
          },
        },
      },
    })
    return result?.fullInfo as Api.UserFull
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
