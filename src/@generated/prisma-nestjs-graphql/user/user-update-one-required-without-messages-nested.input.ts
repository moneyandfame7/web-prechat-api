import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { UserCreateWithoutMessagesInput } from './user-create-without-messages.input';
import { Type } from 'class-transformer';
import { UserCreateOrConnectWithoutMessagesInput } from './user-create-or-connect-without-messages.input';
import { UserUpsertWithoutMessagesInput } from './user-upsert-without-messages.input';
import { UserWhereUniqueInput } from './user-where-unique.input';
import { UserUpdateWithoutMessagesInput } from './user-update-without-messages.input';

@InputType()
export class UserUpdateOneRequiredWithoutMessagesNestedInput {

    @Field(() => UserCreateWithoutMessagesInput, {nullable:true})
    @Type(() => UserCreateWithoutMessagesInput)
    create?: UserCreateWithoutMessagesInput;

    @Field(() => UserCreateOrConnectWithoutMessagesInput, {nullable:true})
    @Type(() => UserCreateOrConnectWithoutMessagesInput)
    connectOrCreate?: UserCreateOrConnectWithoutMessagesInput;

    @Field(() => UserUpsertWithoutMessagesInput, {nullable:true})
    @Type(() => UserUpsertWithoutMessagesInput)
    upsert?: UserUpsertWithoutMessagesInput;

    @Field(() => UserWhereUniqueInput, {nullable:true})
    @Type(() => UserWhereUniqueInput)
    connect?: UserWhereUniqueInput;

    @Field(() => UserUpdateWithoutMessagesInput, {nullable:true})
    @Type(() => UserUpdateWithoutMessagesInput)
    update?: UserUpdateWithoutMessagesInput;
}
