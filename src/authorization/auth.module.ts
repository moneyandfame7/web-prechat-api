import { MediaModule } from './../media/media.module'
import { Module } from '@nestjs/common'

import { UserModule } from 'users/users.module'
import { FirebaseModule } from 'firebase/firebase.module'
import { SessionsModule } from 'sessions/sessions.module'

import { AuthService } from './auth.service'
import { AuthResolver } from './auth.resolver'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [
    MediaModule,
    SessionsModule,
    UserModule,
    FirebaseModule,
    JwtModule.register({
      secret: 'SECRET',
    }),
  ],
  providers: [AuthService, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
