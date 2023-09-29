import { Module } from '@nestjs/common'
import { StoriesRepository } from './Repository'
import { StoriesResolver } from './Resolver'
import { StoriesService } from './Service'

@Module({
  providers: [StoriesResolver, StoriesService, StoriesRepository],
  exports: [StoriesService, StoriesRepository],
})
export class StoriesModule {}
