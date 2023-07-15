import type { Session } from '@generated/graphql'

export type SessionData = Pick<Session, 'ip' | 'country' | 'region' | 'platform' | 'browser'>
