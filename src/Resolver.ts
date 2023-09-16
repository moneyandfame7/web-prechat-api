import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { PubSub2Service } from 'common/pubsub2/Service'
import { SubscriptionTyped } from 'types/nestjs'

@Resolver('AppResolver')
export class AppResolver {
  public constructor(private pubSub: PubSub2Service) {}
  @Query('ping')
  public pingPong() {
    return 'pong'
  }

  @Mutation('testSub')
  public async testSub(@Args('number') number: number) {
    const payload = number / Date.now()

    await this.pubSub.publish('onTest', { onTest: payload })

    return payload
  }

  @SubscriptionTyped('onTest')
  public onTest() {
    return this.pubSub.subscribe('onTest')
  }
}
