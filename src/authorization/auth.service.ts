import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import axios from 'axios'

import { UsersService } from 'src/users/users.service'
import { AuthInput, AuthResponse, CreateUserInput, User } from 'src/types/graphql'
import type { GooglePayload, JwtPayload } from './auth.type'

@Injectable()
export class AuthService {
  public readonly SECRET_ACCESS: string
  public readonly SECRET_REFRESH: string

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    this.SECRET_ACCESS = this.configService.get<string>('AT_TOKEN')
    this.SECRET_REFRESH = this.configService.get<string>('RT_TOKEN')
  }

  public async login(loginInput: AuthInput): Promise<AuthResponse> {
    const payload = await this.googleVerify(loginInput.token)

    const alreadyExistUser = await this.userService.findOneByEmail(payload.email)

    if (alreadyExistUser) {
      return this.buildLoginResponse(alreadyExistUser)
    }
    const profile: CreateUserInput = {
      email: payload.email,

      /* Set username from client */
      username: null,
      photo: payload.picture,
    }
    const created = await this.userService.create(profile)
    return this.buildLoginResponse(created)
  }

  public refresh(refreshToken: string): AuthResponse {
    const decoded = this.validateRefreshToken(refreshToken)

    if (!decoded) {
      throw new Error('Invalid token')
    }

    const accessToken = this.generateAccess(decoded)
    return {
      accessToken,
      refreshToken,
      user: decoded,
    }
  }

  private async googleVerify(token: string) {
    const { data } = await axios.get<GooglePayload>(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`,
    )

    return data
  }

  private validateRefreshToken(token: string) {
    return this.getJwtPayload(token, this.SECRET_REFRESH)
  }

  public getJwtPayload(token: string, secret: string) {
    try {
      return this.jwtService.verify<JwtPayload>(token, { secret })
    } catch (e) {
      console.warn(e)
      return null
    }
  }

  private generateAccess(user: User): string {
    const payload = this.getPayloadForJwt(user)

    return this.jwtService.sign(payload, { secret: this.SECRET_ACCESS, expiresIn: '1h' })
  }

  private generateRefresh(user: User): string {
    const payload = {
      ...this.getPayloadForJwt(user),
    }

    return this.jwtService.sign(payload, { secret: this.SECRET_REFRESH, expiresIn: '15d' })
  }

  public buildLoginResponse(user: User): AuthResponse {
    return {
      accessToken: this.generateAccess(user),
      refreshToken: this.generateRefresh(user),
      user,
    }
  }

  private getPayloadForJwt(user: User) {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
      photo: user.photo,
    }
  }
}
