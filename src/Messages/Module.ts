import { Module } from '@nestjs/common'
import { MessagesService } from './Service'
import { MessagesResolver } from './Resolver'
import { MessagesRepository } from './Repository'
import { ChatsModule } from 'Chats'
import { PrismaService } from 'common/prisma.service'
import { BuilderModule } from 'common/builder/Module'

@Module({
  imports: [ChatsModule, BuilderModule],
  providers: [PrismaService, MessagesResolver, MessagesService, MessagesRepository],
})
export class MessagesModule {}
