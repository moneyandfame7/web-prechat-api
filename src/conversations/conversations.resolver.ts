import { Resolver, Mutation, Args, Query, Subscription } from '@nestjs/graphql'
import { ConversationsService } from './conversations.service'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'
import { JwtPayload } from 'src/authorization/auth.type'
import { JwtAuthGuard } from 'src/common/guards/jwt.guard'
import { Inject, UseGuards } from '@nestjs/common'
import { CreateConversationInput, CreateConversationResponse } from 'src/types/graphql'
import { PubSub } from 'graphql-subscriptions'
import { ConversationCreatedSubscriptionPayload } from './conversations.types'

@Resolver('Conversation')
export class ConversationsResolver {
  constructor(@Inject('PUB_SUB') private pubSub: PubSub, private readonly conversationsService: ConversationsService) {}

  @Mutation('createConversation')
  @UseGuards(JwtAuthGuard)
  async create(
    @Args('createConversationInput') createConversationInput: CreateConversationInput,
  ): Promise<CreateConversationResponse> {
    const conversation = await this.conversationsService.create(createConversationInput)

    this.pubSub.publish('CONVERSATION_CREATED', { conversationCreated: conversation })

    return {
      conversationId: conversation.id,
    }
  }

  @Subscription('conversationCreated', {
    filter(payload: ConversationCreatedSubscriptionPayload, variables, context) {
      const currentUser = context.req.extra.user
      const {
        conversationCreated: { participants },
      } = payload

      return Boolean(participants.find((u) => u.id === currentUser.id))
    },
  })
  conversationCreated() {
    return this.pubSub.asyncIterator('CONVERSATION_CREATED')
  }

  @Query('conversations')
  @UseGuards(JwtAuthGuard)
  get(@CurrentUser() currentUser: JwtPayload) {
    return this.conversationsService.getAll(currentUser)
  }

  /* add sort by last message created/updated at */
  @Query('conversation')
  @UseGuards(JwtAuthGuard)
  getOne(@CurrentUser() currentUser: JwtPayload, @Args('id') id: string) {
    return this.conversationsService.getOne(currentUser, id)
  }
}
