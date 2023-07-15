import { Injectable, type CanActivate, type ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import type { Request } from 'express'
import type { Observable } from 'rxjs'

import { ApiService } from './Service'

import { ApiError } from 'common/errors'

@Injectable()
export class ApiGuard implements CanActivate {
  public constructor(private readonly apiService: ApiService) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = GqlExecutionContext.create(context).getContext().req as Request

    return this.validateApiToken(req)
  }

  private validateApiToken(req: Request) {
    const token = req.headers['prechat-api-token'] as string | undefined

    console.log(req.socket.remoteAddress)
    if (!token) {
      throw new ApiError('API_TOKEN_NOT_PROVIDED')
    }

    return this.apiService.verifyApiToken(token)
    // return this.apiService.verifyApiToken(token)
  }
}
