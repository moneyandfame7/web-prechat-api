import type { Chat, ChatFullInfo, ChatMember } from '@prisma/client'
import type { InputChat, InputUser } from '@generated/graphql'

import type { PrismaUser } from './Users'
import type { PrismaMessage } from './Messages'
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
