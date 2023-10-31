import { Inject, Injectable } from '@nestjs/common'
import { PubSub } from 'graphql-subscriptions'

import type {
  SubscriptionName,
  SubscriptionBuilderName,
  SubscriptionPayload,
  SubscriptionBuilderPayload,
} from '../../interfaces/nestjs'

@Injectable()
export class PubSubService {
  constructor(@Inject('PUB_SUB') private _pubSub: PubSub) {}

  public subscribe<N extends SubscriptionName | SubscriptionName[]>(name: N) {
    return this._pubSub.asyncIterator(name)
  }

  public publish<N extends SubscriptionName>(name: N, payload: SubscriptionPayload[N]) {
    return this._pubSub.publish(name, payload)
  }

  public publishNotBuilded<N extends SubscriptionBuilderName>(name: N, payload: SubscriptionBuilderPayload[N]) {
    return this._pubSub.publish(name, payload)
  }
}
