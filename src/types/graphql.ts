
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class Connection {
    ipVersion: number;
    ipAddress: string;
    latitude: number;
    longitude: number;
    countryName: string;
    countryCode: string;
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
    token: string;
    lastName?: Nullable<string>;
}

export class SignInInput {
    token: string;
    connection: Connection;
    userId: string;
}

export class CreateUserInput {
    username: string;
    firstName: string;
    lastName?: Nullable<string>;
    phoneNumber: string;
}

export class Country {
    name: string;
    dial_code: string;
    emoji: string;
    code: string;
}

export class LanguageResponse {
    countries: Country[];
    pack?: Nullable<JSON>;
}

export abstract class IQuery {
    abstract ping(): string | Promise<string>;

    abstract test(): Nullable<Any> | Promise<Nullable<Any>>;

    abstract generateApiKey(): string | Promise<string>;

    abstract language(language: string): LanguageResponse | Promise<LanguageResponse>;

    abstract languageString(language: string, string: string): string | Promise<string>;

    abstract sendCode(phone: string): Nullable<Any> | Promise<Nullable<Any>>;

    abstract getTwoFa(token: string): Nullable<TwoFactorAuth> | Promise<Nullable<TwoFactorAuth>>;

    abstract translateHello(): Nullable<Any> | Promise<Nullable<Any>>;

    abstract translateCountries(lng: string, outputFile: string): boolean | Promise<boolean>;
}

export abstract class ISubscription {
    abstract testS(): Nullable<Any> | Promise<Nullable<Any>>;
}

export class TwoFactorAuth {
    hint?: Nullable<string>;
    email: string;
}

export class SendPhoneResponse {
    userId?: Nullable<string>;
}

export class SignUpResponse {
    session: string;
}

export class SignInResponse {
    session: string;
}

export abstract class IMutation {
    abstract sendPhone(phone: string): SendPhoneResponse | Promise<SendPhoneResponse>;

    abstract signUp(input: SignUpInput, photo?: Nullable<Upload>): SignUpResponse | Promise<SignUpResponse>;

    abstract signIn(input: SignInInput): SignInResponse | Promise<SignInResponse>;

    abstract createUser(createUserInput: CreateUserInput, avatar: Upload): string | Promise<string>;
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
    phoneNumber: string;
    username: string;
    photo: string;
    createdAt?: Nullable<DateTime>;
}

export type Any = any;
export type JSON = any;
export type DateTime = any;
export type Upload = any;
type Nullable<T> = T | null;
