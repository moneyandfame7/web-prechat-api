import { Args, Mutation, Resolver } from '@nestjs/graphql';
import type { AuthResponse, AuthInput } from 'src/graphql';

import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation('login')
  async login(@Args('loginInput') loginInput: AuthInput): Promise<AuthResponse> {
    return this.authService.login(loginInput);
  }

  @Mutation('refresh')
  async refresh(@Args('refreshInput') refreshInput: AuthInput): Promise<AuthResponse> {
    return this.authService.refresh(refreshInput.token);
  }
}
