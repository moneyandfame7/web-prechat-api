import type { Session } from '@generated/graphql'
import type { GqlContext } from 'types/other'

import { UnauthorizedError } from 'common/errors/Authorization'

export function getSession(req: GqlContext['req'], data?: keyof Session): Session {
  const session = req.prechatSession as Session

  if (!session) {
    throw new UnauthorizedError('#getSession - [helpers]')
  }

  return data ? session[data] : session
}
