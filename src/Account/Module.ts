import { Module } from '@nestjs/common'

import { SessionsModule } from 'Sessions/Module'

import { AccountService } from './Service'
import { AccountRepository } from './Repository'
import { AccountResolver } from './Resolver'

@Module({
  imports: [SessionsModule],
  providers: [AccountResolver, AccountService, AccountRepository],
  exports: [AccountService],
})
export class AccountModule {}
