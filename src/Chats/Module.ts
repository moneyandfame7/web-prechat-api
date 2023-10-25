import { Module, forwardRef } from '@nestjs/common'

import { PrismaService } from 'common/prisma.service'
import { BuilderModule } from 'common/builder/Module'

import { UserModule } from 'Users'

import { ChatsResolver } from './Resolver'
import { ChatService } from './Service'
import { ChatsRepository } from './Repository'
@Module({
  imports: [forwardRef(() => UserModule), BuilderModule],
  providers: [ChatsResolver, ChatService, ChatsRepository, PrismaService],
  exports: [ChatService, ChatsRepository],
})
export class ChatsModule {}
