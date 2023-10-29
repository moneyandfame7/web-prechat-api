import type * as Prisma from '@prisma/client'
import type * as Api from '@generated/graphql'

import { Injectable } from '@nestjs/common'

import { UsersBuilder } from './UsersBuilder'
import { ChatsBuilder } from './ChatsBuilder'
import { MessagesBuilder } from './MessagesBuilder'
/**
 * @todo - Add memory Caching
 * Devide on smaller classes
 */
@Injectable()
export class BuilderService {
  public constructor(public users: UsersBuilder, public chats: ChatsBuilder, public messages: MessagesBuilder) {}

  public buildSession(requesterSession: Api.Session, session: Prisma.Session): Api.Session {
    return {
      ...session,
      isCurrent: session.id === requesterSession.id,
    }
  }
}
