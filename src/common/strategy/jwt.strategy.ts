import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { AuthService } from 'src/authorization/auth.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  public constructor(private readonly config: ConfigService, private readonly authService: AuthService) {
    super({
      /*  це поле для  Headers "Authorization" */
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('AT_SECRET'),
    })
  }

  /* @TODO: payload - decoded jwt, fix any */
  public async validate(payload: any): Promise<any> {
    console.log(payload)

    return payload
  }
}
