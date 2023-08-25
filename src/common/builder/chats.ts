import type { Chat, ChatFullInfo, ChatMember, Prisma } from '@prisma/client'
import type * as Api from '@generated/graphql'
import { isSelf } from './users'

/* check if type of chat is private */
export function buildApiChatSettings(members: Api.User[]): Api.ChatSettings {
  return {
    canAddContact: members.length === 1 && !members[0].isContact,
    canBlockContact: true,
    canReportSpam: true,
    canShareContact: /* members.length===1&&members[0]. */ true /* check in privacy?? */,
  }
}
export function buildApiChatFull(requesterId: string) {
  return {
    members: [],
    onlineCount: 0,
    description: '',
    areMembersHidden: false,
    // permissions
    // kickedMembers
    // inviteLink: '',
  }
}
export function buildeApiChatMember() {
  return {
    // userId,
    // inviterId?
    // promotedByUserId?,
    // kickedByUserId?,
    // adminRights?
    // customTitle?
    // isAdmin?
    // isOwner?
    // currentUserPermissions?
  }
}

// export function buildApiCreateChat(requesterId: string, input: Api.CreateChannelInput) {
//   const { title, description, users } = input
//   const members: Prisma.ChatMemberCreateNestedManyWithoutChatInfoInput = {
//     createMany: users
//       ? {
//           data: users.map((u) => ({
//             unreadCount: isSelf(requesterId, u) ? 0 : 1,
//             isOwner: isSelf(requesterId, u),
//             isAdmin: isSelf(requesterId, u),
//             inviterId: requesterId,
//             userId: u,
//           })),
//         }
//       : undefined,
//   }

//   const fullInfo = {
//     members,
//     description,
//   }

//   return { fullInfo, title, type: Api.ChatType.chatTypeChannel }
// }

export function buildApiChat(
  requesterId: string,
  chat: Chat & {
    fullInfo:
      | (ChatFullInfo & {
          members: ChatMember[]
        })
      | null
  },
): Api.Chat {
  return {
    id: chat.id,
    title: chat.title,
    isSupport: false,
    /* folderId */
    /* joinDate */
    type: chat.type as Api.ChatType,
    membersCount: chat.fullInfo?.members.length,
    isForbidden: false,
    isNotJoined: !chat.fullInfo?.members.some((m) => m.userId === requesterId),
    // isSupport: chat.,
    unreadCount: 0,
  }
  /*  */
}

export function computeChatMember(requesterId: string, members: ChatMember[]) {
  return members.find((m) => isSelf(requesterId, m.userId))
}
