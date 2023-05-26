import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import type { AuthResponse, AuthInput } from 'src/types/graphql'

import { AuthService } from './auth.service'
import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/common/guards/jwt.guard'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'
import { User } from '@prisma/client'

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation('login')
  async login(@Args('loginInput') loginInput: AuthInput): Promise<AuthResponse> {
    return this.authService.login(loginInput)
  }

  @Mutation('refresh')
  async refresh(@Args('refreshInput') refreshInput: AuthInput): Promise<AuthResponse> {
    return this.authService.refresh(refreshInput.token)
  }

  @Query('protected')
  @UseGuards(JwtAuthGuard)
  async protected(@CurrentUser() user: User) {
    return user
  }
}
