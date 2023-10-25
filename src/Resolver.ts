import { Query, Resolver } from '@nestjs/graphql'

@Resolver('AppResolver')
export class AppResolver {
  // public constructor() {}
  @Query('ping')
  public pingPong() {
    return 'pong'
  }
}
