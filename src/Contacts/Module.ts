import { Module } from '@nestjs/common'

import { UserModule } from 'Users/Module'
import { ChatsModule } from 'Chats/Module'

import { PubSubModule } from 'common/pubSub'
import { PrismaService } from 'common/prisma.service'

import { ContactsService } from './Service'
import { ContactsResolver } from './Resolver'
import { ContactsRepository } from './Repository'
import { BuilderModule } from 'common/builder/Module'

@Module({
  imports: [PubSubModule, UserModule, ChatsModule, BuilderModule],
  providers: [ContactsResolver, ContactsService, ContactsRepository, PrismaService],
  exports: [ContactsService],
})
export class ContactsModule {}
