import { BaseApiError, ErrorCode } from './base'

export class ApiTokenInvalidError extends BaseApiError {
  public constructor(method: string) {
    super(ErrorCode.API_TOKEN_INVALID, 'The Prechat api token is invalid.', method)
  }
}

export class ApiTokenAlreadyExistError extends BaseApiError {
  public constructor(method: string) {
    super(
      ErrorCode.API_TOKEN_ALREADY_EXIST,
      'A token has already been generated for this phone number. Check your account.',
      method,
    )
  }
}

export class ApiTokenNotProvidedError extends BaseApiError {
  public constructor(method: string) {
    super(ErrorCode.API_TOKEN_NOT_PROVIDED, 'The Prechat api token not provided.', method)
  }
}

export class PhoneNumberNotFoundError extends BaseApiError {
  public constructor(method: string) {
    super(ErrorCode.PHONE_NUMBER_NOT_FOUND, 'Phone number not registered.', method)
  }
}

export class PhoneNumberInvalidError extends BaseApiError {
  public constructor(method: string) {
    super(
      ErrorCode.PHONE_NUMBER_INVALID,
      'The phone number provided is not valid. Please verify the number and try again.',
      method,
    )
  }
}

export class PhoneNumberRegisteredError extends BaseApiError {
  public constructor(method: string) {
    super(
      ErrorCode.PHONE_NUMBER_REGISTERED,
      'The phone number is already registered. Please try another number.',
      method,
    )
  }
}

export class QueryEmptyError extends BaseApiError {
  public constructor(method: string) {
    super(ErrorCode.QUERY_IS_EMPTY, 'The search query is empty.', method)
  }
}

export class InvalidEntityIdError extends BaseApiError {
  public constructor(method: string) {
    super(ErrorCode.INVALID_ID, 'The provided entity ID is invalid.', method)
  }
}

export class InvalidMessageIdError extends BaseApiError {
  public constructor(method: string) {
    super(ErrorCode.INVALID_ID, 'The provided message ID is invalid.', method)
  }
}

export class ForbiddenError extends BaseApiError {
  public constructor(method?: string) {
    super(ErrorCode.FORBIDDEN, "you don't have permission to access", method)
  }
}

export class NotFoundEntityError extends BaseApiError {
  public constructor(method: string) {
    super(ErrorCode.NOT_FOUND_ENTITY, 'The entity not found with provided data.', method)
  }
}

export class BadRequestError extends BaseApiError {
  public constructor(method: string, message?: string) {
    super(ErrorCode.BAD_REQUEST, message || 'Bad Request Exception.', method)
  }
}

export class ContactAlreadyExistError extends BaseApiError {
  public constructor(method: string) {
    super(ErrorCode.CONTACT_EXIST, 'The contact already created.', method)
  }
}

export class ContactNameEmpty extends BaseApiError {
  public constructor(method: string) {
    super(ErrorCode.CONTACT_NAME_EMPTY, 'Contact name empty.', method)
  }
}

export class UsernameInvalidError extends BaseApiError {
  public constructor(method: string) {
    super(ErrorCode.USERNAME_INVALID, 'The provided usernams is invalid.', method)
  }
}

export class UsernameNotOccupiedError extends BaseApiError {
  public constructor(method: string) {
    super(ErrorCode.USERNAME_NOT_OCCUPIED, "The provided usernams doesn't exist.", method)
  }
}
