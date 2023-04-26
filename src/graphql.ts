
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class CreateMessageInput {
    exampleField?: Nullable<number>;
}

export class UpdateMessageInput {
    id: number;
}

export class CreateUserInput {
    email: string;
    displayName: string;
    username: string;
}

export class UpdateUserInput {
    id: string;
    email?: Nullable<string>;
    displayName?: Nullable<string>;
    username?: Nullable<string>;
}

export class Message {
    id: string;
    text: string;
    User?: Nullable<User>;
}

export abstract class IQuery {
    abstract messages(): Nullable<Message>[] | Promise<Nullable<Message>[]>;

    abstract message(id: number): Nullable<Message> | Promise<Nullable<Message>>;

    abstract users(): Nullable<User>[] | Promise<Nullable<User>[]>;

    abstract user(id: string): Nullable<User> | Promise<Nullable<User>>;
}

export abstract class IMutation {
    abstract createMessage(createMessageInput: CreateMessageInput): Message | Promise<Message>;

    abstract updateMessage(updateMessageInput: UpdateMessageInput): Message | Promise<Message>;

    abstract removeMessage(id: number): Nullable<Message> | Promise<Nullable<Message>>;

    abstract createUser(createUserInput: CreateUserInput): User | Promise<User>;

    abstract updateUser(updateUserInput: UpdateUserInput): User | Promise<User>;

    abstract removeUser(id: string): Nullable<User> | Promise<Nullable<User>>;
}

export class User {
    id: string;
    email: string;
    displayName: string;
    username: string;
    createdAt: DateTime;
    messages?: Nullable<Nullable<Message>[]>;
}

export type DateTime = any;
type Nullable<T> = T | null;
