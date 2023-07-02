import { Module } from '@nestjs/common'
import { UserModule } from 'users/users.module'

import { ApiService } from './api.service'
import { ApiResolver } from './api.resolver'
import { PrismaService } from '../prisma.service'

@Module({
  imports: [UserModule],
  providers: [ApiResolver, ApiService, PrismaService],
  exports: [ApiService],
})
export class ApiModule {}
