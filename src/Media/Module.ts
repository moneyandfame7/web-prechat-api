import { Module } from '@nestjs/common'

import { FirebaseModule } from 'common/Firebase'
import { BuilderModule } from 'common/builder/Module'
import { PrismaService } from 'common/prisma.service'

import { MediaResolver } from './Resolver'
import { MediaService } from './Service'
import { MediaRepository } from './Repository'

@Module({
  imports: [FirebaseModule, BuilderModule],
  providers: [MediaResolver, MediaService, MediaRepository, PrismaService],
  exports: [MediaService],
})
export class MediaModule {}
