import { Module } from '@nestjs/common'

import { LangPackResolver } from './Resolver'
import { LangPackService } from './Service'

@Module({
  providers: [LangPackResolver, LangPackService],
})
export class LangPackModule {}
