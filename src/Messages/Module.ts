import { Module } from '@nestjs/common'
import { MessagesService } from './Service'
import { MessagesResolver } from './Resolver'

@Module({
  providers: [MessagesResolver, MessagesService],
})
export class MessagesModule {}
