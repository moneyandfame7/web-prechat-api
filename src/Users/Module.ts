import { Module, forwardRef } from '@nestjs/common'

import { AuthModule } from 'Auth'
import { FirebaseModule } from 'Firebase'

import { UserService } from './Service'
import { UserResolver } from './Resolver'
import { PrismaService } from '../prisma.service'

@Module({
  imports: [forwardRef(() => AuthModule), FirebaseModule],
  providers: [UserService, UserResolver, PrismaService],
  exports: [UserService],
})
export class UserModule {}
