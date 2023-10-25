import { Module } from '@nestjs/common'

import { FirebaseModule } from 'common/Firebase'
import { BuilderModule } from 'common/builder/Module'

import { MediaResolver } from './Resolver'
import { MediaService } from './Service'
import { MediaRepository } from './Repository'

@Module({
  imports: [FirebaseModule, BuilderModule],
  providers: [MediaResolver, MediaService, MediaRepository],
  exports: [MediaService],
})
export class MediaModule {}
