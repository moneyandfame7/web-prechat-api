import { Injectable } from '@nestjs/common'
import type { FileUpload } from 'graphql-upload'
import { isUUID } from 'class-validator'
import * as mime from 'mime-types'

import type * as Api from '@generated/graphql'

import type { PrismaMessage, SendMediaItem } from 'interfaces/messages'
import type { Nullable } from 'interfaces/helpers'
import type { PrismaChat } from 'interfaces/chats'

import { FirebaseService } from 'common/Firebase'
import { BlurhashService } from 'common/Blurhash'
import { InvalidFileIdError } from 'common/errors'

import { MediaRepository } from './Repository'

@Injectable()
export class MediaService {
  public constructor(
    private firebase: FirebaseService,
    private repo: MediaRepository,
    private blurhash: BlurhashService,
  ) {}

  /**
   * @todo винести в account??
   */
  public async uploadProfilePhoto(requesterId: string, file: Promise<FileUpload>): Promise<Api.Photo> {
    const awaitedFile = await file

    const { blurHash, metadata } = await this.blurhash.encode(awaitedFile)
    const mimeType = mime.lookup(awaitedFile.filename) as string
    const url = await this.firebase.upload({
      folder: 'avatar',
      contentType: mimeType,
      file: awaitedFile,
      id: requesterId,
      shouldResize: true,
    })

    return this.repo.createAvatar(requesterId, { blurHash, width: metadata.width, height: metadata.height, url })
  }

  // todo in database store file name ))))
  public async uploadMany(
    messageId: string,
    fileUploads: Promise<FileUpload>[],
    fileOptions?: Record<string, SendMediaItem>,
    sendMediaAsDocument?: Nullable<boolean>,
  ): Promise<{ message: PrismaMessage; chat: PrismaChat }> {
    const promises = fileUploads.map(async (file) => {
      const awaitedFile = await file
      // const test = await this.encodeBlurhash(file)

      const id = awaitedFile.filename?.split('_').shift()
      const isValidId = isUUID(id)
      if (!isValidId || !id) {
        throw new InvalidFileIdError('messages.sendMessage')
      }

      const fileOption = fileOptions?.[id]
      const mimeType = mime.lookup(awaitedFile.filename) as string
      const isImage = mimeType ? mimeType.includes('image') : false

      const isDocument = !isImage || sendMediaAsDocument
      const nativeFileName = awaitedFile.filename?.split(`${id}_`)[1]
      const url = await this.firebase.upload({
        file: awaitedFile,
        contentType: mimeType,
        id,
        folder: isDocument ? 'document' : 'photo',
        shouldResize: !isDocument,
      })
      const fileSize = await this.getFileSize(awaitedFile)
      if (isImage) {
        const { blurHash, metadata } = await this.blurhash.encode(awaitedFile)

        const input = {
          messageId,
          blurHash,
          url,
          id,
        }

        if (isDocument) {
          return this.repo.createDocument({
            ...input,
            fileName: nativeFileName,
            mimeType: mimeType,
            size: fileSize,
            isMedia: true,
          })
        }

        return this.repo.createPhoto({
          ...input,
          withSpoiler: fileOption?.withSpoiler,
          height: metadata.height,
          width: metadata.width,
        })
      }

      return this.repo.createDocument({
        id,
        url,
        messageId,
        mimeType: mimeType,
        size: fileSize,

        fileName: nativeFileName,
      })
    })

    const result = await Promise.all(promises)
    // піздець ну і хуйня, але має працювати???
    const message = result[result.length - 1].message!
    const chat = message.chat!

    return { message, chat }
  }

  /** returns file size in bytes */
  private async getFileSize(file: FileUpload): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      const readStream = file.createReadStream()
      let fileSize = 0

      readStream.on('data', (chunk) => {
        fileSize += chunk.length
      })

      readStream.on('end', () => {
        resolve(fileSize)
      })

      readStream.on('error', (error) => {
        /* Ignore error... */
        console.log({ error })
        // reject(error)
      })
    })
  }
  private getFileExtension(fileName: string) {
    return fileName.substring(fileName.lastIndexOf('.') + 1)
  }
  // private getFileExtension(file:FileUpload):Promise<number> {

  // }
}
