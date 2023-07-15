import { Module } from '@nestjs/common'
import { MediaService } from './Service'
import { MediaResolver } from './Resolver'
import { FirebaseModule } from 'Firebase'

@Module({
  imports: [FirebaseModule],
  providers: [MediaResolver, MediaService],
  exports: [MediaService],
})
export class MediaModule {}
