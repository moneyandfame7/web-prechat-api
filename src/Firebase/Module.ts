import { Module } from '@nestjs/common'
import { FirebaseService } from './Service'

@Module({
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}
