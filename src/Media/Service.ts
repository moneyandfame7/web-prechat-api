import { Injectable } from '@nestjs/common'
import type { FileUpload } from 'graphql-upload'

import { FirebaseService } from 'common/Firebase'

@Injectable()
export class MediaService {
  public constructor(private firebase: FirebaseService) {}

  public async uploadPhoto(photo: FileUpload, src: string) {
    const initialName = photo.filename
    /* blurhash */
    return this.firebase.uploadFile(photo, initialName, src)
  }
}
