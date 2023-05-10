import { UpdateUserInput, CreateUserInput } from 'src/types/graphql'
import { Injectable } from '@nestjs/common'
import { JwtPayload } from 'src/authorization/auth.type'

import { PrismaService } from 'src/prisma.service'

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  public create(createUserInput: CreateUserInput) {
    return this.prismaService.user.create({
      data: createUserInput,
    })
  }

  public async verifyAndCreateUsername(user: JwtPayload, username: string) {
    const alreadyExist = await this.prismaService.user.findUnique({
      where: {
        username,
      },
    })
    if (alreadyExist) {
      throw new Error('Username already exist.')
    }
    return this.update(user.id, { username })
  }

  findMany() {
    return this.prismaService.user.findMany({
      include: {
        messages: true,
      },
    })
  }

  findOne(id: string) {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
    })
  }

  findManyByUsername(myUsername: string, searchedUsername: string) {
    return this.prismaService.user.findMany({
      where: {
        username: {
          contains: searchedUsername,
          not: myUsername,
          mode: 'insensitive',
        },
      },
    })
  }

  async findOneByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: {
        email,
      },
    })
  }

  update(id: string, updateUserInput: UpdateUserInput) {
    return this.prismaService.user.update({
      where: {
        id,
      },
      data: updateUserInput,
    })
  }

  delete(id: string) {
    return this.prismaService.user.delete({
      where: {
        id,
      },
    })
  }
}
