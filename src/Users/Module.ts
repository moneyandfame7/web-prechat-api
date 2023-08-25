import { Module, forwardRef } from '@nestjs/common'

import { AuthModule } from 'Auth'

import { FirebaseModule } from 'common/Firebase'
import { PrismaService } from 'common/prisma.service'

import { UserService } from './Service'
import { UserResolver } from './Resolver'

@Module({
  imports: [forwardRef(() => AuthModule), FirebaseModule],
  providers: [UserService, UserResolver, PrismaService],
  exports: [UserService],
})
export class UserModule {}
