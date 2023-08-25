import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import type { Session } from '@prisma/client'

import type { FileUpload } from 'graphql-upload'

import type { SessionData, Connection, SendPhoneResponse, SignInInput, SignUpInput } from '@generated/graphql'

import { UserService } from 'Users'
import { MediaService } from 'Media'
import { SessionService } from 'Sessions'

import { unformatString } from 'common/utils/unformatString'
import { FirebaseService } from 'common/Firebase'
import {
  AuthVerifyCodeError,
  SessionInvalidError,
  SessionPasswordNeeded,
  SessionTooFreshError,
} from 'common/errors/Authorization'
import { PhoneNumberNotFoundError } from 'common/errors/Common'

import type { AuthSessionDecoded } from './Types'
import { AccountService } from 'Account/Service'

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UserService,
    private readonly firebase: FirebaseService,
    private readonly media: MediaService,
    private readonly sessions: SessionService,
    private readonly jwt: JwtService,
    private readonly account: AccountService,
  ) {}

  public async sendPhone(phoneNumber: string): Promise<SendPhoneResponse> {
    const user = await this.users.getByPhone(phoneNumber)

    const hasActiveSession = user ? !!(await this.sessions.findByUser(user.id)).length : false

    return {
      userId: user?.id,
      hasActiveSession,
    }
  }

  public async signUp(input: SignUpInput, photo?: FileUpload) {
    const { connection, firstName, lastName, /* silent, firebase_token, */ phoneNumber } = input
    /* Validate token, if not valid - throw error */
    let photoUrl: string | undefined
    if (photo) {
      const photoName = (firstName + ' ' + lastName || '').toLowerCase().replace(/\s+/g, '-') + Date.now()
      photoUrl = await this.media.uploadPhoto(photo, `avatars/${photoName}`)
    }

    const sessionData: SessionData = {
      ip: connection.ipAddress,
      country: connection.countryName,
      region: connection.cityName + ' ' + connection.regionName,
      platform: connection.platform || 'unknown',
      browser: connection.browser || 'unknown',
    }

    const user = await this.users.create({
      firstName,
      lastName,
      phoneNumber: unformatString(phoneNumber),
      photoUrl,
      sessionData,
    })

    const session = await this.sessions.create(sessionData, user.id)
    return { sessionHash: this.encodeSession(session) }
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
    const password = await this.account.getPassword(user.id)
    if (password) {
      throw new SessionPasswordNeeded('auth.signIn')
    }

    const session = await this.sessions.create(this.getSessionData(input.connection), user.id)

    return { sessionHash: this.encodeSession(session) }
  }

  public async terminateAuthorization(currentSession: Session, id: string) {
    if (this.isFreshSession(currentSession)) {
      throw new SessionTooFreshError('auth.terminateAllAuthorizations')
    }

    const willBeTerminated = await this.sessions.getById(id)
    /* перевірка на freshSession */

    if (willBeTerminated?.userId === currentSession.userId) {
      return this.sessions.deleteById(id)
    }

    return false
  }

  public async terminateAllAuthorizations(currentSession: Session) {
    if (this.isFreshSession(currentSession)) {
      throw new SessionTooFreshError('auth.terminateAllAuthorizations')
    }
  }

  private isFreshSession(session: Session) {
    const sessionCreatedAt = session.createdAt.getTime()
    const now = new Date().getTime()

    const timeDifferenceMs = now - sessionCreatedAt

    const twentyFourHoursInMs: number = 24 * 60 * 60 * 1000

    return timeDifferenceMs <= twentyFourHoursInMs
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

  private encodeSession(session: Session) {
    return this.jwt.sign({
      id: session.id,
      userId: session.userId,
    })
  }

  private async validateToken(token: string) {
    try {
      return await this.firebase.auth.verifyIdToken(token)
    } catch (e) {
      throw new AuthVerifyCodeError('auth.validateToken')
    }
  }

  public async decodeSession(token: string) {
    try {
      const decoded = this.jwt.verify(token) as AuthSessionDecoded
      return this.sessions.getById(decoded.id)
    } catch (e) {
      throw new SessionInvalidError('auth.decodeSession')
    }
  }
}
