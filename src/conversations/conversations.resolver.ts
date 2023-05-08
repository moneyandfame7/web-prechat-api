import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'
import { ConversationsService } from './conversations.service'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'
import { JwtPayload } from 'src/authorization/auth.type'
import { JwtAuthGuard } from 'src/common/guards/jwt.guard'
import { UseGuards } from '@nestjs/common'
import { CreateConversationResponse } from 'src/types/graphql'

@Resolver('Conversation')
export class ConversationsResolver {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Mutation('createConversation')
  async create(@Args('participantsIds') participantsIds: string[]): Promise<CreateConversationResponse> {
    return this.conversationsService.create(participantsIds)
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
