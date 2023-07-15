import en from './en'
import de from './de'
import pl from './pl'
import uk from './uk'

import { SupportedLanguage } from 'types/other'
import { Country } from '@generated/graphql'

export const i18n: Record<SupportedLanguage, { countries: Country[]; pack: typeof en.pack; errors: typeof en.errors }> =
  {
    en,
    uk,
    de,
    pl,
  }
