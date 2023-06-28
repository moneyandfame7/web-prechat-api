import { Module, forwardRef } from '@nestjs/common'

import { AuthModule } from 'authorization/auth.module'
import { FirebaseModule } from 'firebase/firebase.module'

import { UserService } from './users.service'
import { UserResolver } from './users.resolver'
import { PrismaService } from '../prisma.service'

@Module({
  imports: [forwardRef(() => AuthModule), FirebaseModule],
  providers: [UserService, UserResolver, PrismaService],
  exports: [UserService],
})
export class UserModule {}
