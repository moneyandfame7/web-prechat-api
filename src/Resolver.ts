import { Args, Context, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql'
import { Request } from 'express'
import { LanguageStringInput, SupportedLanguage } from 'types/other'

import { i18n } from 'common/i18n'
import { AppService } from 'Service'
import { ConfigService } from '@nestjs/config'
import { Inject } from '@nestjs/common'
import { PubSub } from 'graphql-subscriptions'
/**
 * @todo винести i18n в translation service
 */
@Resolver()
export class AppResolver {
  public constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
  ) {}
  @Query('ping')
  public pingPong() {
    return 'pong'
  }
  @Query('test')
  public test(@Context('req') req: Request) {
    return req.headers
  }

  @Query('language')
  public async language(@Args('language') language: SupportedLanguage) {
    return i18n[language]
  }

  @Query('languageString')
  public async languageString(@Args() { language, string }: LanguageStringInput) {
    return i18n[language].pack[string]
  }

  @Mutation('testSubscription')
  public async testSubscription(@Args('name') name: string) {
    const testSubscribed = name + Date.now() + crypto.randomUUID()
    this.pubSub.publish('TEST_SUBSCRIBED', { testSubscribed })
    return testSubscribed
  }

  @Subscription('testSubscribed')
  public async testSubscribed() {
    return this.pubSub.asyncIterator('TEST_SUBSCRIBED')
  }
}
