import { Global, Module } from '@nestjs/common'
import { PubSub } from 'graphql-subscriptions'

import { PubSub2Service } from './Service'

// we just need to past it to AppModule and it work
@Global()
@Module({
  providers: [
    {
      provide: 'PUB_SUB',
      useClass: PubSub,
    },
    PubSub2Service,
  ],
  exports: [PubSub2Service],
})
export class PubSub2Module {}
