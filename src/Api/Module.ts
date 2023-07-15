import { Module } from '@nestjs/common'
import { UserModule } from 'Users/Module'

import { ApiService } from './Service'
import { ApiResolver } from './Resolver'
import { PrismaService } from '../prisma.service'

@Module({
  imports: [UserModule],
  providers: [ApiResolver, ApiService, PrismaService],
  exports: [ApiService],
})
export class ApiModule {}
