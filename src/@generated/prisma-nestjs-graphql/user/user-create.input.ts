import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { MessageCreateNestedManyWithoutUserInput } from '../message/message-create-nested-many-without-user.input';

@InputType()
export class UserCreateInput {

    @Field(() => String, {nullable:true})
    id?: string;

    @Field(() => String, {nullable:false})
    email!: string;

    @Field(() => String, {nullable:false})
    username!: string;

    @Field(() => String, {nullable:false})
    displayName!: string;

    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;

    @Field(() => MessageCreateNestedManyWithoutUserInput, {nullable:true})
    messages?: MessageCreateNestedManyWithoutUserInput;
}
