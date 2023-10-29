import { Module } from '@nestjs/common'

import { BuilderService } from './Service'

import { ChatsBuilder } from './ChatsBuilder'
import { MessagesBuilder } from './MessagesBuilder'
import { UsersBuilder } from './UsersBuilder'

@Module({
  providers: [BuilderService, ChatsBuilder, MessagesBuilder, UsersBuilder],
  exports: [BuilderService],
})
export class BuilderModule {}
