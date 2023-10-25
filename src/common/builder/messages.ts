import type { $Enums, Message, Photo, Prisma } from '@prisma/client'
import type { LanguageStringKeys } from 'types/other'

export type PrismaMessage = Message & { action: PrismaMessageAction | null }

export interface PrismaMessageAction {
  text: string
  photo: Photo | null
  type: $Enums.MessageActionType
  users: string[]
}

type MessageActionPayload =
  | {
      '@type': 'chatCreate'
      payload: {
        title: string
      }
    }
  | {
      '@type': 'channelCreate'
    }

export function selectMessageFields() {
  return {
    action: {
      select: {
        type: true,
        users: true,
        photo: true,
        text: true,
        values: true,
      },
    },
  } satisfies Prisma.MessageSelect
}

export function createMessageAction(action: MessageActionPayload, requesterId: string) {
  let translateKey: LanguageStringKeys
  const values: string[] = []
  const type = action['@type']

  // type===''
  // const {}=payload
  switch (type) {
    case 'chatCreate':
      translateKey = 'Notification.CreatedChatWithTitle'
      values.push(action.payload.title)
      break
    case 'channelCreate':
      translateKey = 'Notification.CreatedChannel'
      break
    default:
      translateKey = 'Next'
  }

  return {
    text: translateKey,
    type,
    users: [requesterId],
    values,
  } satisfies Prisma.MessageActionCreateWithoutMessageInput
}
