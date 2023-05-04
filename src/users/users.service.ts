import { Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { AuthService } from 'src/auth/auth.service';
import { JwtPayload } from 'src/auth/auth.type';
import { GraphqlErrorCode } from 'src/common/constants/auth';
import { CreateUserInput, CreateUsernameInput, UpdateUserInput } from 'src/graphql';

import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  public create(createUserInput: CreateUserInput) {
    return this.prismaService.user.create({
      data: createUserInput,
    });
  }

  public async verifyAndCreateUsername(user: JwtPayload, input: CreateUsernameInput) {
    try {
      const alreadyExist = await this.prismaService.user.findUnique({
        where: {
          ...input,
        },
      });
      if (alreadyExist) {
        throw new GraphQLError('Username already taken. Try another.', {
          extensions: {
            code: GraphqlErrorCode.BadRequest,
          },
        });
      }
      return this.update(user.id, input);
    } catch (e) {
      console.log(e);
    }
  }

  findMany() {
    return this.prismaService.user.findMany({
      include: {
        messages: true,
      },
    });
  }

  findOne(id: string) {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findOneByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }

  update(id: string, updateUserInput: UpdateUserInput) {
    return this.prismaService.user.update({
      where: {
        id,
      },
      data: updateUserInput,
    });
  }

  delete(id: string) {
    return this.prismaService.user.delete({
      where: {
        id,
      },
    });
  }
}
