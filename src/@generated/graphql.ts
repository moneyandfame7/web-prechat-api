
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

export enum HistoryDirection {
    Backwards = "Backwards",
    Around = "Around",
    Forwards = "Forwards"
}

export enum MessageEntityType {
    italic = "italic",
    bold = "bold",
    underline = "underline",
    strike = "strike",
    spoiler = "spoiler",
    email = "email",
    phone = "phone",
    url = "url",
    textUrl = "textUrl",
    mention = "mention",
    code = "code",
    hashtag = "hashtag"
}

export enum MessageActionType {
    chatCreate = "chatCreate",
    channelCreate = "channelCreate"
}

export enum ColorVariants {
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

export class GetChatsInput {
    archived?: Nullable<boolean>;
    offset?: Nullable<number>;
    limit?: Nullable<number>;
}

export class GetCommonGroupsInput {
    userId: string;
    offsetId?: Nullable<string>;
    limit?: Nullable<number>;
}

export class InputChat {
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

export class InputMedia {
    id: string;
    isMedia: boolean;
    mimeType: string;
    withSpoiler?: Nullable<boolean>;
    sendAsFile?: Nullable<boolean>;
}

export class GetHistoryInput {
    direction: HistoryDirection;
    chatId: string;
    maxDate?: Nullable<DateTime>;
    offsetId?: Nullable<number>;
    offsetNativeId?: Nullable<string>;
    limit?: Nullable<number>;
    includeOffset?: Nullable<boolean>;
}

export class DeleteMessagesInput {
    ids: string[];
}

export class SendMessageInput {
    id: string;
    orderedId: number;
    chatId: string;
    sendAs?: Nullable<string>;
    silent?: Nullable<boolean>;
    entities?: Nullable<MessageEntityInput[]>;
    text?: Nullable<string>;
    fileOptions?: Nullable<Any>;
    shouldSendMediaAsDocument?: Nullable<boolean>;
}

export class EditMessageInput {
    chatId: string;
    messageId: string;
    text: string;
}

export class ReadHistoryInput {
    chatId: string;
    maxId: number;
}

export class SaveDraftInput {
    text?: Nullable<string>;
    chatId: string;
}

export class MessageEntityInput {
    start: number;
    end: number;
    type: MessageEntityType;
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
}

export class GetUsersInput {
    ids: string[];
}

export class InputUser {
    userId: string;
}

export abstract class IQuery {
    abstract getAuthorizations(): Session[] | Promise<Session[]>;

    abstract ping(): Nullable<Any> | Promise<Nullable<Any>>;

    abstract getTwoFa(token: string): Nullable<TwoFactorAuth> | Promise<Nullable<TwoFactorAuth>>;

    abstract sendPhone(phone: string): SendPhoneResponse | Promise<SendPhoneResponse>;

    abstract getChats(): Chat[] | Promise<Chat[]>;

    abstract getCommonGroups(input: GetCommonGroupsInput): Chat[] | Promise<Chat[]>;

    abstract getChatsTest(input: GetChatsInput): Nullable<Chat[]> | Promise<Nullable<Chat[]>>;

    abstract getChat(chatId: string): Chat | Promise<Chat>;

    abstract getChatFull(chatId: string): ChatFull | Promise<ChatFull>;

    abstract resolveUsername(username: string): Nullable<Peer> | Promise<Nullable<Peer>>;

    abstract getContacts(): Nullable<User[]> | Promise<Nullable<User[]>>;

    abstract getLangPack(code: string): LangPack | Promise<LangPack>;

    abstract getLangString(input: GetLangStringInput): string | Promise<string>;

    abstract getLanguages(): Language[] | Promise<Language[]>;

    abstract getLanguage(code: string): Language | Promise<Language>;

    abstract getCountriesList(code: string): Country[] | Promise<Country[]>;

    abstract getHistory(input: GetHistoryInput): Message[] | Promise<Message[]>;

    abstract getPrivateChat(): Nullable<Any> | Promise<Nullable<Any>>;

    abstract getUsers(input: GetUsersInput): User[] | Promise<User[]>;

    abstract getUserFull(input: InputUser): UserFull | Promise<UserFull>;
}

export abstract class IMutation {
    abstract terminateAuthorization(id: string): boolean | Promise<boolean>;

    abstract terminateAllAuthorizations(): boolean | Promise<boolean>;

    abstract updateAuthorizationActivity(): Session | Promise<Session>;

