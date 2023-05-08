import { UseGuards } from '@nestjs/common'

import { JwtPayload } from '../authorization/auth.type'
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'

import { UsersService } from './users.service'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'
import { JwtAuthGuard } from 'src/common/guards/jwt.guard'
import { CreateUserInput, CreateUsernameInput } from 'src/types/graphql'
import { AuthService } from 'src/authorization/auth.service'

@Resolver('User')
export class UsersResolver {
  constructor(private usersService: UsersService, private authService: AuthService) {}

  @Mutation('createUser')
  public create(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput)
  }

  @Mutation('createUsername')
  @UseGuards(JwtAuthGuard)
  public async createUsername(
    @Args('createUsernameInput') createUsernameInput: CreateUsernameInput,
    @CurrentUser() user: JwtPayload,
  ) {
    const created = await this.usersService.verifyAndCreateUsername(user, createUsernameInput)

    return this.authService.buildLoginResponse(created)
  }

  @Query('searchUsers')
  @UseGuards(JwtAuthGuard)
  public async searchUsers(@Args('username') username: string, @CurrentUser('username') myUsername: string) {
    return this.usersService.findManyByUsername(myUsername, username)
  }
}
