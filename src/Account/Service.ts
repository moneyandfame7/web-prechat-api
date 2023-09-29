import { Inject, Injectable } from '@nestjs/common'

import type * as Api from '@generated/graphql'

import { SessionService } from 'Sessions'
import { SessionTooFreshError, ForbiddenError } from 'common/errors'

import { AccountRepository } from './Repository'
import { buildAuthorization, buildUserStatus } from 'common/builder/account'
import type { UserStatus } from 'types/users'
// import { Cache } from 'cache-manager'
// import { CACHE_MANAGER } from '@nestjs/cache-manager'
// import { TTL_USER_STATUS } from 'common/constants'

@Injectable()
export class AccountService {
  public constructor(
    private repository: AccountRepository,
    private sessions: SessionService,
  ) // @Inject(CACHE_MANAGER) private cache: Cache,
  {}

  public async getPassword(requesterId: string): Promise<Api.AuthTwoFa | undefined> {
    const twoFa = await this.repository.getPassword(requesterId)

    if (!twoFa) {
      return undefined
    }

    return {
      email: twoFa?.email,
      hint: twoFa?.hint,
    }
  }

  public async checkPassword(requesterId: string, password: string) {
    const twoFa = await this.repository.getPassword(requesterId)

    return twoFa?.password === password
  }

  public async getAuthorizations(currentSession: Api.Session): Promise<Api.Session[]> {
    const activeSessions = await this.repository.getActiveSessions(currentSession.userId)

    return activeSessions.map((s) => buildAuthorization(s, currentSession))
  }

  public async createAuthorization(input: Api.SessionData, requsterId: string): Promise<Api.Session> {
    const created = await this.repository.createAuthorization(input, requsterId)

    return buildAuthorization(created, created)
    // // or just in Auth Module???

    // this.pubSub.publish('onAuthorizationCreated', {
    //   onAuthorizationCreated: created,
    // })
    // return created
  }

  /**
   * Terminate session with provided session id.
   * If session fresh - throw error.
   */
  public async terminateAuthorization(currentSession: Api.Session, id: string): Promise<Api.Session> {
    if (this.isFreshSession(currentSession)) {
      throw new SessionTooFreshError('auth.terminateAuthorization')
    }

    const needToTerminate = await this.sessions.getById(id)

    if (needToTerminate && needToTerminate.userId === currentSession.userId) {
      const deleted = await this.sessions.deleteById(id)

      return buildAuthorization(deleted, currentSession)
    }

    throw new ForbiddenError('account.terminateAuthorization')
  }

  /**
   * Terminate all sessions except for the current one.
   * If session fresh - throw error.
   */
  public async terminateAllAuthorizations(currentSession: Api.Session): Promise<Api.Session[]> {
    if (this.isFreshSession(currentSession)) {
      throw new SessionTooFreshError('auth.terminateAllAuthorizations')
    }

    return this.sessions.deleteExceptCurrent(currentSession)
  }

  /**
   * Update current session «activeAt» field.
   */
  public async updateAuthorizationActivity(currentSession: Api.Session): Promise<Api.Session> {
    return this.sessions.updateActivity(currentSession.id)
  }

  public async updateUserStatus(currentSession: Api.Session, isOnline: boolean) {
    if (isOnline) {
      /* OR JUST CACHE ONLINE USERS IN REDIS */
      const status: UserStatus = { type: 'userStatusOnline' }
      // this.setStatusCache(currentSession.userId, status)

      return status
    }

    const user = await this.repository.updateUserLastActivity(currentSession)

    const status = buildUserStatus(user)
    // this.setStatusCache(currentSession.userId, status)

    return status
  }

  /**
   * Check if the session was created less than 24 hours ago.
   */
  private isFreshSession(session: Api.Session) {
    // return false
    const sessionCreatedAt = session.createdAt.getTime()
    const now = new Date().getTime()

    const timeDifferenceMs = now - sessionCreatedAt

    const twentyFourHoursInMs: number = 24 * 60 * 60 * 1000

    return timeDifferenceMs <= twentyFourHoursInMs
  }

  // public getStatusCached(userId: string) {
  //   return this.cache.get<UserStatus>(`${userId}_status`)
  // }

  // private setStatusCache(userId: string, status: UserStatus) {
  //   this.cache.set(`${userId}_status`, status, TTL_USER_STATUS)
  // }
}