    abstract updateUserStatus(online: boolean): Any | Promise<Any>;

    abstract signUp(input: SignUpInput): Session | Promise<Session>;

    abstract signIn(input: SignInInput): Session | Promise<Session>;

    abstract createChannel(input: CreateChannelInput): Chat | Promise<Chat>;

    abstract createGroup(input: CreateGroupInput): Chat | Promise<Chat>;

    abstract addChatMembers(input: AddChatMembersInput): Nullable<Any> | Promise<Nullable<Any>>;

    abstract deleteChatMember(input?: Nullable<DeleteChatMemberInput>): Nullable<Any> | Promise<Nullable<Any>>;

    abstract deleteChat(input: InputChat): Nullable<Any> | Promise<Nullable<Any>>;

    abstract addContact(input?: Nullable<AddContactInput>): User | Promise<User>;

    abstract updateContact(input: UpdateContactInput): boolean | Promise<boolean>;

    abstract deleteContact(userId: string): User | Promise<User>;

    abstract uploadProfilePhoto(file: Upload): Photo | Promise<Photo>;

    abstract sendMessage(input: SendMessageInput, files?: Nullable<Upload[]>): NewMessagePayload | Promise<NewMessagePayload>;

    abstract deleteMessages(input: DeleteMessagesInput): boolean | Promise<boolean>;

    abstract editMessage(input: EditMessageInput): Message | Promise<Message>;

    abstract readHistory(input: ReadHistoryInput): ReadHistoryPayload | Promise<ReadHistoryPayload>;

    abstract saveDraft(input: SaveDraftInput): boolean | Promise<boolean>;
}

export abstract class ISubscription {
    abstract onAuthorizationTerminated(): Session[] | Promise<Session[]>;

    abstract onAuthorizationUpdated(): Session | Promise<Session>;

    abstract onAuthorizationCreated(): Session | Promise<Session>;

    abstract onUserStatusUpdated(): UpdateUserStatus | Promise<UpdateUserStatus>;

    abstract onChatCreated(): ChatCreatedUpdate | Promise<ChatCreatedUpdate>;

    abstract onNewMessage(): NewMessagePayload | Promise<NewMessagePayload>;

    abstract onDeleteMessages(): DeleteMessagesPayload | Promise<DeleteMessagesPayload>;

    abstract onEditMessage(): EditMessagePayload | Promise<EditMessagePayload>;

    abstract onDraftUpdate(): UpdateDraftPayload | Promise<UpdateDraftPayload>;

    abstract onReadHistoryInbox(): ReadHistoryInboxPayload | Promise<ReadHistoryInboxPayload>;

