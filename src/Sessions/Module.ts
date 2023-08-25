import { Module } from '@nestjs/common'

import { PrismaService } from 'common/prisma.service'

import { SessionService } from './Service'

@Module({
  providers: [SessionService, PrismaService],
  exports: [SessionService],
})
export class SessionsModule {}
