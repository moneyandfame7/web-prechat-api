import { Module } from '@nestjs/common'

import { SessionService } from './Service'
import { SessionsResolver } from './Resolver'
import { PrismaService } from '../prisma.service'

@Module({
  providers: [SessionsResolver, SessionService, PrismaService],
  exports: [SessionService],
})
export class SessionsModule {}
