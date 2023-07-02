import { Injectable } from '@nestjs/common'
import { FirebaseService } from 'firebase/firebase.service'
import { FileUpload } from 'graphql-upload'

@Injectable()
export class MediaService {
  public constructor(private firebaseService: FirebaseService) {}

  public async uploadPhoto(photo: FileUpload, src: string) {
    const initialName = photo.filename
    /* blurhash */
    return this.firebaseService.uploadFile(photo, initialName, src)
  }
}
