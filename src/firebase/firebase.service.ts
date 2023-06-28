import { Injectable } from '@nestjs/common'
import * as firebase from 'firebase-admin'
import { App } from 'firebase-admin/app'
import { FileUpload } from './firebase.types'
import firebaseConfig from 'common/constants/firebase'
import { v4 as uuid } from 'uuid'
import * as mime from 'mime-types'
import type { Auth } from 'firebase-admin/auth'
@Injectable()
export class FirebaseService {
  public readonly app: App
  public readonly auth: Auth
  constructor() {
    this.app = firebase.initializeApp({
      credential: firebase.credential.cert(firebaseConfig as firebase.ServiceAccount),
      databaseURL: 'https://nestjs-chat-a42f4-default-rtdb.europe-west1.firebasedatabase.app',
      storageBucket: 'gs://nestjs-chat-a42f4.appspot.com/',
    })
    this.auth = firebase.auth(this.app)
  }

  public async uploadFile(file: FileUpload, initialName: string, fileName: string) {
    console.log({ file })
    const stream = file.createReadStream()
    const storageRef = firebase.storage().bucket().file(fileName)
    console.log({ storageRef })
    const firebaseStorageUrl = `https://firebasestorage.googleapis.com/v0/b/nestjs-chat-a42f4.appspot.com/o/${encodeURIComponent(
      fileName,
    )}?alt=media`

    const writeStream = storageRef.createWriteStream({
      metadata: {
        contentType: mime.lookup(initialName),
        firebaseStorageDownloadTokens: uuid(),
      },
    })
    return new Promise<string>((resolve, reject) => {
      writeStream.on('finish', async () => {
        resolve(firebaseStorageUrl)
      })

      writeStream.on('error', (error) => {
        reject(error)
      })

      stream.pipe(writeStream)
    })
  }

  private concatExtension(filename: string, str: string) {
    // Get the file extension by splitting the filename string at the last period and getting the last element of the resulting array
    const extension = filename.split('.').pop()
    // Concatenate the specified string with the file extension and return the result
    return `${str}.${extension}`
  }
}
