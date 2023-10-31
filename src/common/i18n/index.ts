import en from './en'
import de from './de'
import pl from './pl'
import uk from './uk'

import type { SupportedLanguage } from '../../types/diff'

export const i18n /* : Record<SupportedLanguage, { countries: Country[]; pack: Keyset }> */ = {
  en,
  uk,
  de,
  pl,
}
export const languagesNames: Record<SupportedLanguage, string> = {
  de: 'German',
  en: 'English',
  pl: 'Polish',
  uk: 'Ukrainian',
}
