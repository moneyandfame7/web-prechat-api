import { Injectable } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'
import { AuthorizationProvider } from '../constants/auth'

@Injectable()
export class JwtAuthGuard extends AuthGuard(AuthorizationProvider.Jwt) {
  getRequest(context: GqlExecutionContext) {
    const ctx = GqlExecutionContext.create(context)

    return ctx.getContext().req
  }
}
