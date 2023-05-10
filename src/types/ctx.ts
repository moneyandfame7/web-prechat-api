import { User } from '@prisma/client'
import { Request, Response } from 'express'

export interface Ctx {
  req: Request & { user?: User }
  res: Response
}
export interface GqlContext {
  req: Request
  res: Response
  payload?: any
  // required for subscription
  connection: any
}
