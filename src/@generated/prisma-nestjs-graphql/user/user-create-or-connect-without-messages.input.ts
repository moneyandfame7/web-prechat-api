import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { UserWhereUniqueInput } from './user-where-unique.input';
import { Type } from 'class-transformer';
import { UserCreateWithoutMessagesInput } from './user-create-without-messages.input';

@InputType()
export class UserCreateOrConnectWithoutMessagesInput {

    @Field(() => UserWhereUniqueInput, {nullable:false})
    @Type(() => UserWhereUniqueInput)
    where!: UserWhereUniqueInput;

    @Field(() => UserCreateWithoutMessagesInput, {nullable:false})
    @Type(() => UserCreateWithoutMessagesInput)
    create!: UserCreateWithoutMessagesInput;
}
