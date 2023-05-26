import { Resolver, Mutation, Args, Query, Subscription } from '@nestjs/graphql'
import { ConversationsService } from './conversations.service'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'
import { JwtPayload } from 'src/authorization/auth.type'
import { JwtAuthGuard } from 'src/common/guards/jwt.guard'
import { Inject, UseGuards } from '@nestjs/common'
import { Conversation, CreateConversationInput, CreateConversationResponse } from 'src/types/graphql'
import { PubSub } from 'graphql-subscriptions'

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

  @UseGuards(JwtAuthGuard)
  @Subscription(() => Conversation, {
    filter: (payload, variables, context) => {
      console.log({ payload, variables, context }, ' ALSDLALSDLASLDLASLD LASLDLASLD')
      console.log('TOKEN:', context.req.headers)
      return true
    },
  })
  /* @TODO: зробити валідацію просто в файлі на onConnect? */
  conversationCreated() {
    console.log('AY SUKA')
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
