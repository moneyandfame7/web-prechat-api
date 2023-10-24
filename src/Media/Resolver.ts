import { Args, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { FileUpload } from 'graphql-upload'

import type * as Api from '@generated/graphql'

import { AuthGuard } from 'Auth/Guard'
import { MutationTyped } from 'types/nestjs'
import { CurrentSession } from 'common/decorators/Session'

import { MediaService } from './Service'

@Resolver('Media')
export class MediaResolver {
  constructor(private readonly media: MediaService) {}

  @UseGuards(AuthGuard)
  @MutationTyped('uploadProfilePhoto')
  public async uploadProfilePhoto(
    @CurrentSession('userId') requesterId: string,
    @Args('file') file: FileUpload,
  ): Promise<Api.Photo> {
    return this.media.uploadProfilePhoto(requesterId, file)
  }
}
