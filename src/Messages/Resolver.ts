import { Args, Resolver, Query } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import * as Api from '@generated/graphql'
import { AuthGuard } from 'Auth'

import { PubSubService } from 'common/pubSub/Service'
import { CurrentSession } from 'common/decorators/Session'
import { getSession } from 'common/helpers/getSession'
import { BuilderService } from 'common/builders/Service'

import { MutationTyped, QueryTyped, SubscriptionBuilder, SubscriptionTyped } from '../interfaces/nestjs'

import { MessagesService } from './Service'
import { filterChatSubscription } from 'common/helpers/filterChatSubscribtion'

/**
 * @todo можливо, треба передавати в самій підписці змінну/массив і від них
 * вже сортувати ( передавати масив айдішніків-чатів ???)
 */
@Resolver('Message')
export class MessagesResolver {
  constructor(private messages: MessagesService, private pubSub: PubSubService, private builder: BuilderService) {}

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
      message: this.builder.messages.build(requesterId, input.chatId, message),
    }
  }

  @MutationTyped('deleteMessages')
  @UseGuards(AuthGuard)
  public async deleteMessages(
    @CurrentSession('userId') requesterId: string,
    @Args('input') input: Api.DeleteMessagesInput,
  ) {
    const affectedChat = await this.messages.deleteMessages(requesterId, input)

    this.pubSub.publishNotBuilded('onDeleteMessages', {
      onDeleteMessages: {
        ...input,
        affectedChat,
      },
    })

    return true
  }

  @UseGuards(AuthGuard)
  @SubscriptionBuilder('onDeleteMessages', {
    filter(payload, _, context) {
      const session = getSession(context.req)
      const myId = session.userId

      const { affectedChat } = payload.onDeleteMessages

      return Boolean(affectedChat.fullInfo?.members.find((m) => m.userId === myId))
    },
    resolve(this: MessagesResolver, payload, args, context) {
      const session = getSession(context.req)

      const myId = session.userId
      const chat = this.builder.chats.build(myId, payload.onDeleteMessages.affectedChat)
      return { ids: payload.onDeleteMessages.ids, chat }
    },
  })
  public async onDeleteMessages() {
    return this.pubSub.subscribe('onDeleteMessages')
  }

  @UseGuards(AuthGuard)
  @MutationTyped('editMessage')
  public async editMessage(@Args('input') input: Api.EditMessageInput, @CurrentSession('userId') requesterId: string) {
    const { chat, message } = await this.messages.editMessage(requesterId, input)

    this.pubSub.publishNotBuilded('onEditMessage', {
      onEditMessage: {
        message,
        affectedChat: chat,
      },
    })
    return this.builder.messages.build(requesterId, input.chatId, message)
    // return this.builder.buildApiMessage()
  }

  @UseGuards(AuthGuard)
  @SubscriptionBuilder('onEditMessage', {
    filter(payload, _, context) {
      const session = getSession(context.req)
      const myId = session.userId

      const { affectedChat } = payload.onEditMessage
      return Boolean(affectedChat.fullInfo?.members.find((m) => m.userId === myId)) /*  && message.senderId !== myId */
    },
    resolve(this: MessagesResolver, payload, args, ctx) {
      const session = getSession(ctx.req)
      const myId = session.userId

      const message = payload.onEditMessage.message
      const chat = this.builder.chats.build(myId, payload.onEditMessage.affectedChat)

      return { message: this.builder.messages.build(myId, chat.id, message) }
    },
  })
  public async onEditMessage() {
    return this.pubSub.subscribe('onEditMessage')
  }

  @QueryTyped('getHistory')
  @UseGuards(AuthGuard)
  public async getHistory(@CurrentSession('userId') requesterId: string, @Args('input') input: Api.GetHistoryInput) {
    return this.messages.getHistory(requesterId, input)
  }

  @MutationTyped('readHistory')
  @UseGuards(AuthGuard)
  public async readHistory(
    @CurrentSession() session: Api.Session,
    @Args('input') input: Api.ReadHistoryInput,
  ): Promise<Api.ReadHistoryPayload> {
    const { newUnreadCount, affectedChat } = await this.messages.readHistory(session.userId, input)

    this.pubSub.publishNotBuilded('onReadHistoryOutbox', {
      onReadHistoryOutbox: {
        maxId: input.maxId,
        affectedChat,
        readedBySession: session,
      },
    })
    this.pubSub.publishNotBuilded('onReadHistoryInbox', {
      onReadHistoryInbox: {
        newUnreadCount,
        maxId: input.maxId,
        affectedChat,
        readedBySession: session,
      },
    })

    return { newUnreadCount }
  }

  @UseGuards(AuthGuard)
  @SubscriptionBuilder('onReadHistoryOutbox', {
    filter(payload, _, ctx) {
      const session = getSession(ctx.req)
      const myId = session.userId
      const { readedBySession, affectedChat } = payload.onReadHistoryOutbox
      console.log({ me: myId, readedBy: readedBySession.userId })
      return readedBySession.userId !== myId && filterChatSubscription(myId, affectedChat.fullInfo!)
    },
    resolve(this: MessagesResolver, payload, args, context) {
      const session = getSession(context.req)
      const myId = session.userId
      const { maxId, affectedChat } = payload.onReadHistoryOutbox

      const buildedChat = this.builder.chats.build(myId, affectedChat)
      return {
        maxId: maxId,
        chatId: buildedChat.id,
      }
    },
  })
  public async onReadHistoryOutbox() {
    return this.pubSub.subscribe('onReadHistoryOutbox')
  }

  @UseGuards(AuthGuard)
  @SubscriptionBuilder('onReadHistoryInbox', {
    filter(payload, variables, ctx) {
      const session = getSession(ctx.req)
      const myId = session.userId
      const { readedBySession, affectedChat } = payload.onReadHistoryInbox

      // sort for ME, BUT NOT CURRENT SESSION
      return (
        myId === readedBySession.userId &&
        session.id !== readedBySession.id &&
        filterChatSubscription(myId, affectedChat.fullInfo!)
      )
    },
    resolve(this: MessagesResolver, payload, args, context) {
      const session = getSession(context.req)
      const myId = session.userId
      const { maxId, affectedChat, newUnreadCount } = payload.onReadHistoryInbox

      const buildedChat = this.builder.chats.build(myId, affectedChat)
      return {
        chatId: buildedChat.id,
        maxId,
        newUnreadCount,
      }
    },
  })
  public async onReadHistoryInbox() {
    return this.pubSub.subscribe('onReadHistoryInbox')
  }
  /**
   * @todo протестити це на клієнті.
   * ВІДПОВІДНО: якщо це приватний чат - він створюється і відобразиться у юзера,
   *  якому ми надсилаємо повідомлення.
   * Якщо це група або канал - якщо такого чату не має - помилка. Інакше - надсилається
   * повідомлення.
   * Фільтруємо підписку для юзерів, які є мемберами в чаті.
   */
  @UseGuards(AuthGuard)
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

      const buildedChat = this.builder.chats.build(myId, chat)
      const buildedMessage = this.builder.messages.build(myId, buildedChat.id, message)

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
