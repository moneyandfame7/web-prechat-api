import { Injectable } from '@nestjs/common'

import type { SearchGlobalInput, SearchGlobalResponse, SearchUsersResponse } from '@generated/graphql'

import { SearchRepository } from './Repository'

@Injectable()
export class SearchService {
  constructor(private repository: SearchRepository) {}

  public async searchGlobal(requesterId: string, input: SearchGlobalInput): Promise<SearchGlobalResponse> {
    return {
      knownChats: await this.repository.searchKnownChats(requesterId, input),
      knownUsers: await this.repository.searchKnownUsers(requesterId, input),
      globalChats: await this.repository.searchGlobalChats(input),
      globalUsers: await this.repository.searchGlobalUsers(requesterId, input),
    }
    // або зробити по фільтрам?????
    // switch (input.filter) {
    //   case SearchFilter.CHANNELS:
    //     /* return this.chats.search('') */
    //     return {
    //       channels: [],
    //     }
    //   case SearchFilter.GROUPS:
    //     return {
    //       groups: [],
    //     }
    //   case SearchFilter.CONTACTS:
    //     // return this.repository.search(requesterId, input)
    //     return {
    //       contacts: [],
    //     }
    //   /*  */
    //   case SearchFilter.USERS:
    //     // return this.users.search(input)
    //     return {
    //       users: [],
    //     }
    //   default:
    //     return {
    //       users: [],
    //       channels: [],
    //       contacts: [],
    //       groups: [],
    //     }
    // }
  }

  public async searchUsers(requesterId: string, input: SearchGlobalInput): Promise<SearchUsersResponse> {
    return {
      globalUsers: await this.repository.searchGlobalUsers(requesterId, input),
      knownUsers: await this.repository.searchKnownUsers(requesterId, input),
    }
  }
}
