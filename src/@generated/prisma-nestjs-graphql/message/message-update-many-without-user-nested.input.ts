import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { MessageCreateWithoutUserInput } from './message-create-without-user.input';
import { Type } from 'class-transformer';
import { MessageCreateOrConnectWithoutUserInput } from './message-create-or-connect-without-user.input';
import { MessageUpsertWithWhereUniqueWithoutUserInput } from './message-upsert-with-where-unique-without-user.input';
import { MessageCreateManyUserInputEnvelope } from './message-create-many-user-input-envelope.input';
import { MessageWhereUniqueInput } from './message-where-unique.input';
import { MessageUpdateWithWhereUniqueWithoutUserInput } from './message-update-with-where-unique-without-user.input';
import { MessageUpdateManyWithWhereWithoutUserInput } from './message-update-many-with-where-without-user.input';
import { MessageScalarWhereInput } from './message-scalar-where.input';

@InputType()
export class MessageUpdateManyWithoutUserNestedInput {

    @Field(() => [MessageCreateWithoutUserInput], {nullable:true})
    @Type(() => MessageCreateWithoutUserInput)
    create?: Array<MessageCreateWithoutUserInput>;

    @Field(() => [MessageCreateOrConnectWithoutUserInput], {nullable:true})
    @Type(() => MessageCreateOrConnectWithoutUserInput)
    connectOrCreate?: Array<MessageCreateOrConnectWithoutUserInput>;

    @Field(() => [MessageUpsertWithWhereUniqueWithoutUserInput], {nullable:true})
    @Type(() => MessageUpsertWithWhereUniqueWithoutUserInput)
    upsert?: Array<MessageUpsertWithWhereUniqueWithoutUserInput>;

    @Field(() => MessageCreateManyUserInputEnvelope, {nullable:true})
    @Type(() => MessageCreateManyUserInputEnvelope)
    createMany?: MessageCreateManyUserInputEnvelope;

    @Field(() => [MessageWhereUniqueInput], {nullable:true})
    @Type(() => MessageWhereUniqueInput)
    set?: Array<MessageWhereUniqueInput>;

    @Field(() => [MessageWhereUniqueInput], {nullable:true})
    @Type(() => MessageWhereUniqueInput)
    disconnect?: Array<MessageWhereUniqueInput>;

    @Field(() => [MessageWhereUniqueInput], {nullable:true})
    @Type(() => MessageWhereUniqueInput)
    delete?: Array<MessageWhereUniqueInput>;

    @Field(() => [MessageWhereUniqueInput], {nullable:true})
    @Type(() => MessageWhereUniqueInput)
    connect?: Array<MessageWhereUniqueInput>;

    @Field(() => [MessageUpdateWithWhereUniqueWithoutUserInput], {nullable:true})
    @Type(() => MessageUpdateWithWhereUniqueWithoutUserInput)
    update?: Array<MessageUpdateWithWhereUniqueWithoutUserInput>;

    @Field(() => [MessageUpdateManyWithWhereWithoutUserInput], {nullable:true})
    @Type(() => MessageUpdateManyWithWhereWithoutUserInput)
    updateMany?: Array<MessageUpdateManyWithWhereWithoutUserInput>;

    @Field(() => [MessageScalarWhereInput], {nullable:true})
    @Type(() => MessageScalarWhereInput)
    deleteMany?: Array<MessageScalarWhereInput>;
}
