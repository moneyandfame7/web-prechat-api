import { Module } from '@nestjs/common'
import { BuilderService } from './Service'

@Module({
  providers: [BuilderService],
  exports: [BuilderService],
})
export class BuilderModule {}
