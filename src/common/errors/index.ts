const API_ERRORS = {
  AUTH_VERIFY_CODE: 'Firebase code validation error',
  USER_NOT_FOUND: 'User not found',
  PHONE_NOT_FOUND: 'This phone number not registered',

  API_TOKEN_INVALID: 'Prechat api token is invalid',
  API_TOKEN_NOT_PROVIDED: 'Prechat api token not provided',
  API_ALREADY_HAS_TOKEN: 'This user already has api token, check your account',
}
export type ErrorCode = keyof typeof API_ERRORS

export class ApiError extends Error {
  public constructor(public readonly code: ErrorCode) {
    super(code)
  }
}

export class ApiErrorFormatted {
  public readonly message: string | null

  public constructor(public readonly code: ErrorCode) {
    this.message = this.getMessageByCode(this.code)
  }

  private getMessageByCode(code: ErrorCode) {
    if (code in API_ERRORS) {
      return API_ERRORS[code]
    }
    return null
  }
}
