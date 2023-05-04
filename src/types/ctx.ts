import { User } from '@prisma/client';
import { Request, Response } from 'express';

export interface Ctx {
  req: Request & { user?: User };
  res: Response;
}
