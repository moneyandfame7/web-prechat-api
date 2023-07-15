import { Resolver } from '@nestjs/graphql'
import { Inject } from '@nestjs/common'
import { PubSub } from 'graphql-subscriptions'

import { ChatService } from './Service'
@Resolver('Chat')
export class ChatsResolver {
  constructor(@Inject('PUB_SUB') private pubSub: PubSub, private readonly chatService: ChatService) {}
}
