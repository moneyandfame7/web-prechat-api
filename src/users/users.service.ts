import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}
  create(createUserInput: Prisma.UserCreateInput) {
    return this.prismaService.user.create({
      data: createUserInput,
    });
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
