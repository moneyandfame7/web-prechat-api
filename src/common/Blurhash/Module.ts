import { Module } from '@nestjs/common'
import { BlurhashService } from './Service'

@Module({
  providers: [BlurhashService],
  exports: [BlurhashService],
})
export class BlurhashModule {}
