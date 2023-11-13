import type { FileUpload } from 'graphql-upload'
import type { Metadata } from 'sharp'

export type FirebaseFolders = 'avatar' | 'document' | 'photo'

export interface FirebaseUploadOptions {
  file: FileUpload
  metadata?: Metadata
  folder: FirebaseFolders
  fileName: string
  contentType: string
}

export interface FirebaseDeleteOptions {
  folder: FirebaseFolders
  fileName: string
}
