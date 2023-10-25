import { Injectable, type CanActivate, type ExecutionContext, Inject } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

import { SessionService } from 'Sessions'

import { SessionInvalidError, UnauthorizedError } from 'common/errors/Authorization'

import type { GqlContext } from 'types/other'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(SessionService) private readonly sessions: SessionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext()
    const request = ctx.req as GqlContext['req']

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

    return !!decoded
  }
}
