import { Args, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { SearchGlobalInput, Session } from '@generated/graphql'

import { AuthGuard } from 'Auth'

import { CurrentSession } from 'common/decorators/Session'

import { SearchService } from './Service'

@Resolver('Search')
export class SearchResolver {
  constructor(private search: SearchService) {}

  // @Query('searchGlobal')
  // @UseGuards(AuthGuard)
  // async searchGlobal(@CurrentSession() session: Session, @Args('input') input: SearchGlobalInput) {
  //   return this.search.searchGlobal(session.userId, input)
  // }

  // @Query('searchUsers')
  // @UseGuards(AuthGuard)
  // async searchUsers(@CurrentSession() session: Session, @Args('input') input: SearchGlobalInput) {
  //   return this.search.searchUsers(session.userId, input)
  // }
}
