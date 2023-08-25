import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CurrentSession } from 'common/decorators/Session'

import { AccountService } from './Service'

@Resolver('Account')
export class AccountResolver {
  public constructor(private account: AccountService) {}

  @Query('getPassword')
  public async getPassword(@CurrentSession('userId') currentUserId: string) {
    return this.account.getPassword(currentUserId)
  }

  @Mutation('checkPassword')
  public async checkPassword(@CurrentSession('userId') currentUserId: string, @Args('password') password: string) {
    return this.account.checkPassword(currentUserId, password)
  }
}
