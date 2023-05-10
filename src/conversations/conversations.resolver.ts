import { Resolver, Mutation, Args, Query, Subscription } from '@nestjs/graphql'
import { ConversationsService } from './conversations.service'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'
import { JwtPayload } from 'src/authorization/auth.type'
import { JwtAuthGuard } from 'src/common/guards/jwt.guard'
import { Inject, UseGuards } from '@nestjs/common'
import { CreateConversationResponse } from 'src/types/graphql'
import { PubSub } from 'graphql-subscriptions'

@Resolver('Conversation')
export class ConversationsResolver {
  constructor(@Inject('PUB_SUB') private pubSub: PubSub, private readonly conversationsService: ConversationsService) {}

  @Mutation('createConversation')
  @UseGuards(JwtAuthGuard)
  async create(@Args('participantsIds') participantsIds: string[]): Promise<CreateConversationResponse> {
    const conversation = await this.conversationsService.create(participantsIds)

    this.pubSub.publish('CONVERSATION_CREATED', { conversationCreated: conversation })

    return {
      conversationId: conversation.id,
    }
  }

  @Subscription()
  /* @TODO: зробити валідацію просто в файлі на onConnect? */
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
