import { Module } from '@nestjs/common'

import { AuthModule } from 'Auth/Module'
import { UserModule } from 'Users/Module'
import { ChatsModule } from 'Chats/Module'

import { PubSubModule } from 'common/pubSub'
import { PrismaService } from 'common/prisma.service'

import { ContactsService } from './Service'
import { ContactsResolver } from './Resolver'
import { ContactsRepository } from './Repository'

@Module({
  imports: [PubSubModule, AuthModule, UserModule, ChatsModule],
  providers: [ContactsResolver, ContactsService, ContactsRepository, PrismaService],
  exports: [ContactsService],
})
export class ContactsModule {}
