import { Module } from '@nestjs/common'

import { AuthModule } from 'Auth/Module'

import { PrismaService } from 'common/prisma.service'
import { PubSubModule } from 'common/pubSub/Module'

import { ChatsResolver } from './Resolver'
import { ChatService } from './Service'
import { ChatRepository } from './Repository'

@Module({
  imports: [PubSubModule, AuthModule],
  providers: [ChatsResolver, ChatService, ChatRepository, PrismaService],
  exports: [ChatService],
})
export class ChatsModule {}
