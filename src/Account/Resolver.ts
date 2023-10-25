import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'

import * as Api from '@generated/graphql'

import { AuthGuard } from 'Auth/Guard'

import { CurrentSession } from 'common/decorators/Session'
import { buildAuthorization } from 'common/builder/account'
import { PubSub2Service } from 'common/pubsub2/Service'
import { getSession } from 'common/helpers/getSession'

import { MutationTyped, QueryTyped, SubscriptionTyped } from 'types/nestjs'
import type { UserStatus } from 'types/users'

import { AccountService } from './Service'

@Resolver('Account')
export class AccountResolver {
  public constructor(private pubSub: PubSub2Service, private account: AccountService) {}

  @UseGuards(AuthGuard)
  @QueryTyped('getAuthorizations')
  public async getAuthorizations(@CurrentSession() session: Api.Session): Promise<Api.Session[]> {
    return this.account.getAuthorizations(session)
  }

  @UseGuards(AuthGuard)
  @MutationTyped('terminateAuthorization')
  public async terminateAuthorization(@CurrentSession() session: Api.Session, @Args('id') id: string) {
    const terminated = await this.account.terminateAuthorization(session, id)

    this.pubSub.publish('onAuthorizationTerminated', {
      onAuthorizationTerminated: [terminated],
    })

    return Boolean(terminated)
  }

  @UseGuards(AuthGuard)
  @Mutation('terminateAllAuthorizations')
  public async terminateAllAuthorizations(@CurrentSession() session: Api.Session) {
    const terminated = await this.account.terminateAllAuthorizations(session)

    this.pubSub.publish('onAuthorizationTerminated', {
      onAuthorizationTerminated: terminated,
    })

    return Boolean(terminated)
  }

  @UseGuards(AuthGuard)
  @Mutation('updateAuthorizationActivity')
  public async updateAuthorizationActivity(@CurrentSession() session: Api.Session): Promise<Api.Session> {
    const updated = await this.account.updateAuthorizationActivity(session)

    this.pubSub.publish('onAuthorizationUpdated', {
      onAuthorizationUpdated: updated,
    })

    return updated
  }

  // переробити щоб онлайн статус був доступний лише КОНТАКТАМ??? а іншим - last seen recently
  @UseGuards(AuthGuard)
  @MutationTyped('updateUserStatus')
  public async updateUserStatus(
    @Args('online') online: boolean,
    @CurrentSession() session: Api.Session,
  ): Promise<UserStatus> {
    const status = await this.account.updateUserStatus(session, online)
    this.pubSub.publish('onUserStatusUpdated', {
      /* maybe publish user here, with contacts, for check  */
      onUserStatusUpdated: { status, userId: session.userId },
    })
    this.updateAuthorizationActivity(session)
    return status
  }

  /**
   * Filter subscribe only for users, which has active session with same id.
   * maybe filter for session, but not CURRENT.
   */
  @UseGuards(AuthGuard)
  @SubscriptionTyped('onAuthorizationTerminated', {
    filter: (payload, _var, context) => {
      const session = getSession(context.req)

      const terminatedIds = payload.onAuthorizationTerminated

      return terminatedIds.every((s) => s.userId === session.userId)
    },
    resolve: (payload, _args, context) => {
      const session = getSession(context.req)

      return payload.onAuthorizationTerminated.map((s) => buildAuthorization(s, session))
    },
  })
  public async onAuthorizationTerminated() {
    return this.pubSub.subscribe('onAuthorizationTerminated')
  }

  @UseGuards(AuthGuard)
  @SubscriptionTyped('onAuthorizationCreated', {
    filter: (payload, _var, context) => {
      const session = getSession(context.req)

      const addedSession = payload.onAuthorizationCreated

      return session.userId === addedSession.userId
    },
  })
  public async onAuthorizationCreated() {
    return this.pubSub.subscribe('onAuthorizationCreated')
  }

  @UseGuards(AuthGuard)
  @SubscriptionTyped('onAuthorizationUpdated', {
    filter: (payload, _var, context) => {
      const session = getSession(context.req)

      const updatedSession = payload.onAuthorizationUpdated

      // фільтрую так, бо після оновлення ми й так повертаємо сесію, не потрібно дублювати ще й в підписці
      return session.userId === updatedSession.userId && session.id !== updatedSession.id
    },
  })
  public async onAuthorizationUpdated() {
    return this.pubSub.subscribe('onAuthorizationUpdated')
  }

  // Filter for ayll except of requester update.
  @UseGuards(AuthGuard)
  @SubscriptionTyped('onUserStatusUpdated', {
    filter: (payload, _var, context) => {
      const session = getSession(context.req)

      const updatedStatus = payload.onUserStatusUpdated

      return updatedStatus.userId !== session.userId
    },
  })
  public async onUserStatusUpdated() {
    return this.pubSub.subscribe('onUserStatusUpdated')
  }
}
