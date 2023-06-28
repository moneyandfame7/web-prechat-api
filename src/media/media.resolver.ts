import { Resolver } from '@nestjs/graphql'
import { MediaService } from './media.service'

@Resolver('Media')
export class MediaResolver {
  constructor(private readonly mediaService: MediaService) {}
}
