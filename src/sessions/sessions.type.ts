import type { Session } from 'types/graphql'

export type SessionData = Pick<Session, 'ip' | 'country' | 'region' | 'platform' | 'browser'>
