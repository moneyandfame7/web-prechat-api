import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql'
import { Inject, UseGuards } from '@nestjs/common'
import { PubSub } from 'graphql-subscriptions'
import {
  AddChatMembersInput,
  ChatInput,
  type Chat,
  CreateChannelInput,
  CreateGroupInput,
  DeleteChatMemberInput,
  type ChatCreatedUpdate,
} from '@generated/graphql'

import { AuthGuard } from 'Auth'

import { CurrentSession } from 'common/decorators/Session'
import { getSession } from 'common/helpers/getSession'

import type { GqlContext } from 'types/other'

import { ChatService } from './Service'

@Resolver('Chat')
export class ChatsResolver {
  constructor(@Inject('PUB_SUB') private pubSub: PubSub, private readonly chats: ChatService) {}
  /**
   *  @throws "USER_RESTRICTED" - if user has many spam/flood reports
   *  @throws "CHAT_TITLE_INVALID" - if not provided title
   *  @throws "CHAT_ABOUT_TOO_LONG" - if limit of length channel description
   */
  @Mutation('createChannel')
  @UseGuards(AuthGuard)
  public async createChannel(
    @CurrentSession('userId') currUserId: string,
    @Args('input') input: CreateChannelInput,
  ): Promise<Chat> {
    const { chat, users } = await this.chats.createChannel(currUserId, input)
    this.pubSub.publish('onChatCreated', {
      onChatCreated: {
        chat,
        users,
      },
    })

    return chat
  }

  @UseGuards(AuthGuard)
  @Subscription('onChatCreated', {
    /**
     * Фільтрація підписки тільки для юзерів, які існують в створенному чаті.
     */
    filter(payload: { onChatCreated: ChatCreatedUpdate }, _, context: GqlContext) {
      const session = getSession(context.req)

      const mentionedUsers = payload.onChatCreated.users

      return Boolean(mentionedUsers.find((u) => u.id === session.userId))
    },
  })
  public async onChatCreated() {
    return this.pubSub.asyncIterator('onChatCreated')
  }

  @Mutation('createGroup')
  @UseGuards(AuthGuard)
  public async createGroup(@CurrentSession('userId') currUserId: string, @Args('input') input: CreateGroupInput) {
    const update = await this.chats.createGroup(currUserId, input)

    this.pubSub.publish('onChatCreated', { onChatCreated: update })
    return update
  }

  @Query('getChats')
  @UseGuards(AuthGuard)
  public async getChats(@CurrentSession('userId') currUserId: string) {
    return this.chats.getChats(currUserId)
  }

  @Mutation('addChatMembers')
  public async addChatMembers(@Args('input') input: AddChatMembersInput) {
    const update = await this.chats.addChatMembers(input)
  }

  @Mutation('deleteChatMember')
  public async deleteChatMember(@Args('input') input: DeleteChatMemberInput) {
    const update = await this.chats.deleteChatMember(input)
  }

  @Mutation('deleteChat')
  public async deleteChat(@Args('input') input: ChatInput) {
    const update = await this.chats.deleteChat(input)
  }

  @Query('getChatSettings')
  @UseGuards(AuthGuard)
  public async getChatSettings(@CurrentSession('userId') currentUserId: string, @Args('input') input: ChatInput) {
    return this.chats.getChatSettings(currentUserId, input)
  }
}
