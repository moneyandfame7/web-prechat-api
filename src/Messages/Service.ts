import type { $Enums } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import type * as Api from '@generated/graphql'

import { InvalidChatId } from 'common/errors/Chats'

import { ChatRepository } from 'Chats/Repository'
import { MessagesRepository } from './Repository'

@Injectable()
export class MessagesService {
  public constructor(private repo: MessagesRepository, private chatRepo: ChatRepository) {}
  /**
   *  as InputPeer - chatId, userId
   *  peer InputPeer
   */
  public async sendMessage(requesterId: string, input: Api.SendMessageInput) {
    // const message = this.repo.create()
    const { peer, text } = input

    // let chat: Chat | null
    const foundedChat = await this.chatRepo.findByPeerOrCreate(requesterId, peer)

    if (!foundedChat) {
      throw new InvalidChatId('chats.sendMessage')
    }

    return this.repo.create(requesterId, {
      text,
      chat: foundedChat,
    })

    // return { chat: foundedChat, message }
    /**
     * Якщо це приватний чат - то ми створюємо його, якщо раніше не існувало.
     *
     */

    /* check if user is blocked? */
    // const chat=
    /* check if chat exist, if not - create and then send message ? */
  }

  /* Requester, (instead of requesterID) */
  public async sendMessageAction(requesterId: string, type: $Enums.MessageActionType) {
    switch (
      type
      //  case ''
    ) {
    }
  }
}
