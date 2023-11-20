/* eslint-disable @typescript-eslint/no-explicit-any */
import { Mutation, Query, Subscription } from '@nestjs/graphql'

import type { IMutation, IQuery, ISubscription, Session } from '@generated/graphql'

import type { PrismaMessage } from '../interfaces/messages'

import type { GqlContext, MapClassReturnTypes } from './helpers'
import type { PrismaChat } from './chats'
import type { Prisma, PrismaClient } from '@prisma/client'
import type { DefaultArgs } from '@prisma/client/runtime/library'

export type PrismaTx = Omit<
  PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>

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
  onDeleteMessages: {
    onDeleteMessages: {
      affectedChat: PrismaChat
      ids: string[]
    }
  }
  onEditMessage: {
    onEditMessage: {
      affectedChat: PrismaChat
      message: PrismaMessage
    }
  }
  onReadHistoryInbox: {
    onReadHistoryInbox: {
      affectedChat: PrismaChat
      maxId: number
      newUnreadCount: number
      readedBySession: Session
    }
  }
  onReadHistoryOutbox: {
    onReadHistoryOutbox: {
      affectedChat: PrismaChat
      maxId: number
      readedBySession: Session
    }
  }
}
export type SubscriptionBuilderName = keyof Pick<
  SubscriptionPayload,
  'onChatCreated' | 'onNewMessage' | 'onDeleteMessages' | 'onEditMessage' | 'onReadHistoryInbox' | 'onReadHistoryOutbox'
>
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
