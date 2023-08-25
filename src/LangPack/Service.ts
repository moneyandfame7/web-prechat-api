import { Injectable } from '@nestjs/common'

import type { Country, GetLangStringInput, Language } from '@generated/graphql'

import type { LanguageStringKeys, SupportedLanguage } from 'types/other'
import { i18n, languagesNames } from 'common/i18n'

@Injectable()
export class LangPackService {
  public getLangPack(code: SupportedLanguage): {
    strings: Record<LanguageStringKeys, string>
    langCode: SupportedLanguage
  } {
    return {
      strings: i18n[code].pack,
      langCode: code,
    }
  }

  public getLangString(input: GetLangStringInput): string {
    const { code, key } = input

    return i18n[code as SupportedLanguage].pack[key as LanguageStringKeys]
  }

  public getLanguages(): Language[] {
    const array: Language[] = Object.keys(i18n).map((key: SupportedLanguage) => ({
      name: languagesNames[key],
      nativeName: i18n[key].pack.LANG_NATIVE_NAME,
      langCode: key,
      stringsCount: Object.keys(i18n[key]).length,
    }))

    return array
  }

  public getLanguage(code: SupportedLanguage): Language {
    return {
      name: languagesNames[code],
      nativeName: i18n[code].pack.LANG_NATIVE_NAME,
      langCode: code,
      stringsCount: Object.keys(i18n[code]).length,
    }
  }

  public getCountriesList(code: SupportedLanguage): Country[] {
    return i18n[code].countries
  }
}
