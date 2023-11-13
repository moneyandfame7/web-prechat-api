import { Injectable } from '@nestjs/common'

import type { FileUpload } from 'graphql-upload'
import * as sharp from 'sharp'
import { encode as blurhashEncode } from 'blurhash'

@Injectable()
export class BlurhashService {
  public async encode(file: FileUpload) {
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

        const blurHash = blurhashEncode(new Uint8ClampedArray(data), width, height, 4, 4)
        resolve({ blurHash, metadata })
      })

      readStream.on('error', (error) => {
        reject(error)
      })
    })
  }
}
