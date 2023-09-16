/* eslint-disable @typescript-eslint/no-explicit-any */
import { Mutation, Query, Subscription } from '@nestjs/graphql'

import type { IMutation, IQuery, ISubscription } from '@generated/graphql'

import type { PrismaChat } from 'common/builder/chats'
import type { PrismaMessage } from 'common/builder/messages'

import type { GqlContext, MapClassReturnTypes } from './other'

/* SUBSCRIPTIONS */
export type SubscriptionPayload = MapClassReturnTypes<ISubscription>
export type SubscriptionName = keyof ISubscription

export type SubscriptionBuilderPayload = {
  onChatCreated: { onChatCreated: PrismaChat }
  onNewMessage: {
    onNewMessage: {
      chat: PrismaChat
      message: PrismaMessage
    }
  }
}
export type SubscriptionBuilderName = keyof Pick<SubscriptionPayload, 'onChatCreated' | 'onNewMessage'>
// add types, if NOT BUILDED SUBSCRIPTION - need to provide RESOLVE.

export interface SubscriptionOptions<P> {
  filter?: (payload: P, variables: any, context: GqlContext) => boolean | Promise<boolean>
  resolve?: (payload: P, args: any, context: any, info: any) => any | Promise<any>
}

export interface SubscriptionBuilderOptions<N extends SubscriptionBuilderName> {
  filter?: (payload: SubscriptionBuilderPayload[N], variables: any, context: GqlContext) => boolean | Promise<boolean>
  resolve: (
    payload: SubscriptionBuilderPayload[N],
    args: any,
    context: GqlContext,
    info: any,
  ) => SubscriptionPayload[N][N] | Promise<SubscriptionPayload[N][N]>
}
export function SubscriptionTyped(name: SubscriptionName): MethodDecorator
export function SubscriptionTyped<N extends SubscriptionName>(
  name: N,
  options: SubscriptionOptions<SubscriptionPayload[N]>,
): MethodDecorator
export function SubscriptionTyped<N extends SubscriptionName>(
  name: N,
  options?: SubscriptionOptions<SubscriptionPayload[N]>,
): MethodDecorator {
  if (options) {
    return Subscription(name, options)
  }

  return Subscription(name)
}

export function SubscriptionBuilder<N extends SubscriptionBuilderName>(
  name: N,
  options: SubscriptionBuilderOptions<N>,
): MethodDecorator {
  return Subscription(name, options)
}

/* MUTATIONS */
export type MutationPayload = MapClassReturnTypes<IMutation>
// export type MutationName = keyof MutationPayload
export type MutationName = keyof IMutation
export function MutationTyped(name: MutationName) {
  return Mutation(name)
}

/* QUERIES */
export type QueryPayload = MapClassReturnTypes<IQuery>
export type QueryName = keyof IQuery
export function QueryTyped(name: QueryName) {
  return Query(name)
}
