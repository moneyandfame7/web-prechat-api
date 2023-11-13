import { Injectable } from '@nestjs/common'
import type * as Api from '@generated/graphql'

import type { PrismaMessage } from '../../interfaces/messages'

@Injectable()
export class MessagesBuilder {
  /**
   *
   * @param chatId - this field is BUILT by the builder service
   */
  public build(requesterId: string, chatId: string, message: PrismaMessage): Api.Message {
    const { action, entities, senderId, photos, documents, ...primaryFields } = message

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
        ...(photos.length ? { photos } : {}),
        ...(documents.length ? { documents } : {}),
      },
      senderId: senderId,
      isOutgoing: senderId === requesterId,
      action: action as Api.MessageAction,
    }
  }
  public buildMany(requesterId: string, chatId: string, messages: PrismaMessage[]) {
    return messages.map((message) => this.build(requesterId, chatId, message))
  }

  private buildContent(requesterId: string, message: PrismaMessage) {
    return {}
  }
}
