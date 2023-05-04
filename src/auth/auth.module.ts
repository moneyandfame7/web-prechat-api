import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthResolver } from './auth.resolver';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/common/strategy/jwt.strategy';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { GoogleStrategy } from 'src/common/strategy/google.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      /* TODO: swtich to Config */
      /* подивитись, як імпортувати/експортувати модулі/сервіси в nestjs */
      secret: process.env.AT_SECRET,
    }),
    forwardRef(() => UsersModule),
  ],

  providers: [AuthService, JwtStrategy, GoogleStrategy, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
