import { type ExecutionContext, createParamDecorator } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

import type { Session } from '@generated/graphql'

import { getSession } from 'common/helpers/getSession'

import type { GqlContext } from '../../interfaces/helpers'

export const CurrentSession = createParamDecorator((data: keyof Session, context: ExecutionContext) => {
  const ctx = GqlExecutionContext.create(context)
  const request = ctx.getContext().req as GqlContext['req']

  return getSession(request, data)
})
