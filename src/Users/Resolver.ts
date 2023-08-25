import { Args, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { GetUsersInput, UserInput } from '@generated/graphql'

import { AuthGuard } from 'Auth/Guard'
import { CurrentSession } from 'common/decorators/Session'

import { UserService } from './Service'

@Resolver()
export class UserResolver {
  constructor(private users: UserService) {}

  /**
   *
   * @returns
   */
  @Query('getUsers')
  @UseGuards(AuthGuard)
  public async getUsers(@CurrentSession('userId') currentUserId: string, @Args('input') input: GetUsersInput) {
    return this.users.getUsers(currentUserId, input)
  }

  /**
   *
   * @param input User ID.
   * @returns User full info by id.
   */
  @Query('getUserFull')
  @UseGuards(AuthGuard)
  public async getUserFull(/* @CurrentSession('userId') currentUserId: string, */ @Args('input') input: UserInput) {
    return this.users.getUserFull(input)
  }
}