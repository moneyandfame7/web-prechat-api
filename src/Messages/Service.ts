import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

@Injectable()
export class MessagesService {
  create(createMessageInput: Prisma.MessageCreateInput) {
    return 'This action adds a new message'
  }

  findAll() {
    return `This action returns all messages`
  }

  findOne(id: number) {
    return `This action returns a #${id} message`
  }

  update(id: string, updateMessageInput: Prisma.MessageUpdateInput) {
    return `This action updates a #${id} message`
  }

  remove(id: number) {
    return `This action removes a #${id} message`
  }
}
