import { JwtModule } from '@nestjs/jwt'
import { Module } from '@nestjs/common'

import { UserModule } from 'Users/Module'
import { SessionsModule } from 'Sessions/Module'
import { MediaModule } from 'Media/Module'
import { AccountModule } from 'Account/Module'

import { FirebaseModule } from 'common/Firebase/Module'

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
    AccountModule,
  ],
  providers: [AuthService, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
