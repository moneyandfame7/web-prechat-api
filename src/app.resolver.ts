import { Args, Context, Query, Resolver } from '@nestjs/graphql'
import { Request } from 'express'
import type { LanguageStringInput, SupportedLanguage } from 'types/other'

import { i18n } from 'common/i18n'
import { AppService } from 'app.service'
import { ConfigService } from '@nestjs/config'
/**
 * @todo винести i18n в translation service
 */
@Resolver()
export class AppResolver {
  public constructor(private readonly appService: AppService, private readonly configService: ConfigService) {}
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
