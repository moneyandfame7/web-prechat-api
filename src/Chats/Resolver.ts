import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import * as Api from '@generated/graphql'

import { AuthGuard } from 'Auth/Guard'

import { CurrentSession } from 'common/decorators/Session'
import { getSession } from 'common/helpers/getSession'
import { BuilderService } from 'common/builders/Service'
import { isValidUsername } from 'common/helpers/isValidUsername'
import { UsernameInvalidError } from 'common/errors'
import { PubSubService } from 'common/pubSub/Service'

import { QueryTyped, SubscriptionBuilder } from '../types/nestjs'

import { ChatService } from './Service'

@Resolver()
export class ChatsResolver {
  constructor(private pubSub: PubSubService, private readonly chats: ChatService, private builder: BuilderService) {}
  /**
   *  @throws "USER_RESTRICTED" - if user has many spam/flood reports
   *  @throws "CHAT_TITLE_INVALID" - if not provided title
   *  @throws "CHAT_ABOUT_TOO_LONG" - if limit of length channel description
   */
  @Mutation('createChannel')
  @UseGuards(AuthGuard)
  public async createChannel(
    @CurrentSession('userId') requesterId: string,
    @Args('input') input: Api.CreateChannelInput,
  ): Promise<Api.Chat> {
    const chatNotBuilded = await this.chats.createChannel(requesterId, input)
    // chatNotBuilded.fullInfo?.members[0].lastMessage.
    this.pubSub.publishNotBuilded('onChatCreated', {
      onChatCreated: chatNotBuilded,
    })

    return this.builder.chats.build(requesterId, chatNotBuilded)
  }

  @Mutation('createGroup')
  @UseGuards(AuthGuard)
  public async createGroup(
    @CurrentSession('userId') requesterId: string,
    @Args('input') input: Api.CreateGroupInput,
  ): Promise<Api.Chat> {
    const chatNotBuilded = await this.chats.createGroup(requesterId, input)

    this.pubSub.publishNotBuilded('onChatCreated', {
      onChatCreated: chatNotBuilded,
    })

    return this.builder.chats.build(requesterId, chatNotBuilded)
  }

  @UseGuards(AuthGuard)
  @SubscriptionBuilder('onChatCreated', {
    /**
     * Фільтрація підписки тільки для юзерів, які існують в створенному чаті. ( окрім власника, бо він отримує чат в response після мутації)
     */
    filter(payload, _, context) {
      const session = getSession(context.req)
      /**
       * @todo якщо це створюється чат і це приватний чат ( коли додається контакт, наприклад, то не треба викликати підписку???)
       */
      const mentionedUsers = payload.onChatCreated.fullInfo?.members.map((m) => ({ ...m.user, isOwner: m.isOwner }))

      return Boolean(mentionedUsers?.find((u) => u.id === session.userId && !u.isOwner))
    },
    /**
     * Потрібно змінювати обʼєкт тут, бо змінювати в мутації не можливо
     * ( адже там в нас айдішнік тільки того, хто створив чат, і тоді цей чат не можна
     *  віддавати всім юзерам, бо він тільки під requester`a зроблений)
     */
    async resolve(this: ChatsResolver, payload, args, context) {
      const session = getSession(context.req)

      const requesterId = session.userId
      const createdChat = payload.onChatCreated

      const members = createdChat.fullInfo?.members.map((m) => m.user)
      const users = members ? this.builder.users.buildManyWithStatus(requesterId, members) : []
      const chat = this.builder.chats.build(requesterId, createdChat)

      return { users, chat }
    },
  })
  public async onChatCreated() {
    return this.pubSub.subscribe('onChatCreated')
  }

  @Query('getChats')
  @UseGuards(AuthGuard)
  public async getChats(@CurrentSession('userId') requesterId: string) {
    const chats = await this.chats.getChats(requesterId)

    return this.builder.chats.buildMany(requesterId, chats)
  }

  @QueryTyped('getCommonGroups')
  @UseGuards(AuthGuard)
  public async getCommonChats(
    @CurrentSession('userId') requesterId: string,
    @Args('input') input: Api.GetCommonGroupsInput,
  ): Promise<Api.Chat[]> {
    return this.chats.getCommonGroups(requesterId, input)
  }

  @QueryTyped('getChat')
  @UseGuards(AuthGuard)
  public async getChat(
    @CurrentSession('userId') requesterId: string,
    @Args('chatId') chatId: string,
  ): Promise<Api.Chat> {
    return this.chats.getChat(chatId, requesterId)
  }

  @QueryTyped('getChatFull')
  @UseGuards(AuthGuard)
  public async getChatFull(
    @CurrentSession('userId') requesterId: string,
    @Args('chatId') chatId: string,
  ): Promise<Api.ChatFull> {
    return this.chats.getChatFull(chatId, requesterId)
  }

  @QueryTyped('resolveUsername')
  @UseGuards(AuthGuard)
  public async resolveUsername(
    @CurrentSession('userId') requesterId: string,
    @Args('username') username: string,
  ): Promise<Api.Peer | undefined> {
    if (!isValidUsername(username)) {
      throw new UsernameInvalidError('chats.resolveUsername')
    }
    return this.chats.resolveUsername(username, requesterId)
  }
}
