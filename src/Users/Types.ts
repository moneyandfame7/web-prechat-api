import type { Session, User } from '@generated/graphql'

import type { SessionData } from 'Sessions'

export interface SessionUser extends User {
  id: string
  username: string
  phoneNumber: string
  createdAt: Date
  // avatar:ChatAvatar
  // avatarId:string
  //
  sessions: Session[]
  // contacts:Contacts[]
  // messages:Message[]
  // viewedMessages: ViewedMessages[]
  // chats:          Chats[]
}

export interface CreateUserInput {
  phoneNumber: string
  username?: string
  firstName: string
  lastName?: string
  photoUrl?: string
  sessionData: SessionData
}
