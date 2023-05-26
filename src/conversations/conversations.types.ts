import { Conversation } from 'src/types/graphql'

export interface ConversationCreatedSubscriptionPayload {
  conversationCreated: Conversation
}
