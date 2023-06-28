import { Translate } from '@google-cloud/translate/build/src/v2'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

export interface Country {
  name: string
  emoji: string
  code: string
  dial_code: string
}
@Injectable()
export class TranslationService {
  private readonly googleTranslate: Translate

  constructor(private configService: ConfigService) {
    const credentials = JSON.parse(this.configService.get('GOOGLE_CREDENTIALS')!)
    this.googleTranslate = new Translate({
      credentials,
      projectId: credentials.project_id,
    })
  }

  // public async translateCountries(lng: string) {
  //   console.log({ countries })
  //   const translatedCountries = [] as Country[]
  //   for (const country of countries) {
  //     const [translation] = await this.googleTranslate.translate(country.name, lng)
  //     country.name = translation
  //     translatedCountries.push(country)
  //   }

  //   return translatedCountries
  // }

  public async translateHello() {
    const [response] = await this.googleTranslate.translate('Hello', 'uk')
    return response
  }

  // async translateAndSaveCountries(lng: string, outputFileName: string) {
  //   const translatedCountries = await this.translateCountries(lng)
  //   const jsonContent = JSON.stringify(translatedCountries, null, 4)

  //   fs.writeFile(outputFileName, jsonContent, (err) => {
  //     if (err) {
  //       console.error('Error saving file:', err)
  //     } else {
  //       console.log('Translated countries file saved successfully.')
  //     }
  //   })

  //   return true
  // }
}
