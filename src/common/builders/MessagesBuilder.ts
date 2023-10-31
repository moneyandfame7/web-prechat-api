import { Injectable } from '@nestjs/common'
import type * as Api from '@generated/graphql'

import type { PrismaMessage } from '../../interfaces/messages'

@Injectable()
export class MessagesBuilder {
  /**
   *
   * @param chatId - this field is BUILT by the builder service
   */
  public build(requesterId: string, chatId: string, message: PrismaMessage) {
    const { action, entities, senderId, ...primaryFields } = message

    return {
      ...primaryFields,
      _chatId: primaryFields.chatId, // this is not builded chat id field
      chatId,
      content: {
        formattedText: {
          text: primaryFields.text!,
          ...(entities && { entities: entities as any }),
        },
        action: (action as Api.MessageAction) || undefined,
      },
      senderId: senderId,
      isOutgoing: senderId === requesterId,
      action: action as Api.MessageAction,
    }
  }
  public buildMany(requesterId: string, chatId: string, messages: PrismaMessage[]) {
    return messages.map((message) => this.build(requesterId, chatId, message))
  }
}
