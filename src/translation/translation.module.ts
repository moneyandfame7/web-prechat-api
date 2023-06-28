import { Module } from '@nestjs/common'
import { TranslationService } from './translation.service'
import { TranslationResolver } from './translation.resolver'

@Module({
  providers: [TranslationResolver, TranslationService],
})
export class TranslationModule {}
