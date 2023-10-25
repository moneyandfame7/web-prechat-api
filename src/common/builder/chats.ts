import type { Chat, ChatFullInfo, ChatMember, Prisma } from '@prisma/client'

import type { UserFieldsForBuild } from 'types/users'

import { isSelf, selectUserFields } from './users'
import { type PrismaPhoto, selectPhotoFields } from './photos'
import { type PrismaMessage, selectMessageFields } from './messages'

export type PrismaChatMember = ChatMember & {
  user: UserFieldsForBuild
}
export type PrismaChatFull = ChatFullInfo & {
  members: PrismaChatMember[]
}
export type PrismaChat = Chat & {
  photo: PrismaPhoto | null
  fullInfo: PrismaChatFull | null
  lastMessage: PrismaMessage | null
}

export function createChatMembers(requesterId: string, memberIds: string[]) {
  return {
    members: {
      create: memberIds.map((u) => ({
        // id: u,
        unreadCount: isSelf(requesterId, u) ? 0 : 1,
        isOwner: isSelf(requesterId, u),
        isAdmin: isSelf(requesterId, u),
        inviterId: requesterId,
        userId: u,

        // admin permissions created when i add new admins
        // adminPermissions:{
        //   create:{
        //     canAddNewAdmins:isSelf(requesterId,u),

        //   }
        // }
      })),
    } satisfies Prisma.ChatMemberCreateNestedManyWithoutChatInfoInput,
  }
}

export function selectChatPermissions() {
  return {
    canChangeInfo: true,
    canInviteUsers: true,
    canPinMessages: true,
    canSendMedia: true,
    canSendMessages: true,
  }
}

export function selectChatMembers() {
  return {
    fullInfo: {
      include: {
        members: {
          include: {
            user: {
              select: {
                ...selectUserFields(),
              },
            },
          } satisfies Prisma.ChatMemberSelect,
        },
      },
    },
  }
}

export function selectChatFields() {
  return {
    ...selectChatMembers(),
    photo: {
      ...selectPhotoFields(),
    },
    lastMessage: {
      include: {
        ...selectMessageFields(),
      },
    },
  } satisfies Prisma.ChatSelect
}
