import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Ctx } from 'src/types/ctx';

export const GqlUser = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const user = GqlExecutionContext.create(ctx).getContext<Ctx>().req.user;

  return data ? user && user[data] : user;
});
