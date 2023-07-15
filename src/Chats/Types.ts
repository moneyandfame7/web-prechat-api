import { Chat, User } from '@prisma/client'

export interface ChatCreatedSubPayload {
  chatCreated: Chat & { members: User[] }
}
