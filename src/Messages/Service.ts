import type { $Enums } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import type * as Api from '@generated/graphql'

import { InvalidChatId } from 'common/errors/Chats'

import { ChatRepository } from 'Chats/Repository'
import { MessagesRepository } from './Repository'
import { isUserId } from 'common/helpers/chats'
import { BuilderService } from 'common/builder/Service'

@Injectable()
export class MessagesService {
  public constructor(
    private repo: MessagesRepository,
    private chatRepo: ChatRepository,
    private builder: BuilderService,
  ) {}
  /**
   * @example
   * - Load 20 messages, newer than message ID:
   *  ```
   * messages.getHistory(requesterId, {
   *    offsetId: MSG_ID,
   *    direction: HistoryDirection.Forwards,
   *    limit: 20
   * })
   * ```
   * - Load 20 messages, older than message ID:
   * ```
   * messages.getHistory(requesterId, {
   *    offsetId: MSG_ID,
   *    direction: HistoryDirection.Backwards,
   *    limit: 20
   * })
   * ```
   * - Load 20 messages around message ID:
   *     messages.getHistory(requesterId, {
   *    offsetId: MSG_ID,
   *    direction: HistoryDirection.Backwards,
   *    limit: 20
   * })
   */
  public async getHistory(requesterId: string, input: Api.GetHistoryInput) {
    const messages = await this.repo.getHistory(input)
    // const test messages.getHistory(requesterId, {
    //  offsetId: MSG_ID,
    //  direction: HistoryDirection.Forwards})

    return messages.map((m) => this.builder.buildApiMessage(m, requesterId, input.chatId))
  }
  /**
   *  as InputPeer - chatId, userId
   *  peer InputPeer
   */
  public async sendMessage(requesterId: string, input: Api.SendMessageInput) {
    // const message = this.repo.create()
    const { chatId, text, entities, id /*  sendAs, silent */ } = input
    // let chat: Chat | null
    const foundedChat = await this.findOrCreate(requesterId, chatId)

    if (!foundedChat) {
      throw new InvalidChatId('chats.sendMessage')
    }

    return this.repo.create(requesterId, {
      text,
      chat: foundedChat,
      entities,
      id,
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

  // винести в чат
  private async findOrCreate(requesterId: string, chatId: string) {
    if (isUserId(chatId)) {
      const privateChat = await this.chatRepo.getPrivateChat(requesterId, chatId)
      console.log({ privateChat })

      return privateChat || (await this.chatRepo.createPrivate(requesterId, chatId))
    }

    return this.chatRepo.findById(chatId)
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
