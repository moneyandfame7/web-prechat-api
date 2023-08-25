import { PubSub } from 'graphql-subscriptions'
import { Query, Resolver } from '@nestjs/graphql'
import { Inject } from '@nestjs/common'

@Resolver('AppResolver')
export class AppResolver {
  public constructor(@Inject('PUB_SUB') private pubSub: PubSub) {}
  @Query('ping')
  public pingPong() {
    return 'pong'
  }
}
