import { Module } from '@nestjs/common'

import { SessionsModule } from 'Sessions/Module'

import { PrismaService } from 'common/prisma.service'
import { BuilderModule } from 'common/builder/Module'

import { AccountService } from './Service'
import { AccountRepository } from './Repository'
import { AccountResolver } from './Resolver'

@Module({
  imports: [SessionsModule, BuilderModule],
  providers: [AccountResolver, AccountService, AccountRepository, PrismaService],
  exports: [AccountService],
})
export class AccountModule {}
