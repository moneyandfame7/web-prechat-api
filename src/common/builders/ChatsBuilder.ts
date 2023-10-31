import { Injectable } from '@nestjs/common'
import type * as Api from '@generated/graphql'

import type { PrismaChat, PrismaChatMember } from '../../types/Chats'
import type { PrismaUser } from '../../types/Users'

import { UsersBuilder } from './UsersBuilder'
import { MessagesBuilder } from './MessagesBuilder'

@Injectable()
export class ChatsBuilder {
  public constructor(private users: UsersBuilder, private messages: MessagesBuilder) {}
  public build(requesterId: string, chat: PrismaChat): Api.Chat {
    const requesterMember = this.getChatMember(requesterId, chat)
    const privateChatUser = chat.type === 'chatTypePrivate' ? this.getPrivateUser(requesterId, chat) : undefined
    const privateChatMember = privateChatUser ? this.getChatMember(privateChatUser.id, chat) : undefined

    const chatId = privateChatUser?.id || chat.id
    const lastReadOutgoingMessageId =
      privateChatMember?.lastReadIncomingMessageId ?? this.getLastReadOutgoingMessageId(requesterId, chat)

    const title = privateChatUser
      ? privateChatUser.isSelf
        ? 'Saved Messages'
        : this.users.getUserName(privateChatUser)
      : chat.title

    return {
      id: chatId,
      photo: chat.photo as Api.Photo,
      userId: privateChatUser?.id,
      lastReadIncomingMessageId: requesterMember?.lastReadIncomingMessageId,
      lastReadOutgoingMessageId,
      color: privateChatUser?.color || (chat.color as Api.ColorVariants),
      type: chat.type as Api.ChatType,
      title,
      draft: requesterMember?.draft,
      createdAt: chat.createdAt,
      isNotJoined: !requesterMember,
      unreadCount: requesterMember?.unreadCount,
      lastMessage: chat.lastMessage ? this.messages.build(requesterId, chatId, chat.lastMessage) : undefined,
      membersCount: chat.fullInfo!._count.members,
      isSavedMessages: privateChatUser?.id === requesterId,
      inviteLink: chat.inviteLink,
      isOwner: Boolean(requesterMember?.isOwner),
      isPinned: Boolean(requesterMember?.isPinned),

      _id: chat.id,
    }
  }

  public buildMany(requesterId: string, chats: PrismaChat[]): Api.Chat[] {
    return chats.map((chat) => this.build(requesterId, chat))
  }

  public buildFull(requesterId: string, chat: PrismaChat) {
    const { fullInfo } = chat
    const { canViewMembers, description, members, historyForNewMembers } = fullInfo!

    return {
      members: members.map((m) => this.buildMember(requesterId, m)),
      historyForNewMembers,
      areMembersHidden: !canViewMembers,
      description,
      onlineCount: this.buildOnlineCount(requesterId, members),
    }
  }

  private buildMember(requesterId: string, member: PrismaChatMember) {
    // const adminPermissions = member.adminPermissions
    // const userPermissions = member.userPermissions
    // const { customTitle, ...adminPermissionFields } = adminPermissions ?? {}

    return {
      userId: member.userId,
      // adminPermissions: adminPermissionFields,
      // userPermissions: userPermissions,
      // customTitle: customTitle,
      inviterId: member.inviterId,
      kickedByUserId: member.kickedById,
      promotedByUserId: member.promotedById,
      isAdmin: member.isAdmin,
      isOwner: member.isOwner,
      joinedDate: member.joinedDate,
    }
  }
  private buildOnlineCount(requesterId: string, members: PrismaChatMember[]) {
    const users = members.filter((m) => m.userId !== requesterId).map((m) => this.users.buildStatus(m.user))

    return users.filter((u) => u.type === 'userStatusOnline').length
  }
  private getChatMember(requesterId: string, chat: PrismaChat): PrismaChatMember {
    return chat.fullInfo!.members.find((m) => m.userId === requesterId)!
  }
  private getPrivateUser(requesterId: string, chat: PrismaChat) {
    const members = chat.fullInfo?.members || []

    const notMe: PrismaUser | undefined = members.filter((m) => m.userId !== requesterId)[0]?.user
    const me = members.find((m) => m.userId === requesterId)?.user

    return this.users.build(requesterId, notMe || me)
  }
  private getLastReadOutgoingMessageId(requesterId: string, chat: PrismaChat) {
    const membersExceptMe = chat.fullInfo?.members.filter((member) => member.userId !== requesterId)
    const membersLastReadMessageId = membersExceptMe?.map((member) => member.lastReadIncomingMessageId)
    console.log({ membersLastReadMessageId })
    return Math.max(...(membersLastReadMessageId as number[]))
  }
}
