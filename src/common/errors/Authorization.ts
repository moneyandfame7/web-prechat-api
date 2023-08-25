import { BaseApiError, ErrorCode } from './base'

/**
 * If not provided session ID.
 */
export class UnauthorizedError extends BaseApiError {
  public constructor(method: string) {
    super(
      ErrorCode.UNAUTHORIZED,
      'Your request cannot be processed due to lack of authorization. Please log in to gain access.',
      method,
    )
  }
}

/**
 * If a session is created earlier than 24 hours in advance, some operations may be forbidden.
 */
export class SessionTooFreshError extends BaseApiError {
  public constructor(method: string) {
    super(
      ErrorCode.AUTH_SESSION_TOO_FRESH,
      'The operation could not be performed because the session is less than a day old. Sessions must be at least 24 hours old to be safe.',
      method,
    )
  }
}

export class SessionExpired extends BaseApiError {
  public constructor(method: string) {
    super(
      ErrorCode.AUTH_SESSION_EXPIRED,
      'Your session is no longer valid because it has expired. Please sign in to resume your session.',
      method,
    )
  }
}

export class SessionInvalidError extends BaseApiError {
  public constructor(method: string) {
    super(
      ErrorCode.AUTH_SESSION_INVALID,
      'The system could not authorize you with the session provided. It may be damaged or outdated.',
      method,
    )
  }
}

export class AuthVerifyCodeError extends BaseApiError {
  public constructor(method: string) {
    super(ErrorCode.AUTH_VERIFY_CODE, 'Firebase code validation error.', method)
  }
}

export class SessionPasswordNeeded extends BaseApiError {
  public constructor(method: string) {
    super(ErrorCode.AUTH_SESSION_PASSWORD_NEEDED, 'The password needed.', method)
  }
}
