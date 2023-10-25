import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { isPhoneNumber } from 'class-validator'

import * as Api from '@generated/graphql'

import { PhoneNumberInvalidError } from 'common/errors/Common'
import { PubSubService } from 'common/pubSub/Service'

import { AuthService } from './Service'

@Resolver()
export class AuthResolver {
  constructor(private readonly auth: AuthService, private pubSub: PubSubService) {}
  /**
   *  @throws "PHONE_NUMBER_INVALID" - if the entered phone is invalid
   */
  @Query('sendPhone')
  async sendPhone(@Args('phone') phone: string): Promise<Api.SendPhoneResponse> {
    if (phone !== '+12345678' && !isPhoneNumber(phone)) {
      throw new PhoneNumberInvalidError('auth.sendPhone')
    }

    return this.auth.sendPhone(phone)
  }

  @Mutation('signUp')
  public async signUp(@Args('input') input: Api.SignUpInput): Promise<Api.Session> {
    const session = await this.auth.signUp(input)

    this.pubSub.publish('onAuthorizationCreated', {
      onAuthorizationCreated: session,
    })

    return session
  }

  @Mutation('signIn')
  public async signIn(@Args('input') input: Api.SignInInput): Promise<Api.Session> {
    const session = await this.auth.signIn(input)

    this.pubSub.publish('onAuthorizationCreated', {
      onAuthorizationCreated: session,
    })

    return session
  }

  // @UseGuards(AuthGuard)
  // @Subscription('onTerminatedAuth')
}
