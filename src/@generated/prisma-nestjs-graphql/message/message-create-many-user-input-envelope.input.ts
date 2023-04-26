import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { MessageCreateManyUserInput } from './message-create-many-user.input';
import { Type } from 'class-transformer';

@InputType()
export class MessageCreateManyUserInputEnvelope {

    @Field(() => [MessageCreateManyUserInput], {nullable:false})
    @Type(() => MessageCreateManyUserInput)
    data!: Array<MessageCreateManyUserInput>;

    @Field(() => Boolean, {nullable:true})
    skipDuplicates?: boolean;
}
