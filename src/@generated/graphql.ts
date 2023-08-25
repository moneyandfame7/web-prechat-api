
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum ChatType {
    chatTypeGroup = "chatTypeGroup",
    chatTypeChannel = "chatTypeChannel",
    chatTypePrivate = "chatTypePrivate"
}

export enum UserAvatarVariants {
    GREEN = "GREEN",
    PINK = "PINK",
    BLUE = "BLUE",
    YELLOW = "YELLOW",
    PURPLE = "PURPLE",
    ORANGE = "ORANGE"
}

export class Connection {
    ipVersion: number;
    ipAddress: string;
    latitude: number;
    longitude: number;
    countryName: string;
    countryCode: string;
    continentCode: string;
    continent: string;
    timeZone: string;
    zipCode: string;
    cityName: string;
    regionName: string;
    browser?: Nullable<string>;
    platform?: Nullable<string>;
}

export class SignUpInput {
    silent: boolean;
    connection: Connection;
    firstName: string;
    phoneNumber: string;
    firebase_token: string;
    lastName?: Nullable<string>;
}

export class SignInInput {
    firebase_token: string;
    connection: Connection;
    phoneNumber: string;
}

export class ChatInput {
    chatId: string;
}

export class CreateGroupInput {
    users: string[];
    title: string;
}

export class CreateChannelInput {
    users?: Nullable<string[]>;
    title: string;
    description?: Nullable<string>;
}

export class AddChatMembersInput {
    chatId: string;
    userIds: string[];
}

export class DeleteChatMemberInput {
    chatId: string;
    userId: string;
}

export class AddContactInput {
    firstName: string;
    lastName?: Nullable<string>;
    userId?: Nullable<string>;
    phoneNumber?: Nullable<string>;
    addPrivacyPhoneException?: Nullable<boolean>;
}

export class UpdateContactInput {
    firstName: string;
    lastName?: Nullable<string>;
    userId: string;
}

export class GetLangStringInput {
    code: string;
    key: string;
}

export class SearchGlobalInput {
    query: string;
    limit?: Nullable<number>;
}

export class SessionData {
    ip: string;
    region: string;
    country: string;
    platform: string;
    browser: string;
}

export class CreateUserInput {
    firstName: string;
    lastName?: Nullable<string>;
    phoneNumber: string;
    photoUrl?: Nullable<string>;
    sessionData?: Nullable<SessionData>;
}

export class GetUsersInput {
    ids: string[];
}

export class UserInput {
    userId: string;
}

export class AuthTwoFa {
    hint?: Nullable<string>;
    email?: Nullable<string>;
}

export abstract class IQuery {
    abstract getPassword(): Nullable<AuthTwoFa> | Promise<Nullable<AuthTwoFa>>;

    abstract ping(): Nullable<Any> | Promise<Nullable<Any>>;

    abstract getTwoFa(token: string): Nullable<TwoFactorAuth> | Promise<Nullable<TwoFactorAuth>>;

    abstract sendPhone(phone: string): SendPhoneResponse | Promise<SendPhoneResponse>;

    abstract getChatSettings(input: ChatInput): GetChatSettings | Promise<GetChatSettings>;

    abstract getChats(): Chat[] | Promise<Chat[]>;

    abstract getContacts(): Nullable<User[]> | Promise<Nullable<User[]>>;

    abstract getLangPack(code: string): LangPack | Promise<LangPack>;

    abstract getLangString(input: GetLangStringInput): string | Promise<string>;

    abstract getLanguages(): Language[] | Promise<Language[]>;

    abstract getLanguage(code: string): Language | Promise<Language>;

    abstract getCountriesList(code: string): Country[] | Promise<Country[]>;

    abstract searchGlobal(input: SearchGlobalInput): SearchGlobalResponse | Promise<SearchGlobalResponse>;

    abstract searchUsers(input: SearchGlobalInput): SearchUsersResponse | Promise<SearchUsersResponse>;

    abstract translateHello(): Nullable<Any> | Promise<Nullable<Any>>;

    abstract translateCountries(lng: string, outputFile: string): boolean | Promise<boolean>;

    abstract getUsers(input: GetUsersInput): User[] | Promise<User[]>;

