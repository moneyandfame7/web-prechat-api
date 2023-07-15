import { Args, Query, Resolver } from '@nestjs/graphql'
import { TranslationService } from './Service'

@Resolver('Translation')
export class TranslationResolver {
  constructor(private readonly translationService: TranslationService) {}

  @Query('translateHello')
  public translateHello() {
    return this.translationService.translateHello()
  }

  @Query('translateCountries')
  public asd(@Args('lng') lng: string, @Args('outputFile') outputFile: string) {
    // return this.translationService.translateAndSaveCountries(lng, outputFile)
  }
}
