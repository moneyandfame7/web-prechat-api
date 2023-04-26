import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { MessageUncheckedCreateNestedManyWithoutUserInput } from '../message/message-unchecked-create-nested-many-without-user.input';

@InputType()
export class UserUncheckedCreateInput {

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

    @Field(() => MessageUncheckedCreateNestedManyWithoutUserInput, {nullable:true})
    messages?: MessageUncheckedCreateNestedManyWithoutUserInput;
}
