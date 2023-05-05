import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
  @Query('ping')
  public pingPong() {
    return 'pong';
  }
}
