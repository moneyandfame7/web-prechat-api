import type { Prisma } from '@prisma/client'
import type { MessageActionPayload } from '../../interfaces/messages'
import type { LanguageStringKeys } from '../../interfaces/diff'

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

/**
 * @todo rewrite this huinyu
 */
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
