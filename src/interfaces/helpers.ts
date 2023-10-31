/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Request } from 'express'
import type { Session } from '@generated/graphql'

export type Nullable<T> = T | null

export type PickRequired<T, K extends keyof T> = {
  [P in K]-?: T[P]
} & Omit<T, K>

export type FunctionNames<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never
}[keyof T]
export type FunctionReturnType<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? ReturnType<T[K]> : never
}
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T

export type MapClassReturnTypes<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? { [P in K]: Awaited<ReturnType<T[K]>> } : never
}
export interface GqlContext {
  req: Request & { extra: Record<string, unknown> } & { prechatSession?: Session }
  res: Response
  payload?: any
  // required for subscription
  connection: any
}

export type WithTypename<T> = T & { __typename: string }
