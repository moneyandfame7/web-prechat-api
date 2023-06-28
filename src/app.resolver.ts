import { Args, Context, GqlExecutionContext, GraphQLExecutionContext, Query, Resolver } from '@nestjs/graphql'

import type { LanguageStringInput, SupportedLanguage } from 'types/other'
import { i18n } from 'common/i18n'
import { GqlContext } from 'common/decorators/current-user.decorator'
import { ExecutionContext } from '@nestjs/common'
import { Request } from 'express'
/**
 * @todo винести i18n в translation service
 */
@Resolver()
export class AppResolver {
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
}
