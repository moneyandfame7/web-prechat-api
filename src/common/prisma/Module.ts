import { Global, Module } from '@nestjs/common'
import { PrismaService } from './Service'

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
