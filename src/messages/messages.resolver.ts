import { Resolver } from '@nestjs/graphql'
import { MessagesService } from './messages.service'

@Resolver('Message')
export class MessagesResolver {
  constructor(private readonly messagesService: MessagesService) {}
}
