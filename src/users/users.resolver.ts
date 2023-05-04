import { UseGuards } from '@nestjs/common';

import { JwtPayload } from '../authorization/auth.type';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { UsersService } from './users.service';
import { CurrentUser } from 'src/common/decorators/gql-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { CreateUserInput, CreateUsernameInput, UpdateUserInput, User } from 'src/graphql';
import { AuthService } from 'src/authorization/auth.service';

@Resolver('User')
export class UsersResolver {
  constructor(private usersService: UsersService, private authService: AuthService) {}

  @Mutation('createUser')
  public create(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Query('me')
  @UseGuards(JwtAuthGuard)
  public async me(@CurrentUser() user: User): Promise<User> {
    console.log(user);
    return user;
  }

  @Mutation('updateUser')
  @UseGuards(JwtAuthGuard)
  public update(@Args('updateUserInput') updateUserInput: UpdateUserInput, @CurrentUser() user: JwtPayload) {
    return this.usersService.update(user.id, updateUserInput);
  }

  @Mutation('createUsername')
  @UseGuards(JwtAuthGuard)
  public async createUsername(
    @Args('createUsernameInput') createUsernameInput: CreateUsernameInput,
    @CurrentUser() user: JwtPayload,
  ) {
    const created = await this.usersService.verifyAndCreateUsername(user, createUsernameInput);

    return this.authService.buildLoginResponse(created);
  }
}
