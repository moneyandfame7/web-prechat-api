import type { Connection } from 'types/graphql'

export interface SignUpInput {
  silent: boolean
  connection: Connection
  token?: string
  phoneNumber: string
  firstName: string
  lastName?: string
}

export interface SessionJwtPayload {
  id: string
  userId: string
}
