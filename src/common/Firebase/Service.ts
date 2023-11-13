import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { v4 as uuid } from 'uuid'
import * as sharp from 'sharp'
import { initializeApp, cert, type App, type ServiceAccount } from 'firebase-admin/app'
import { getStorage } from 'firebase-admin/storage'
import { type Auth, getAuth } from 'firebase-admin/auth'

import type { AppEnvironmentConfig } from 'interfaces/app'
import type { FirebaseUploadOptions } from './Types'

@Injectable()
export class FirebaseService {
  private readonly app: App
  private readonly auth: Auth
  constructor(private config: ConfigService<AppEnvironmentConfig>) {
    this.app = this.initialize()
    this.auth = getAuth(this.app)
  }

  private initialize(): App {
    const creds = this.config.getOrThrow('FIREBASE_CREDENTIALS')
    const config = JSON.parse(creds)

    return initializeApp({
      credential: cert(config as ServiceAccount),
      databaseURL: this.config.getOrThrow('FIREBASE_DB_URL'),
      storageBucket: this.config.getOrThrow('FIREBASE_STORAGE_BUCKET'),
    })
  }

  public async upload(options: FirebaseUploadOptions) {
    const { file, fileName, folder, contentType } = options
    const fullFileName = `${folder}/${fileName}`

    const stream = file.createReadStream()

    const storageRef = getStorage(this.app).bucket().file(fullFileName)

    const storageUrl = this.config.getOrThrow('FIREBASE_STORAGE_URL')
    const storageFilePath = encodeURIComponent(fullFileName)
    const storageFileUrl = `${storageUrl}/${storageFilePath}?alt=media`

    const writeStream = storageRef.createWriteStream({
      metadata: {
        contentType,

        firebaseStorageDownloadTokens: uuid(),
      },
    })
    const sharpPipeline = sharp()
      .resize({
        fit: 'contain',
        width: 800,
        height: 600,
      })
      .jpeg({ quality: 70, force: false })
      .png({ quality: 70, force: false })
      .webp({ quality: 70, force: false })

    // const sharpPipeline = sharp().png
    return new Promise<string>((resolve, reject) => {
      writeStream.on('finish', async () => {
        resolve(storageFileUrl)
      })

      writeStream.on('error', (error) => {
        reject(error)
      })

      stream.pipe(sharpPipeline).pipe(writeStream)
    })
  }

  // public async remove(options: FirebaseDeleteOptions) {
  //   const { fileName, folder } = options
  //   const storageFilePath = `${folder}/${fileName}`

  //   const fileRef = getStorage(this.app).bucket().file(storageFilePath)

  //   return fileRef.delete()
  // }

  public verifyToken(token: string) {
    return this.auth.verifyIdToken(token)
  }
}
