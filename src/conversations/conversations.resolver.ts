import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { ConversationsService } from './conversations.service';
import { CreateConversationInput } from 'src/types/graphql';

@Resolver('Conversation')
export class ConversationsResolver {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Mutation('createConversation')
  create(@Args('createConversationInput') createConversationInput: CreateConversationInput) {
    return this.conversationsService.create(createConversationInput);
  }
}
