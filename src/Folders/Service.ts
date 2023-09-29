import { Injectable } from '@nestjs/common'
import { FoldersRepository } from './Repository'
import type * as Api from '@generated/graphql'
import { BuilderService } from 'common/builder/Service'

@Injectable()
export class FoldersService {
  public constructor(private repo: FoldersRepository, private builder: BuilderService) {}

  public async reorderFolders(requesterId: string, order: number[]) {
    throw new Error('Not implemented yet')
  }

  public async addFolder(requesterId: string, input: Api.AddChatFolderInput) {
    const folder = await this.repo.add(requesterId, input)

    return this.builder.buildApiChatFolder(requesterId, folder)
  }

  public async deleteFolder(requesterId: string, folderId: number) {
    return this.repo.delete(requesterId, folderId)
  }

  public async getAll(requesterId: string): Promise<Api.GetChatFoldersRes> {
    const { foldersNotBuilded, orderedIds } = await this.repo.getAll(requesterId)

    const folders = foldersNotBuilded.map((f) => this.builder.buildApiChatFolder(requesterId, f))

    return { folders, orderedIds }
  }

  public async createDefaultFolders(requesterId: string) {
    await this.repo.createDefaultFolder(requesterId)
  }
}
