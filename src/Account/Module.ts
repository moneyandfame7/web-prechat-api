import { Module } from '@nestjs/common'

import { PrismaService } from 'common/prisma.service'

import { AccountService } from './Service'
import { AccountRepository } from './Repository'
import { AccountResolver } from './Resolver'

@Module({
  imports: [],
  providers: [PrismaService, AccountResolver, AccountService, AccountRepository],
  exports: [AccountService],
})
export class AccountModule {}
