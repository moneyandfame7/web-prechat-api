import { BaseApiError, ErrorCode } from './base'

export class InvalidChatId extends BaseApiError {
  public constructor(method: string) {
    super(ErrorCode.CHAT_ID_INVALID, 'The provided chat id is invalid.', method)
  }
}

export class InvalidPeerId extends BaseApiError {
  public constructor(method: string) {
    super(ErrorCode.PEER_ID_INVALID, 'The provided peer id is invalid.', method)
  }
}
