import { Module } from '@nestjs/common'

import { PrismaService } from 'prisma.service'
import { PubSubModule } from 'PubSub/Module'
import { ChatService } from './Service'
import { ChatsResolver } from './Resolver'
@Module({
  imports: [PubSubModule],
  providers: [ChatsResolver, ChatService, PrismaService],
})
export class ChatsModule {}
