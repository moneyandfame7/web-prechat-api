import { BaseApiError, ErrorCode } from './base'

export class InvalidFolderId extends BaseApiError {
  public constructor(method: string) {
    super(ErrorCode.FOLDER_ID_INVALID, 'The specified folder ID is invalid.', method)
  }
}
