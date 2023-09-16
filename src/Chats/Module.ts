import { Module, forwardRef } from '@nestjs/common'

import { PrismaService } from 'common/prisma.service'
import { PubSubModule } from 'common/pubSub/Module'
import { BuilderModule } from 'common/builder/Module'

import { UserModule } from 'Users'

import { ChatsResolver } from './Resolver'
import { ChatService } from './Service'
import { ChatRepository } from './Repository'
@Module({
  imports: [PubSubModule, forwardRef(() => UserModule), BuilderModule],
  providers: [ChatsResolver, ChatService, ChatRepository, PrismaService],
  exports: [ChatService, ChatRepository],
})
export class ChatsModule {}
