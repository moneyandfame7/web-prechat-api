import { UseGuards } from '@nestjs/common'
import { Args, Resolver } from '@nestjs/graphql'
import { AuthGuard } from 'Auth/Guard'
import { CurrentSession } from 'common/decorators/Session'
import { FoldersService } from './Service'
import { PubSub2Service } from 'common/pubsub2/Service'
import { MutationTyped, QueryTyped, SubscriptionTyped } from 'types/nestjs'
import { getSession } from 'common/helpers/getSession'

import * as Api from '@generated/graphql'
@Resolver()
export class FoldersResolver {
  public constructor(private folders: FoldersService, private pubSub: PubSub2Service) {}

  @QueryTyped('getChatFolders')
  @UseGuards(AuthGuard)
  public async getChatFolders(@CurrentSession('userId') requesterId: string): Promise<Api.GetChatFoldersRes> {
    return this.folders.getAll(requesterId)
  }

  @MutationTyped('deleteChatFolder')
  @UseGuards(AuthGuard)
  public async deleteFolder(@CurrentSession('userId') requesterId: string, @Args('folderId') folderId: number) {
    await this.folders.deleteFolder(requesterId, folderId)

    this.pubSub.publish('onChatFolderUpdate', {
      onChatFolderUpdate: {
        orderId: folderId,
        ownerId: requesterId,
        folder: undefined,
      },
    })
  }

  @MutationTyped('addChatFolder')
  @UseGuards(AuthGuard)
  public async addFolder(@CurrentSession('userId') requesterId: string, @Args('input') input: Api.AddChatFolderInput) {
    const folder = await this.folders.addFolder(requesterId, input)

    this.pubSub.publish('onChatFolderUpdate', {
      onChatFolderUpdate: {
        orderId: folder.orderId,
        ownerId: requesterId,
        folder,
      },
    })

    return Boolean(folder)
  }

  @UseGuards(AuthGuard)
  @SubscriptionTyped('onChatFolderUpdate', {
    filter(payload, _, context) {
      const session = getSession(context.req)

      return session.userId === payload.onChatFolderUpdate.ownerId
    },
  })
  public async onChatFolderUpdate() {
    return this.pubSub.subscribe('onChatFolderUpdate')
  }
}
