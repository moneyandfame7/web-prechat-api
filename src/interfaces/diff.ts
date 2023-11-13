import type en from 'common/i18n/en'
import type { Nullable } from './helpers'

export type PhotoFields = {
  id?: string | undefined
  date?: Date | undefined
  blurHash?: string | undefined
  url?: string | undefined
} | null

export type PrismaPhoto = {
  id: string
  date: Date
  blurHash: string
  url: string
  width: Nullable<number>
  height: Nullable<number>
  withSpoiler: Nullable<boolean>
}
export type PrismaDocument = {
  id: string
  date: Date
  fileName: string
  blurHash: Nullable<string>
  url: string
  size: Nullable<number>
  mimeType: Nullable<string>
  isMedia: Nullable<boolean>
}

export type SupportedLanguage = 'en' | 'uk' | 'pl' | 'de'
export type LanguageStringKeys = keyof typeof en.pack

export interface LanguageStringInput {
  language: SupportedLanguage
  string: LanguageStringKeys
}
