import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ApiToken } from '@prisma/client'
import { ApiError } from 'common/errors'
import { PrismaService } from 'prisma.service'
import { UserService } from 'users/users.service'
import { v4 as uuid } from 'uuid'

@Injectable()
export class ApiService {
  public constructor(
    private readonly userService: UserService,
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  public async generateApiToken(phoneNumber: string) {
    const user = await this.userService.getApiTokenByPhone(phoneNumber)
    if (!user) {
      throw new ApiError('PHONE_NOT_FOUND')
    }
    const hasToken = Boolean(user?.apiToken)
    if (hasToken) {
      throw new ApiError('API_ALREADY_HAS_TOKEN')
    }
    const apiToken = await this.createApiToken(user.id)

    return apiToken.hash
  }

  public async verifyApiToken(token: string) {
    const verified = this.decodeApiToken(token)

    const apiToken = await this.prismaService.apiToken.findUniqueOrThrow({
      where: {
        id: verified.id,
      },
    })

    return Boolean(apiToken)
  }

  private createApiToken(userId: string) {
    const id = uuid()
    const hash = this.encodeApiToken({
      id: id,
      userId,
    })
    return this.prismaService.apiToken.create({
      data: {
        id,
        hash,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    })
  }

  private encodeApiToken(token: { id: string; userId: string }) {
    return this.jwtService.sign(token)
  }

  public decodeApiToken(token: string) {
    try {
      return this.jwtService.verify(token) as ApiToken
    } catch (e) {
      throw new ApiError('API_TOKEN_INVALID')
    }
  }
}
