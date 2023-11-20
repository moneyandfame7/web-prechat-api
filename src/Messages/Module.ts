import { Module } from '@nestjs/common'

import { ChatsModule } from 'Chats'
import { MediaModule } from 'Media'

import { PrismaService } from 'common/prisma.service'
import { BuilderModule } from 'common/builders/Module'
import { FirebaseModule } from 'common/Firebase'

import { MessagesResolver } from './Resolver'
import { MessagesService } from './Service'
import { MessagesRepository } from './Repository'

@Module({
  imports: [ChatsModule, BuilderModule, MediaModule, FirebaseModule],
  providers: [PrismaService, MessagesResolver, MessagesService, MessagesRepository],
})
export class MessagesModule {}
