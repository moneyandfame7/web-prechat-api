import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { BadRequestException, Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  public constructor(private readonly config: ConfigService) {
    super({
      clientID: config.get('GOOGLE_CLIENT_ID'),
      clientSecret: config.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: config.get('CLIENT_URL') + '/auth/google/redirect',
      scope: ['profile', 'email'],
    });
  }

  public async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    if (!profile.emails) {
      throw new BadRequestException('An error has occurred. Try another authorization method.');
    }

    const userInfo = {
      email: profile.emails[0].value,
      username: `@${profile.displayName?.trim().toLowerCase().replace(/ +/g, '')}`,
      displayName: profile.displayName,
      photo: profile.photos[0].value,
    };

    done(null, userInfo);
  }
}
