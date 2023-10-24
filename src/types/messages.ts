import type { MessageEntity } from '@generated/graphql'
import type { PrismaChat } from 'common/builder/chats'
import type { Nullable } from './other'

export interface CreateMessageInput {
  text?: Nullable<string>
  chat: PrismaChat
  entities?: Nullable<MessageEntity[]>
  id: string
  orderedId: number
}
