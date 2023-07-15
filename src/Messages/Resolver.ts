import { Resolver } from '@nestjs/graphql'
import { MessagesService } from './Service'

@Resolver('Message')
export class MessagesResolver {
  constructor(private readonly messagesService: MessagesService) {}
}
