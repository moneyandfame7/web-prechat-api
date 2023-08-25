import { Injectable, type CanActivate, type ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import type { Request } from 'express'

import { SessionInvalidError, UnauthorizedError } from 'common/errors/Authorization'

import { AuthService } from './Service'
import type { GqlContext } from 'types/other'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext()
    const request = ctx.req as GqlContext['req']

    // ctx.req.extra.connectionParams.headers.prechat-session
    // або в onConnection змінювати і передавати токен, або там валідувати одразу
    // або робити все ТІЛЬКИ ТУТ?
    // подивитись що лежит в ctx.req коли це subscription
    // можливо треба діставати сессію з ctx connection, перевірити потім...

    // console.log(connection, 'conn')
    const session = ctx?.req?.extra?.headers?.['prechat-session'] || request.headers?.['prechat-session']

    if (!session) {
      throw new UnauthorizedError('authGuard')
    }
    const decoded = await this.authService.decodeSession(session as string)
    if (!decoded) {
      throw new SessionInvalidError('authGuard')
    }

    request.prechatSession = decoded
    // ctx.req.extra = {
    //   ...ctx?.req?.extra,
    //   SOSU_HUI: decoded,
    // }
    // connection.prechatSession = decoded

    return !!decoded
  }
}
