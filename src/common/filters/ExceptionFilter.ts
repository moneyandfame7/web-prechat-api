import { type ArgumentsHost, Catch, HttpException } from '@nestjs/common'
import { GqlArgumentsHost, type GqlExceptionFilter } from '@nestjs/graphql'

@Catch(HttpException)
export class ExceptionFilter implements GqlExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host)

    console.log({ exception })
    // return exception
  }
}
