import { Module } from '@nestjs/common'

import { SessionService } from './sessions.service'
import { SessionsResolver } from './sessions.resolver'
import { PrismaService } from '../prisma.service'

@Module({
  providers: [SessionsResolver, SessionService, PrismaService],
  exports: [SessionService],
})
export class SessionsModule {}
