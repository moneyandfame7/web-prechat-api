import { Global, Module } from '@nestjs/common'
import { PubSub } from 'graphql-subscriptions'

import { PubSubService } from './Service'

// we just need to past it to AppModule and it work
@Global()
@Module({
  providers: [
    {
      provide: 'PUB_SUB',
      useClass: PubSub,
    },
    PubSubService,
  ],
  exports: [PubSubService],
})
export class PubSub2Module {}
