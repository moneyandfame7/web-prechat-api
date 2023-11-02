import type * as Api from '@generated/graphql'
import type { $Enums, Message, Photo } from '@prisma/client'

import type { Nullable } from './helpers'
import type { PrismaChat } from './chats'

export interface CreateMessageInput {
  text?: Nullable<string>
  chat: PrismaChat
  entities?: Nullable<Api.MessageEntity[]>
  id: string
  orderedId: number
}

export type GetHistoryInputInternal = Api.GetHistoryInput & {
  message: Message | null
}
export type PrismaMessage = Message & { action: PrismaMessageAction | null }

export interface PrismaMessageAction {
  text: string
  photo: Photo | null
  type: $Enums.MessageActionType
  users: string[]
}

export type MessageActionPayload =
  | {
      '@type': 'chatCreate'
      payload: {
        title: string
      }
    }
  | {
      '@type': 'channelCreate'
    }
