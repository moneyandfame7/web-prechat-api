
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class AuthInput {
    token: string;
}

export class CreateConversationInput {
    exampleField?: Nullable<number>;
}

export class UpdateConversationInput {
    id: number;
}

export class CreateMessageInput {
    exampleField?: Nullable<number>;
}

export class UpdateMessageInput {
    id: number;
}

export class CreateUserInput {
    email: string;
    username?: Nullable<string>;
    photo: string;
}

export class UpdateUserInput {
    email?: Nullable<string>;
    username?: Nullable<string>;
}

export class CreateUsernameInput {
    username: string;
}

export abstract class IQuery {
    abstract ping(): string | Promise<string>;

    abstract conversations(): Nullable<Conversation>[] | Promise<Nullable<Conversation>[]>;

    abstract conversation(id: number): Nullable<Conversation> | Promise<Nullable<Conversation>>;

    abstract messages(): Nullable<Message>[] | Promise<Nullable<Message>[]>;

    abstract message(id: number): Nullable<Message> | Promise<Nullable<Message>>;

    abstract searchUsers(username: string): Nullable<Nullable<SearchedUser>[]> | Promise<Nullable<Nullable<SearchedUser>[]>>;

    abstract user(id: string): Nullable<User> | Promise<Nullable<User>>;

    abstract me(): Nullable<User> | Promise<Nullable<User>>;
}

export class AuthResponse {
    user: User;
    refreshToken: string;
    accessToken: string;
}

export abstract class IMutation {
    abstract login(loginInput: AuthInput): AuthResponse | Promise<AuthResponse>;

    abstract refresh(refreshInput: AuthInput): AuthResponse | Promise<AuthResponse>;

    abstract createConversation(createConversationInput: CreateConversationInput): Conversation | Promise<Conversation>;

    abstract updateConversation(updateConversationInput: UpdateConversationInput): Conversation | Promise<Conversation>;

    abstract removeConversation(id: number): Nullable<Conversation> | Promise<Nullable<Conversation>>;

    abstract createMessage(createMessageInput: CreateMessageInput): Message | Promise<Message>;

    abstract updateMessage(updateMessageInput: UpdateMessageInput): Message | Promise<Message>;

    abstract removeMessage(id: number): Nullable<Message> | Promise<Nullable<Message>>;

    abstract createUser(createUserInput: CreateUserInput): User | Promise<User>;

    abstract updateUser(updateUserInput: UpdateUserInput): User | Promise<User>;

    abstract createUsername(createUsernameInput: CreateUsernameInput): AuthResponse | Promise<AuthResponse>;

    abstract removeUser(id: string): Nullable<User> | Promise<Nullable<User>>;
}

export class Conversation {
    exampleField?: Nullable<number>;
}

export class CreateConversationResponse {
    conversationId: string;
}

export class Message {
    id: string;
    text: string;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
    User: User;
}

export class User {
    id: string;
    email: string;
    username?: Nullable<string>;
    photo: string;
    createdAt?: Nullable<DateTime>;
    messages?: Nullable<Nullable<Message>[]>;
}

export class SearchedUser {
    id: string;
    username: string;
    photo: string;
}

export type DateTime = any;
type Nullable<T> = T | null;
