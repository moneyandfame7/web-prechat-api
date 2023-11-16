import type { FileUpload } from 'graphql-upload'
import type * as Sharp from 'sharp'

export type FirebaseFolders = 'avatar' | 'document' | 'photo'

export interface FirebaseUploadOptions {
  file: FileUpload
  metadata?: Sharp.Metadata
  folder: FirebaseFolders
  fileName: string
  contentType: string
  shouldResize: boolean
}

export interface FirebaseDeleteOptions {
  folder: FirebaseFolders
  fileName: string
}
