import { Module, forwardRef } from '@nestjs/common'

import { FirebaseModule } from 'common/Firebase'
import { PrismaService } from 'common/prisma.service'

import { UserService } from './Service'
import { UserResolver } from './Resolver'
import { UserRepository } from './Repository'
import { AccountModule } from 'Account/Module'
import { ChatsModule } from 'Chats'
import { BuilderModule } from 'common/builder/Module'
import { FoldersModule } from 'Folders/Module'

@Module({
  imports: [FirebaseModule, forwardRef(() => AccountModule), ChatsModule, BuilderModule, FoldersModule],
  providers: [UserService, UserResolver, UserRepository, PrismaService],
  exports: [UserService],
})
export class UserModule {}
