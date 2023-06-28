import { Translate } from '@google-cloud/translate/build/src/v2'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
// import countries from '../common/constants/en-countries.json'
// import * as fs from 'fs'

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
    const credentials = {
      type: 'service_account',
      project_id: 'translator-api-389518',
      private_key_id: '018cefbe606e9f2a70cd522ee50b2a83a4c4506c',
      private_key:
        '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC6BZZ45MMhrUQ7\nu2E3zSbl2XVmAmtKkE8f2G0dbUKIvTAKQxN6fX4GmU2pkbGrQNtAKT7n8aRlt2cD\nfNfVOgp+AM8hG6uXPoxhYYhuckL7OGp2CEIKJ9SD4nb1nOncS99Ni0K13U4Q+p9s\nW8Jo9pr1qiCm1XlSfJMXYhVYOhAnhUnI7T3t4TuetG6HnfwypjZzIFTi/z+CNyws\nHFO+Dt/By0KYJUJz0iJ4iioLPLvAsqtZ9s78EnP9SjvQ4ViKiTdpGCIVY/T7EVtJ\nUYYEvyuUpUORfXSA57IWmB2r+XTCpcQFhSou1Wf1itv9R4S+C/1FgOoFmacj7Bv7\n4HBSDhLtAgMBAAECggEAFBOATuHZkWvivlOVxXD1rr7OZckDDVQPxg8Uj6V4Fcvd\nQG5GzuR2Un3/HLrlouboAr+w01WH+ZZWntC9dnzCHyE1OYyD81nDysq877aTNgu7\nqatwfSoZTHaHgjCCKM1jdzn9ZCVTRI/X3tj0XWGoDbVjur21T0q0kUR7qz7w+WLA\n8QhoiIFyufpzkTtOHZnyRsT0BglKVvAd1jDlpLiiPoLlZoFMNflCNfbRs1YOOfLl\n3tTQWVdLJKVe5MyRCVFZ0LDBsmyMy2zxVaj+bY3fiI9PLG6M3kpxnsP4CF2a+TOP\nk8WvLcNQ96Dc6eADfsU1MPOrZvKMjM4c7Ki/bLLafQKBgQDt9sj/eCWC6pfF3+1E\nPwtuukHLis185a0l04JQPrIuQMrEG4STdbK/GrK8OrYkMNO9ANH6038UxDD4jX6L\n+aLH8LWlJ8PE3SQkPiNcZasKPAuGPWyxs77BzfBn2P7vaOeSOM5WYaFDnMKWnU86\nmabLOrL/2Q341qXHKQ8px/P6iwKBgQDIHvf+lKTEIBu79Tjwq8Hfw+ZvLTiDzoGs\nETNWW/2TrMFf/zn5r+03dIi4HXukHwN1Em6objnPf7sRBRRWJL0Pl0YPy/4aeUor\nedmAblB/puTQxh9onJzMevrIYSlhPGgPlZTOiYoKQMFyaOBQ2Isgzt9GaP3IUABg\nz9yHYgZvZwKBgQCVrESOUv6dEnr17bup0lGZirN5l8tZxIicoyVy3YxrBTvED17a\n9QvBocRMGk2YA9IaLhrkvgRPhnsayryOxCx7v84wnAtJlqJ13VOWeSgUnuHMxHPK\nbbkM40BTwSvQX9ZPpUU7Fds90Kqf20ALJru/ViNiQx7DphbNZujvqaGuswKBgDW3\n2moEDJZ45/j0QmyYLlqag2ikgt8et8Awfc9YsiDJ5r6WDEHx74NLTMffYikUCiGK\n6RldPTdt2hEfg+37vqRIvw3OfE8u77Hr626GLiWV7yX7iMLUB2L8QAU5z5nCVUyZ\nonAui1dlOogzjsMk3XPZFCYaWMVEdFWIdnIA5ilRAoGAIl4LLIns3Bf4RrRoBkH6\n+fmagEZIfpmKtamVSK8t/ZHLgSx5paWzangE++7iCHgYWLnGdaVpybQCQDY0ASHi\nuuwrGDZLplaBm9wgFfdZu8nkzBAEQXrPmOE8rzCX1jitmzakAk7P2an/tfSplZI4\nkx6vgm3pfpUo4J5Sb10mhk0=\n-----END PRIVATE KEY-----\n',
      client_email: 'translate@translator-api-389518.iam.gserviceaccount.com',
      client_id: '102415933559108309300',
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url:
        'https://www.googleapis.com/robot/v1/metadata/x509/translate%40translator-api-389518.iam.gserviceaccount.com',
      universe_domain: 'googleapis.com',
    }
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
