import type en from 'common/i18n/en'

export type SupportedLanguage = 'en' | 'uk' | 'pl' | 'de'
export type LanguageStringKeys = keyof typeof en.pack

export interface LanguageStringInput {
  language: SupportedLanguage
  string: LanguageStringKeys
}