    abstract getUserFull(input: UserInput): UserFull | Promise<UserFull>;
}

export abstract class IMutation {
    abstract checkPassword(password: string): Nullable<Any> | Promise<Nullable<Any>>;

    abstract signUp(input: SignUpInput, photo?: Nullable<Upload>): SignUpResponse | Promise<SignUpResponse>;

    abstract signIn(input: SignInInput): SignInResponse | Promise<SignInResponse>;

    abstract terminateAuthorization(id: string): boolean | Promise<boolean>;

    abstract terminateAllAuthorizations(): boolean | Promise<boolean>;

    abstract createChannel(input: CreateChannelInput): Chat | Promise<Chat>;

    abstract createGroup(input: CreateGroupInput): Chat | Promise<Chat>;

    abstract addChatMembers(input: AddChatMembersInput): Nullable<Any> | Promise<Nullable<Any>>;

    abstract deleteChatMember(input?: Nullable<DeleteChatMemberInput>): Nullable<Any> | Promise<Nullable<Any>>;

    abstract deleteChat(input: ChatInput): Nullable<Any> | Promise<Nullable<Any>>;

    abstract addContact(input?: Nullable<AddContactInput>): User | Promise<User>;

    abstract updateContact(input: UpdateContactInput): Nullable<Any> | Promise<Nullable<Any>>;

    abstract deleteContact(userId: string): Nullable<Any> | Promise<Nullable<Any>>;
}

export class TwoFactorAuth {
    hint?: Nullable<string>;
    email?: Nullable<string>;
}

export class SendPhoneResponse {
    userId?: Nullable<string>;
    hasActiveSession: boolean;
}

export class SignUpResponse {
    sessionHash: string;
}

export class SignInResponse {
    sessionHash: string;
}

export class Chat {
    id: string;
    type: ChatType;
    title: string;
    membersCount?: Nullable<number>;
    unreadCount?: Nullable<number>;
    isNotJoined?: Nullable<boolean>;
    isForbidden?: Nullable<boolean>;
    isSupport?: Nullable<boolean>;
    lastMessage?: Nullable<Any>;
    createdAt?: Nullable<DateTime>;
}

export class ChatSettings {
    canAddContact?: Nullable<boolean>;
    canShareContact?: Nullable<boolean>;
    canReportSpam?: Nullable<boolean>;
    canBlockContact?: Nullable<boolean>;
}

export class GetChatSettings {
    users: User[];
    settings: ChatSettings;
}

export class ChatCreatedUpdate {
    chat: Chat;
    users: User[];
}

export abstract class ISubscription {
    abstract onChatCreated(): ChatCreatedUpdate | Promise<ChatCreatedUpdate>;
}

export class LangPack {
    strings: JSON;
    langCode: string;
}

export class Language {
    name: string;
    nativeName: string;
    langCode: string;
    stringsCount: number;
}

export class Country {
    name: string;
    dial_code: string;
    emoji: string;
    code: string;
}

export class SearchGlobalResponse {
    knownChats?: Nullable<Any>;
    knownUsers?: Nullable<User[]>;
    globalChats?: Nullable<Any>;
    globalUsers?: Nullable<User[]>;
}

export class SearchUsersResponse {
    globalUsers?: Nullable<User[]>;
    knownUsers?: Nullable<User[]>;
}

export class Session {
    id: string;
    ip: string;
    region: string;
    country: string;
    platform: string;
    browser: string;
    createdAt: DateTime;
    activeAt: DateTime;
    userId: string;
}

export class User {
    id: string;
    firstName: string;
    phoneNumber: string;
    lastName?: Nullable<string>;
    username?: Nullable<string>;
    isContact: boolean;
    isSelf: boolean;
    isMutualContact: boolean;
    fullInfo: UserFull;
}

export class UserAvatar {
    avatarVariant: UserAvatarVariants;
    hash?: Nullable<string>;
    url?: Nullable<string>;
}

export class UserFull {
    avatar: UserAvatar;
    bio?: Nullable<string>;
}

export type Any = any;
export type JSON = any;
export type UUID = any;
export type DateTime = any;
export type Upload = any;
type Nullable<T> = T | null;
