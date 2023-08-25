import { type ExecutionContext, createParamDecorator } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import type { Request } from 'express'

import type { Session } from '@generated/graphql'
import { UnauthorizedError } from 'common/errors/Authorization'
import type { GqlContext } from 'types/other'
import { getSession } from 'common/helpers/getSession'

export const CurrentSession = createParamDecorator((data: keyof Session, context: ExecutionContext) => {
  const ctx = GqlExecutionContext.create(context)
  const request = ctx.getContext().req as GqlContext['req']

  return getSession(request, data)
})
