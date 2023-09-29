import { Args, Resolver, Query } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import * as Api from '@generated/graphql'
import { MutationTyped, QueryTyped, SubscriptionBuilder, SubscriptionTyped } from 'types/nestjs'
import { PubSub2Service } from 'common/pubsub2/Service'
import { CurrentSession } from 'common/decorators/Session'
import { getSession } from 'common/helpers/getSession'
import { BuilderService } from 'common/builder/Service'
import { AuthGuard } from 'Auth'

import { MessagesService } from './Service'

@Resolver('Message')
export class MessagesResolver {
  constructor(private messages: MessagesService, private pubSub: PubSub2Service, private builder: BuilderService) {}

  @MutationTyped('sendMessage')
  @UseGuards(AuthGuard)
  public async sendMessage(@CurrentSession('userId') requesterId: string, @Args('input') input: Api.SendMessageInput) {
    const { chat, message } = await this.messages.sendMessage(requesterId, input)

    this.pubSub.publishNotBuilded('onNewMessage', {
      onNewMessage: {
        chat,
        message,
      },
    })

    // this.pubSub.publish('onNewMessage',{})
    return {
      message: this.builder.buildApiMessage(message, requesterId, input.chatId),
    }
  }

  @QueryTyped('getHistory')
  @UseGuards(AuthGuard)
  public async getHistory(@CurrentSession('userId') requesterId: string, @Args('input') input: Api.GetHistoryInput) {
    return this.messages.getHistory(requesterId, input)
  }

  /**
   * @todo протестити це на клієнті.
   * ВІДПОВІДНО: якщо це приватний чат - він створюється і відобразиться у юзера,
   *  якому ми надсилаємо повідомлення.
   * Якщо це група або канал - якщо такого чату не має - помилка. Інакше - надсилається
   * повідомлення.
   * Фільтруємо підписку для юзерів, які є мемберами в чаті.
   */

  @SubscriptionBuilder('onNewMessage', {
    filter(payload, _, context) {
      const session = getSession(context.req)
      const myId = session.userId

      /* а ось тут хз, а якщо учасників 1млн?))) */
      const { chat /* message */ } = payload.onNewMessage
      const mentionedUsers = chat.fullInfo?.members.map((m) => ({ ...m.user }))
      // const senderId = message.senderId

      /* @todo як фільтрувати так, щоб якщо сесія юзера не поточна - то похуй, приймати */
      return Boolean(mentionedUsers?.find((u) => u.id === myId /* && senderId !== myId */))
    },
    resolve(this: MessagesResolver, payload, args, context) {
      const session = getSession(context.req)

      const myId = session.userId
      const { chat, message } = payload.onNewMessage

      const buildedChat = this.builder.buildApiChat(chat, myId)
      const buildedMessage = this.builder.buildApiMessage(message, myId, buildedChat.id)

      return { chat: buildedChat, message: buildedMessage }
    },
  })
  public async onNewMessage() {
    return this.pubSub.subscribe('onNewMessage')
  }

  @UseGuards(AuthGuard)
  @SubscriptionTyped('onDraftUpdate', {
    filter(payload, _, context) {
      const session = getSession(context.req)

      return session.userId === payload.onDraftUpdate.ownerId
    },
  })
  public async onDraftUpdate() {
    return this.pubSub.subscribe('onDraftUpdate')
  }

  @UseGuards(AuthGuard)
  @MutationTyped('saveDraft')
  public async saveDraft(@Args('input') input: Api.SaveDraftInput, @CurrentSession('userId') requesterId: string) {
    await this.messages.saveDraft(requesterId, input)
    this.pubSub.publish('onDraftUpdate', {
      onDraftUpdate: {
        chatId: input.chatId,
        text: input.text,
        ownerId: requesterId,
        /* можу додавати тут сесію айді, робити publishNotBuilded, а потім в підписці сортувати там де не дорівнює сесії і дорівнює юзеру і прибирати цей сессіон айді з payload  */
      },
    })

    return true
  }

  @Query('getPrivateChat')
  public async g() {
    return this.messages.chatRepo.getPrivateChat(
      'u_4d434ce1-c4bb-4699-adb4-48ee3f530730',
      'u_6edb392b-758d-4382-a07f-f3b0a55e8b42',
    )
  }
}
