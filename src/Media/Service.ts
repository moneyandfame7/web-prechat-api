import { Injectable } from '@nestjs/common'
import * as sharp from 'sharp'
import { encode } from 'blurhash'
import type { FileUpload } from 'graphql-upload'

import type * as Api from '@generated/graphql'
import { FirebaseService } from 'common/Firebase'

import { MediaRepository } from './Repository'

@Injectable()
export class MediaService {
  public constructor(private firebase: FirebaseService, private repo: MediaRepository) {}

  public async uploadProfilePhoto(requesterId: string, file: FileUpload): Promise<Api.Photo> {
    const initialName = file.filename

    const { blurHash, metadata } = await this.encodeBlurhash(file)
    const url = await this.firebase.uploadFile(file, initialName, `avatar/${requesterId}`)

    return this.repo.createPhoto(requesterId, { blurHash, width: metadata.width, height: metadata.height, url })
  }

  private async encodeBlurhash(file: FileUpload) {
    return new Promise<{ blurHash: string; metadata: sharp.Metadata }>((resolve, reject) => {
      const readStream = file.createReadStream()
      const chunks: Uint8Array[] = []
      let totalLength = 0
      readStream.on('data', (chunk: Uint8Array) => {
        chunks.push(chunk)
        // console.log('NEW DATA??')

        totalLength += chunk.length
      })

      readStream.on('end', async () => {
        const buffer = Buffer.concat(chunks, totalLength)

        const metadata = await sharp(buffer).metadata()

        const {
          info: { height, width },
          data,
        } = await sharp(buffer)
          .raw()
          .ensureAlpha()
          .resize(32, 32, { fit: 'inside' })
          .toBuffer({ resolveWithObject: true })

        const blurHash = encode(new Uint8ClampedArray(data), width, height, 4, 4)
        resolve({ blurHash, metadata })
      })

      readStream.on('error', (error) => {
        reject(error)
      })
    })
  }
}
