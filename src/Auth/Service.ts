import { Injectable } from '@nestjs/common'

import type { SessionData, Connection, SendPhoneResponse, SignInInput, SignUpInput } from '@generated/graphql'

import { UserService } from 'Users'
import { SessionService } from 'Sessions'
import { AccountService } from 'Account'

import { unformatString } from 'common/utils/unformatString'
import { FirebaseService } from 'common/Firebase'
import { AuthVerifyCodeError } from 'common/errors/Authorization'
import { PhoneNumberNotFoundError } from 'common/errors/Common'

@Injectable()
export class AuthService {
  constructor(
    private users: UserService,
    private firebase: FirebaseService,
    private sessions: SessionService,
    private account: AccountService,
  ) {}

  public async sendPhone(phoneNumber: string): Promise<SendPhoneResponse> {
    const user = await this.users.getByPhone(phoneNumber)

    const hasActiveSession = user ? !!(await this.sessions.findByUser(user.id)).length : false

    return {
      userId: user?.id,
      hasActiveSession,
    }
  }

  public async signUp(input: SignUpInput) {
    const { connection, firstName, lastName, /* silent, firebase_token, */ phoneNumber } = input

    const verified = await this.validateToken(input.firebase_token)
    const unformatted = unformatString(phoneNumber)
    if (verified.phone_number !== unformatted) {
      throw new Error('Token invalid')
    }

    const sessionData: SessionData = {
      ip: connection.ipAddress,
      country: connection.countryName,
      region: connection.cityName + ' ' + connection.regionName,
      platform: connection.platform || 'unknown',
      browser: connection.browser || 'unknown',
    }

    const { userId } = await this.users.create({
      firstName,
      lastName,
      phoneNumber,
    })

    return this.account.createAuthorization(sessionData, userId)
  }

  public async signIn(input: SignInInput) {
    const user = await this.users.getByPhone(input.phoneNumber)

    if (!user) {
      throw new PhoneNumberNotFoundError('auth.signIn')
    }
    const verified = await this.validateToken(input.firebase_token)
    const unformatted = unformatString(user.phoneNumber)
    if (verified.phone_number !== unformatted) {
      throw new Error('Token invalid')
    }

    return this.account.createAuthorization(this.getSessionData(input.connection), user.id)
  }

  public async getSession(id: string) {
    return this.sessions.getById(id)
  }

  private getSessionData(connection: Connection) {
    return {
      ip: connection.ipAddress,
      country: connection.countryName,
      region: connection.cityName + ' ' + connection.regionName,
      platform: connection.platform || 'unknown',
      browser: connection.browser || 'unknown',
    }
  }

  private async validateToken(token: string) {
    try {
      return await this.firebase.auth.verifyIdToken(token)
    } catch (e) {
      throw new AuthVerifyCodeError('auth.validateToken')
    }
  }
}
