import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { MessageWhereUniqueInput } from './message-where-unique.input';
import { Type } from 'class-transformer';
import { MessageCreateWithoutUserInput } from './message-create-without-user.input';

@InputType()
export class MessageCreateOrConnectWithoutUserInput {

    @Field(() => MessageWhereUniqueInput, {nullable:false})
    @Type(() => MessageWhereUniqueInput)
    where!: MessageWhereUniqueInput;

    @Field(() => MessageCreateWithoutUserInput, {nullable:false})
    @Type(() => MessageCreateWithoutUserInput)
    create!: MessageCreateWithoutUserInput;
}
