import type { Chat, ChatFullInfo, ChatMember } from '@prisma/client'
import type { InputChat, InputUser } from '@generated/graphql'

import type { PrismaUser } from './users'
import type { PrismaMessage } from './messages'
import type { PrismaPhoto } from './diff'

export type InputPeer = InputChat | InputUser

export type PrismaChatMember = ChatMember & {
  user: PrismaUser
}
export type PrismaChatFull = ChatFullInfo & {
  members: PrismaChatMember[]
  _count: { members: number }
}
export type PrismaChat = Chat & {
  photo: PrismaPhoto | null
  fullInfo: PrismaChatFull | null
  lastMessage: PrismaMessage | null
}
