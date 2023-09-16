import { Global, Module } from '@nestjs/common'

import { UserModule } from 'Users/Module'
import { SessionsModule } from 'Sessions/Module'
import { MediaModule } from 'Media/Module'
import { AccountModule } from 'Account/Module'

import { FirebaseModule } from 'common/Firebase/Module'

import { AuthService } from './Service'
import { AuthResolver } from './Resolver'

// Make it global for AuthGuard
@Global()
@Module({
  imports: [UserModule, MediaModule, SessionsModule, FirebaseModule, AccountModule],
  providers: [AuthService, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
