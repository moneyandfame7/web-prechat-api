import { Module } from '@nestjs/common'

import { ChatsModule } from 'Chats'

import { PrismaService } from 'common/prisma.service'
import { BuilderModule } from 'common/builders/Module'

import { MessagesResolver } from './Resolver'
import { MessagesService } from './Service'
import { MessagesRepository } from './Repository'

@Module({
  imports: [ChatsModule, BuilderModule],
  providers: [PrismaService, MessagesResolver, MessagesService, MessagesRepository],
})
export class MessagesModule {}
