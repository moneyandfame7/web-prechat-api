import { Module } from '@nestjs/common'
import { MediaService } from './media.service'
import { MediaResolver } from './media.resolver'
import { FirebaseModule } from 'firebase/firebase.module'

@Module({
  imports: [FirebaseModule],
  providers: [MediaResolver, MediaService],
  exports: [MediaService],
})
export class MediaModule {}
