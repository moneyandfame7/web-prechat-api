import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { MessageCreateWithoutUserInput } from './message-create-without-user.input';
import { Type } from 'class-transformer';
import { MessageCreateOrConnectWithoutUserInput } from './message-create-or-connect-without-user.input';
import { MessageCreateManyUserInputEnvelope } from './message-create-many-user-input-envelope.input';
import { MessageWhereUniqueInput } from './message-where-unique.input';

@InputType()
export class MessageCreateNestedManyWithoutUserInput {

    @Field(() => [MessageCreateWithoutUserInput], {nullable:true})
    @Type(() => MessageCreateWithoutUserInput)
    create?: Array<MessageCreateWithoutUserInput>;

    @Field(() => [MessageCreateOrConnectWithoutUserInput], {nullable:true})
    @Type(() => MessageCreateOrConnectWithoutUserInput)
    connectOrCreate?: Array<MessageCreateOrConnectWithoutUserInput>;

    @Field(() => MessageCreateManyUserInputEnvelope, {nullable:true})
    @Type(() => MessageCreateManyUserInputEnvelope)
    createMany?: MessageCreateManyUserInputEnvelope;

    @Field(() => [MessageWhereUniqueInput], {nullable:true})
    @Type(() => MessageWhereUniqueInput)
    connect?: Array<MessageWhereUniqueInput>;
}
