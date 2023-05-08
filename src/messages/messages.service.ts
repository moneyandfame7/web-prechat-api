import { Injectable } from '@nestjs/common'
import { CreateMessageInput, UpdateMessageInput } from 'src/types/graphql'

@Injectable()
export class MessagesService {
  create(createMessageInput: CreateMessageInput) {
    return 'This action adds a new message'
  }

  findAll() {
    return `This action returns all messages`
  }

  findOne(id: number) {
    return `This action returns a #${id} message`
  }

  update(id: number, updateMessageInput: UpdateMessageInput) {
    return `This action updates a #${id} message`
  }

  remove(id: number) {
    return `This action removes a #${id} message`
  }
}
