import { Module } from '@nestjs/common'
import { PubSub } from 'graphql-subscriptions'

/**
 * @TODO types pub sub
 */
@Module({
  providers: [
    {
      provide: 'PUB_SUB',
      useClass: PubSub,
    },
  ],
  exports: ['PUB_SUB'],
})
export class PubSubModule {}
