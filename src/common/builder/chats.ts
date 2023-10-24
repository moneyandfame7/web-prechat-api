import type { Chat, ChatFullInfo, ChatMember, ChatFolder, Prisma } from '@prisma/client'

import type { UserFieldsForBuild } from 'types/users'

import { isSelf, selectUserFields } from './users'
import { type PrismaPhoto, selectPhotoFields } from './photos'
import { type PrismaMessage, selectMessageFields } from './messages'

export type PrismaChatAdminPermissions = {
  canChangeInfo: boolean | null
  canDeleteMessages: boolean | null
  canBanUsers: boolean | null
  canInviteUsers: boolean | null
  canPinMessages: boolean | null
  canAddNewAdmins: boolean | null
  customTitle: string | null
}
export type PrismaChatPermissions = {
  canChangeInfo: boolean | null
  canInviteUsers: boolean | null
  canPinMessages: boolean | null
  canSendMedia: boolean | null
  canSendMessages: boolean | null
}
export type PrismaChatMember = ChatMember & {
  user: UserFieldsForBuild
  adminPermissions: PrismaChatAdminPermissions | null
  userPermissions: PrismaChatPermissions | null
  // lastMessage: PrismaMessage | null
}
export type PrismaChatFull = ChatFullInfo & {
  members: PrismaChatMember[]
}
export type PrismaChat = Chat & {
  photo: PrismaPhoto | null
  fullInfo: PrismaChatFull | null
  lastMessage: PrismaMessage | null
  permissions: PrismaChatPermissions | null
}

export type PrismaChatFolder = ChatFolder & {
  excludedChats: PrismaChat[]
  includedChats: PrismaChat[]
  pinnedChats: PrismaChat[]
}
/* check if type of chat is private */
// export function buildApiChatSettings(members: Api.User[]): Api.ChatSettings {
// return {
//   canAddContact: members.length === 1 && !members[0].isContact,
//   canBlockContact: true,
//   canReportSpam: true,
//   canShareContact: /* members.length===1&&members[0]. */ true /* check in privacy?? */,
// }
// }

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
            // adminPermissions: {},
            userPermissions: {
              select: {
                ...selectChatPermissions(),
              },
            },
            adminPermissions: {
              select: {
                canChangeInfo: true,
                canDeleteMessages: true,
                canBanUsers: true,
                canInviteUsers: true,
                canPinMessages: true,
                canAddNewAdmins: true,
                customTitle: true,
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
    permissions: {
      select: {
        ...selectChatPermissions(),
      },
    },
  } satisfies Prisma.ChatSelect
}
