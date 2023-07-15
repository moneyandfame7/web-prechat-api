import { JwtModule } from '@nestjs/jwt'
import { Module } from '@nestjs/common'

import { UserModule } from 'Users/Module'
import { FirebaseModule } from 'Firebase/Module'
import { SessionsModule } from 'Sessions/Module'
import { MediaModule } from 'Media/Module'

import { AuthService } from './Service'
import { AuthResolver } from './Resolver'

@Module({
  imports: [
    UserModule,
    MediaModule,
    SessionsModule,
    FirebaseModule,
    JwtModule.register({
      secret: 'SECRET',
      global: true,
    }),
  ],
  providers: [AuthService, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