    abstract onReadHistoryOutbox(): ReadHistoryOutboxPayload | Promise<ReadHistoryOutboxPayload>;
}

export class AuthTwoFa {
    hint?: Nullable<string>;
    email?: Nullable<string>;
}

export class UpdateUserStatus {
    userId: string;
    status: Any;
}

export class TwoFactorAuth {
    hint?: Nullable<string>;
    email?: Nullable<string>;
}

export class SendPhoneResponse {
    userId?: Nullable<string>;
    hasActiveSession: boolean;
}

export class Chat {
    id: string;
    userId?: Nullable<string>;
    lastReadIncomingMessageId?: Nullable<number>;
    lastReadOutgoingMessageId?: Nullable<number>;
    folderId?: Nullable<number>;
    color: ColorVariants;
    draft?: Nullable<string>;
    type: ChatType;
    title: string;
    photo?: Nullable<Photo>;
    membersCount?: Nullable<number>;
    unreadCount?: Nullable<number>;
    isNotJoined?: Nullable<boolean>;
    isForbidden?: Nullable<boolean>;
    isSupport?: Nullable<boolean>;
    isRestricted?: Nullable<boolean>;
    lastMessage?: Nullable<Message>;
    isOwner?: Nullable<boolean>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
    isSavedMessages?: Nullable<boolean>;
    isPinned?: Nullable<boolean>;
    inviteLink?: Nullable<string>;
    _id: string;
}

export class ChatMember {
    userId: string;
    inviterId?: Nullable<string>;
    promotedByUserId?: Nullable<string>;
    kickedByUserId?: Nullable<string>;
    joinedDate?: Nullable<DateTime>;
    customTitle?: Nullable<string>;
    userPermissions?: Nullable<ChatPermissions>;
    adminPermissions?: Nullable<AdminPermissions>;
    isAdmin?: Nullable<boolean>;
    isOwner?: Nullable<boolean>;
}

export class ChatFull {
    members: ChatMember[];
    onlineCount?: Nullable<number>;
    description?: Nullable<string>;
    areMembersHidden?: Nullable<boolean>;
    historyForNewMembers?: Nullable<boolean>;
    permissions?: Nullable<ChatPermissions>;
    currentUserPermissions?: Nullable<ChatPermissions>;
    currentAdminPermissions?: Nullable<AdminPermissions>;
}

export class ChatPermissions {
    canSendMessages?: Nullable<boolean>;
    canSendMedia?: Nullable<boolean>;
    canInviteUsers?: Nullable<boolean>;
    canPinMessages?: Nullable<boolean>;
    canChangeInfo?: Nullable<boolean>;
}

export class AdminPermissions {
    canChangeInfo?: Nullable<boolean>;
    canDeleteMessages?: Nullable<boolean>;
    canBanUsers?: Nullable<boolean>;
    canInviteUsers?: Nullable<boolean>;
    canPinMessages?: Nullable<boolean>;
    canAddNewAdmins?: Nullable<boolean>;
}

export class ChatCreatedUpdate {
    chat: Chat;
    users: User[];
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

export class Photo {
    id: string;
    date: DateTime;
    blurHash: string;
    url: string;
    width?: Nullable<number>;
    height?: Nullable<number>;
    withSpoiler?: Nullable<boolean>;
}

export class Document {
    id: string;
    date: DateTime;
    size?: Nullable<number>;
    fileName: string;
    blurHash?: Nullable<string>;
    url: string;
    mimeType?: Nullable<string>;
    isMedia?: Nullable<boolean>;
}

export class UpdateDraftPayload {
    chatId: string;
    ownerId: string;
    text?: Nullable<string>;
}

export class DeleteMessagesPayload {
    ids: string[];
    chat: Chat;
}

export class ReadHistoryInboxPayload {
    chatId: string;
    maxId: number;
    newUnreadCount: number;
}

export class ReadHistoryOutboxPayload {
    chatId: string;
    maxId: number;
}

export class ReadHistoryPayload {
    newUnreadCount: number;
}

export class NewMessagePayload {
    chat: Chat;
    message: Message;
}

export class EditMessagePayload {
    message: Message;
}

export class Message {
    id: string;
    orderedId: number;
    senderId?: Nullable<string>;
    chatId: string;
    _chatId?: Nullable<string>;
    text?: Nullable<string>;
    createdAt: DateTime;
    updatedAt?: Nullable<DateTime>;
    editedAt?: Nullable<DateTime>;
    isPost?: Nullable<boolean>;
    isOutgoing: boolean;
    postAuthor?: Nullable<string>;
    views?: Nullable<number>;
    action?: Nullable<MessageAction>;
    content: MessageContent;
}

export class MessageContent {
    action?: Nullable<MessageAction>;
    formattedText?: Nullable<MessageFormattedText>;
    photos?: Nullable<Photo[]>;
    documents?: Nullable<Document[]>;
    contacts?: Nullable<Contact[]>;
}

export class Contact {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    userId: string;
}

export class MessageEntity {
    start: number;
    end: number;
    type: MessageEntityType;
}

export class MessageFormattedText {
    text?: Nullable<string>;
    entities?: Nullable<MessageEntity[]>;
}

export class MessageAction {
    text: string;
    type: MessageActionType;
    users: string[];
    photo?: Nullable<Photo>;
    values?: Nullable<string[]>;
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
    isCurrent?: Nullable<boolean>;
}

export class User {
    id: string;
    firstName: string;
    phoneNumber: string;
    lastName?: Nullable<string>;
    username?: Nullable<string>;
    bio?: Nullable<string>;
    isSelf: boolean;
    isContact: boolean;
    isMutualContact: boolean;
    isBlocked?: Nullable<boolean>;
    color: ColorVariants;
    status: UserStatus;
    photo?: Nullable<Photo>;
}

export class UserStatus {
    wasOnline?: Nullable<number>;
    type: string;
}

export class UserFull {
    photos?: Nullable<Nullable<Photo>[]>;
    bio?: Nullable<string>;
}

export type Any = any;
export type JSON = any;
export type UUID = any;
export type DateTime = any;
export type Upload = any;
export type Peer = Chat | User;
type Nullable<T> = T | null;
