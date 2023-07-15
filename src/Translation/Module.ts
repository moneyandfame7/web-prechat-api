import { Module } from '@nestjs/common'
import { TranslationService } from './Service'
import { TranslationResolver } from './Resolver'

@Module({
  providers: [TranslationResolver, TranslationService],
})
export class TranslationModule {}
