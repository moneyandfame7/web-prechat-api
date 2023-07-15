import { Resolver } from '@nestjs/graphql'
import { MediaService } from './Service'

@Resolver('Media')
export class MediaResolver {
  constructor(private readonly mediaService: MediaService) {}
}
