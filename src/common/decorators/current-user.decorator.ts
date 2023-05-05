import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { Ctx } from 'src/types/ctx';

export const CurrentUser = createParamDecorator((data: keyof User, ctx: ExecutionContext) => {
  const user = GqlExecutionContext.create(ctx).getContext<Ctx>().req.user;

  return data ? user[data] : user;
});
