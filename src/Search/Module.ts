import { Module } from '@nestjs/common'

import { AuthModule } from 'Auth/Module'

import { PrismaService } from 'common/prisma.service'

import { SearchResolver } from './Resolver'
import { SearchService } from './Service'
import { SearchRepository } from './Repository'

@Module({
  imports: [AuthModule],
  providers: [SearchResolver, PrismaService, SearchService, SearchRepository],
  exports: [SearchService],
})
export class SearchModule {}
