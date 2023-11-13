import type * as Api from '@generated/graphql'
import type { $Enums, Message, Photo } from '@prisma/client'

import type { Nullable } from './helpers'
import type { PrismaChat } from './chats'
import type { PrismaDocument, PrismaPhoto } from './diff'

export interface CreateMessageInput {
  text?: Nullable<string>
  chat: PrismaChat
  entities?: Nullable<Api.MessageEntity[]>
  photos?: Nullable<Api.Photo[]>
  documents?: Nullable<Api.Document[]>
  id: string
  orderedId: number
}

export type GetHistoryInputInternal = Api.GetHistoryInput & {
  message: Message | null
}
export type PrismaMessage = Message & {
  action: PrismaMessageAction | null
  photos: /*  PrismaPhoto[] */ PrismaPhoto[]
  documents: PrismaDocument[]
}

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

export interface SendMediaItem {
  withSpoiler: boolean
  mimeType: string
}
