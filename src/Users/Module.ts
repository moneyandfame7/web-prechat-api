import { Module, forwardRef } from '@nestjs/common'

import { ChatsModule } from 'Chats'

import { PrismaService } from 'common/prisma.service'
import { BuilderModule } from 'common/builder/Module'

import { UserResolver } from './Resolver'
import { UserService } from './Service'
import { UserRepository } from './Repository'

@Module({
  imports: [forwardRef(() => ChatsModule), BuilderModule],
  providers: [UserService, UserResolver, UserRepository, PrismaService],
  exports: [UserService],
})
export class UserModule {}
