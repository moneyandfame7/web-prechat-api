import { Module } from '@nestjs/common'

import { UserModule } from 'Users/Module'

import { PubSubModule } from 'common/pubSub'
import { PrismaService } from 'common/prisma.service'
import { BuilderModule } from 'common/builder/Module'

import { ContactsResolver } from './Resolver'
import { ContactsService } from './Service'
import { ContactsRepository } from './Repository'

@Module({
  imports: [PubSubModule, UserModule, BuilderModule],
  providers: [ContactsResolver, ContactsService, ContactsRepository, PrismaService],
  exports: [ContactsService],
})
export class ContactsModule {}
