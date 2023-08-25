import type { Request } from 'express'
import type { Session } from '@generated/graphql'
import type en from 'common/i18n/en'

export type SupportedLanguage = 'en' | 'uk' | 'pl' | 'de'
export type LanguageStringKeys = keyof typeof en.pack

export interface LanguageStringInput {
  language: SupportedLanguage
  string: LanguageStringKeys
}

export type Nullable<T> = T | null

export type PickRequired<T, K extends keyof T> = {
  [P in K]-?: T[P]
} & Omit<T, K>

export interface GqlContext {
  req: Request & { extra: Record<string, unknown> } & { prechatSession?: Session }
  res: Response
  payload?: any
  // required for subscription
  connection: any
}
