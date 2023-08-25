import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { FileUpload } from 'graphql-upload'
import { isPhoneNumber } from 'class-validator'

import { type SendPhoneResponse, SignInInput, SignUpInput, Session } from '@generated/graphql'

import { CurrentSession } from 'common/decorators/Session'
import { PhoneNumberInvalidError } from 'common/errors/Common'

import { AuthService } from './Service'

@Resolver()
export class AuthResolver {
  constructor(private readonly auth: AuthService) {}
  /**
   *  @throws "PHONE_NUMBER_INVALID" - if the entered phone is invalid
   */
  @Query('sendPhone')
  async sendPhone(@Args('phone') phone: string): Promise<SendPhoneResponse> {
    if (phone !== '+12345678' && !isPhoneNumber(phone)) {
      throw new PhoneNumberInvalidError('auth.sendPhone')
    }

    return this.auth.sendPhone(phone)
  }

  @Mutation('signUp')
  public async signUp(@Args('input') input: SignUpInput, @Args('photo') photo?: FileUpload) {
    return this.auth.signUp(input, photo)
  }

  @Mutation('signIn')
  public async signIn(@Args('input') input: SignInInput) {
    return this.auth.signIn(input)
  }

  @Mutation('terminateAuthorization')
  public async terminateAuthorization(@CurrentSession() session: Session, @Args('id') id: string) {
    return this.auth.terminateAuthorization(session, id)
  }

  @Mutation('terminateAllAuthorizations')
  public async terminateAllAuthorizations(@CurrentSession() session: Session) {
    /* validate, if can delete sessions, check on 24hrs */
    return this.auth.terminateAllAuthorizations(session)
  }
}
