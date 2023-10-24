import { Global, Module } from '@nestjs/common'

import { PrismaService } from 'common/prisma.service'

import { SessionService } from './Service'

/* Global for work AUth Guard which use this session service */
@Global()
@Module({
  providers: [SessionService, PrismaService],
  exports: [SessionService],
})
export class SessionsModule {}
