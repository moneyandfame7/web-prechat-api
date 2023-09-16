import { Args, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import * as Api from '@generated/graphql'
import { MutationTyped, SubscriptionBuilder } from 'types/nestjs'
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
    return this.builder.buildApiMessage(message, requesterId)
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

      const { chat, message } = payload.onNewMessage
      const mentionedUsers = chat.fullInfo?.members.map((m) => ({ ...m.user }))
      const senderId = message.senderId

      /* @todo як фільтрувати так, щоб якщо сесія юзера не поточна - то похуй, приймати */
      return Boolean(mentionedUsers?.find((u) => u.id === myId /* && senderId !== myId */))
    },
    resolve(this: MessagesResolver, payload, args, context) {
      const session = getSession(context.req)

      const myId = session.userId
      const { chat, message } = payload.onNewMessage

      const buildedChat = this.builder.buildApiChat(chat, myId)
      const buildedMessage = this.builder.buildApiMessage(message, myId)

      return { chat: buildedChat, message: buildedMessage }
    },
  })
  public async onNewMessage() {
    return this.pubSub.subscribe('onNewMessage')
  }
}
