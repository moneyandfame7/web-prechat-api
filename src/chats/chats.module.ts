import { Module } from '@nestjs/common'

import { PrismaService } from 'prisma.service'
import { PubSubModule } from 'pubsub/pubsub.module'
import { ChatService } from './chats.service'
import { ChatsResolver } from './chats.resolver'
@Module({
  imports: [PubSubModule],
  providers: [ChatsResolver, ChatService, PrismaService],
})
export class ChatsModule {}
