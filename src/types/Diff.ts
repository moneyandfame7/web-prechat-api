import type { Prisma } from '@prisma/client'
import type en from 'common/i18n/en'

export type SelectPhotoFields = Pick<Prisma.PhotoSelect, 'id' | 'date' | 'blurHash' | 'url' | 'width' | 'height'>
export type PhotoFields = {
  id?: string | undefined
  date?: Date | undefined
  blurHash?: string | undefined
  url?: string | undefined
} | null

export type PrismaPhoto = {
  id?: string | undefined
  date?: Date | undefined
  blurHash?: string | undefined
  url?: string | undefined
}

export type SupportedLanguage = 'en' | 'uk' | 'pl' | 'de'
export type LanguageStringKeys = keyof typeof en.pack

export interface LanguageStringInput {
  language: SupportedLanguage
  string: LanguageStringKeys
}
