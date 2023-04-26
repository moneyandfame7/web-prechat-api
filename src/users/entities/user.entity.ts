import { Field, ID } from '@nestjs/graphql';

export class User {
  @Field(() => ID)
  id: string;
}
