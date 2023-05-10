import { Module } from '@nestjs/common'
import { ConversationsService } from './conversations.service'
import { ConversationsResolver } from './conversations.resolver'
import { PrismaService } from 'src/prisma.service'
import { PubSubModule } from 'src/pubsub/pubsub.module'

@Module({
  imports: [PubSubModule],
  providers: [ConversationsResolver, ConversationsService, PrismaService],
})
export class ConversationsModule {}
