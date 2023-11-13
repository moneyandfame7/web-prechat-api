import type { Prisma } from '@prisma/client'

import { isSelf, selectUserFields } from './Users'
import { selectPhotoFields } from './Diff'
import { selectMessageFields } from './Messages'

export function createChatMembers(requesterId: string, memberIds: string[]) {
  return {
    members: {
      create: memberIds.map((u) => ({
        unreadCount: isSelf(requesterId, u) ? 0 : 1,
        isOwner: isSelf(requesterId, u),
        isAdmin: isSelf(requesterId, u),
        inviterId: requesterId,
        userId: u,
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
                _count: true,
              },
            },
          } satisfies Prisma.ChatMemberSelect,
        },
        _count: {
          select: {
            members: true,
          },
        },
      } satisfies Prisma.ChatFullInfoSelect,
    },
  }
}

export function selectChatFields() {
  return {
    ...selectChatMembers(),
    photo: {
      select: {
        ...selectPhotoFields(),
      },
    },
    lastMessage: {
      include: {
        ...selectMessageFields(),
      },
    },
  } satisfies Prisma.ChatSelect
}
