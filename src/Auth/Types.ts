import type { Connection } from '@generated/graphql'

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

export interface AuthCheckTwoFa {
  email: string
  hint: string | null
}
