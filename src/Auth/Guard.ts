import { Injectable, type CanActivate, type ExecutionContext, Inject } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

import { SessionInvalidError, UnauthorizedError } from 'common/errors/Authorization'

import type { GqlContext } from 'types/other'
import { SessionService } from 'Sessions'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(SessionService) private readonly sessions: SessionService) {}

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
    let decoded
    try {
      decoded = await this.sessions.getById(session as string)
    } catch (e) {
      throw new SessionInvalidError('authGuard')
    }

    if (!decoded) {
      throw new SessionInvalidError('authGuard')
    }

    request.prechatSession = decoded

    // ctx.req = {
    //   ...ctx.req,
    //   prechatSession: decoded,
    // }
    // req
    // ctx.req.extra = {
    //   ...ctx?.req?.extra,
    //   SOSU_HUI: decoded,
    // }
    // connection.prechatSession = decoded

    return !!decoded
  }
}
