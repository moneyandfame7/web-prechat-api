import { Args, Query, Resolver } from '@nestjs/graphql'

import { GetLangStringInput } from '@generated/graphql'

import { SupportedLanguage } from 'types/other'

import { LangPackService } from './Service'

@Resolver('LangPack')
export class LangPackResolver {
  public constructor(private langPack: LangPackService) {}

  @Query('getLangPack')
  public async getLangPack(@Args('code') code: SupportedLanguage) {
    return this.langPack.getLangPack(code)
  }

  @Query('getLangString')
  public async getLangString(@Args('input') input: GetLangStringInput) {
    return this.langPack.getLangString(input)
  }

  @Query('getLanguages')
  public async getLanguages() {
    return this.langPack.getLanguages()
  }

  @Query('getLanguage')
  public async getLanguage(@Args('code') code: SupportedLanguage) {
    return this.langPack.getLanguage(code)
  }

  @Query('getCountriesList')
  public async getCountriesList(@Args('code') code: SupportedLanguage) {
    return this.langPack.getCountriesList(code)
  }
}
