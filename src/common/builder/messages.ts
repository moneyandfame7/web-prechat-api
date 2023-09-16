import type {
  $Enums,
  Document,
  Message,
  MessageActionType,
  MessageMediaContact,
  MessageMediaDocument,
  MessageMediaPhoto,
  MessageMediaPoll,
  Photo,
  PollAnswer,
  Prisma,
} from '@prisma/client'
import type { LanguageStringKeys } from 'types/other'

export type PrismaMessage = Message & {
  media: PrismaMessageMedia | null
} & { action: PrismaMessageAction | null }

export interface PrismaMessageMedia {
  messageMediaContact: MessageMediaContact | null | undefined
  messageMediaDocument:
    | (MessageMediaDocument & {
        document: Document
      })
    | null
    | undefined
  messageMediaPhoto:
    | (MessageMediaPhoto & {
        photo: Photo
      })
    | null
    | undefined
  messageMediaPoll:
    | (MessageMediaPoll & {
        poll: {
          answers: PollAnswer[]
          closeDate: Date | null
          isAnonymous: boolean
          isClosed: boolean
          question: string
          isQuiz: boolean
          multiplieChoise: boolean
        }
      })
    | null
}

export interface PrismaMessageAction {
  text: string
  photo: {
    id: string
    date: Date
    blurHash: string
    url: string
    chatId: string
    userId: string
    chatFullId: string | null
  } | null
  type: $Enums.MessageActionType
  users: string[]
}

export function selectMessageMediaFields() {
  return {
    media: {
      select: {
        messageMediaContact: true,
        messageMediaDocument: {
          include: {
            document: true,
          },
        },
        messageMediaPhoto: {
          include: {
            photo: true,
          },
        },
        messageMediaPoll: {
          include: {
            poll: {
              select: {
                answers: true,
                closeDate: true,
                isAnonymous: true,
                isClosed: true,
                question: true,
                isQuiz: true,
                multiplieChoise: true,
              },
            },
          },
        },
      } satisfies Prisma.MessageMediaSelect,
    },
  }
}

export function selectMessageFields() {
  return {
    ...selectMessageMediaFields(),
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
// interface MessageActionPayload {
//   chatCreate: {
//     title: string
//   }
//   channelCreate: void

//   deletePhoto: void
//   editTitle: void
//   joinedByLink: void
//   messagePinned: void

//   deleteUser: void
//   addUser: void
//   other: void
// }

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

// export function buildApiMessageMedia(prismaMedia: PrismaMessageMedia): Api.MessageMedia | undefined {
//   const { messageMediaContact, messageMediaDocument, messageMediaPhoto, messageMediaPoll } = prismaMedia
//   // rewrite to content: "contact", "document", "photo", "poll"
//   if (messageMediaContact) {
//     return {
//       contact: messageMediaContact,
//     } satisfies Api.MessageMediaContact
//   }
//   if (messageMediaDocument) {
//     const { document, spoiler, ttlSeconds } = messageMediaDocument
//     return {
//       document,
//       spoiler,
//       ttlSeconds,
//     } satisfies Api.MessageMediaDocument
//   }
//   if (messageMediaPhoto) {
//     const { photo, spoiler, ttlSeconds } = messageMediaPhoto

//     return {
//       photo: {
//         date: photo.date,
//         blurHash: photo.blurHash,
//         id: photo.id,
//         url: photo.url,
//       },
//       spoiler,
//       ttlSeconds,
//     } satisfies Api.MessageMediaPhoto
//   }
//   if (messageMediaPoll) {
//     // const { id, poll } = messageMediaPoll
//     // const { results, ...pollFields } = poll
//     console.log('ITS POLL')
//     return undefined
//   }

//   return undefined
// }
