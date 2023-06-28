import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import type { Request } from 'express'

import type { SendPhoneResponse, SignInInput } from 'types/graphql'

import { AuthService } from './auth.service'
import { SignUpInput } from './auth.type'
import { FileUpload } from 'graphql-upload'

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  @Query('sendCode')
  async sendCode(@Args('phone') phone: string) {
    return this.authService.sendCode(phone)
  }

  @Mutation('sendPhone')
  async sendPhone(@Args('phone') phone: string): Promise<SendPhoneResponse> {
    return this.authService.sendPhone(phone)
  }

  @Mutation('signUp')
  public async signUp(@Args('input') input: SignUpInput, @Args('photo') photo?: FileUpload) {
    return this.authService.signUp(input, photo)
  }

  @Mutation('signIn')
  public async signIn(@Args('input') input: SignInInput, @Context('req') req: Request) {
    console.log(req.headers)
    return this.authService.signIn(input)
  }

  @Query('getTwoFa')
  async getTwoFa(@Args('token') token: string) {
    return this.authService.getTwoFa(token)
  }
}
