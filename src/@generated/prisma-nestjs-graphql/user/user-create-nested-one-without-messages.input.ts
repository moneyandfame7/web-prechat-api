import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { UserCreateWithoutMessagesInput } from './user-create-without-messages.input';
import { Type } from 'class-transformer';
import { UserCreateOrConnectWithoutMessagesInput } from './user-create-or-connect-without-messages.input';
import { UserWhereUniqueInput } from './user-where-unique.input';

@InputType()
export class UserCreateNestedOneWithoutMessagesInput {

    @Field(() => UserCreateWithoutMessagesInput, {nullable:true})
    @Type(() => UserCreateWithoutMessagesInput)
    create?: UserCreateWithoutMessagesInput;

    @Field(() => UserCreateOrConnectWithoutMessagesInput, {nullable:true})
    @Type(() => UserCreateOrConnectWithoutMessagesInput)
    connectOrCreate?: UserCreateOrConnectWithoutMessagesInput;

    @Field(() => UserWhereUniqueInput, {nullable:true})
    @Type(() => UserWhereUniqueInput)
    connect?: UserWhereUniqueInput;
}
