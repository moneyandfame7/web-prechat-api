import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { MessagesService } from './messages.service'
import { Prisma } from '@prisma/client'

@Resolver('Message')
export class MessagesResolver {
  constructor(private readonly messagesService: MessagesService) {}

  @Mutation('createMessage')
  create(@Args('createMessageInput') createMessageInput: Prisma.MessageCreateInput) {
    return this.messagesService.create(createMessageInput)
  }

  @Query('messages')
  findAll() {
    return this.messagesService.findAll()
  }

  @Query('message')
  findOne(@Args('id') id: number) {
    return this.messagesService.findOne(id)
  }

  @Mutation('updateMessage')
  update(@Args('id') id: string, @Args('updateMessageInput') updateMessageInput: Prisma.MessageUpdateInput) {
    return this.messagesService.update(id, updateMessageInput)
  }

  @Mutation('removeMessage')
  remove(@Args('id') id: number) {
    return this.messagesService.remove(id)
  }
}
