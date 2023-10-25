import type * as Prisma from '@prisma/client'
import type * as Api from '@generated/graphql'

import { Injectable } from '@nestjs/common'

import type { UserFieldsForBuild, UserStatus } from 'types/users'

import { pick } from 'common/utils/pick'

import { getContact } from './users'
import type { PrismaChat, PrismaChatMember } from './chats'
import type { PhotoFields } from './photos'
import type { PrismaMessage } from './messages'

/**
 * @todo - Add memory Caching
 * Devide on smaller classes
 */
@Injectable()
export class BuilderService {
  // public constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  /* USERS, можливо потім розділити по меншим класам. */
  public buildApiUsersAndStatuses(users: UserFieldsForBuild[], requesterId: string): Api.User[] {
    return users.map((u) => this.buildApiUserAndStatus(u, requesterId))
  }
  public buildApiUser(user: UserFieldsForBuild, requesterId: string) {
    const contactAddedByCurrent = getContact(user.addedByContacts, requesterId)

    const isCurrentUserInContact = user.addedByContacts.some((c) => c.ownerId === requesterId)

    const isCurrentUserAddedToContact = user.contacts.some((c) => c.contactId === requesterId)

    const primaryFields = pick(user, ['id', 'color', 'photo', 'username', 'phoneNumber', 'bio'])

    // const isBlocked = user.blockedByUsers.some((u) => u.blockerId === requesterId)
    return {
      ...primaryFields,
      firstName: contactAddedByCurrent?.firstName || user.firstName,
      lastName: contactAddedByCurrent?.lastName || user.lastName,
      isSelf: user.id === requesterId,
      isContact: isCurrentUserInContact,
      isMutualContact: isCurrentUserInContact && isCurrentUserAddedToContact,
      // isBlocked,
      photo: this.buildApiPhoto(user.photo),
    } as Omit<Api.User, 'status'>
  }
  public buildApiUserAndStatus(user: UserFieldsForBuild, requesterId: string) {
    const baseFields = this.buildApiUser(user, requesterId)
    return {
      ...baseFields,
      status: this.buildApiUserStatus(user),
    } as Api.User
  }

  private getUserName(user: Prisma.User | Api.User | Omit<Api.User, 'status'>) {
    return user.firstName ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ''}` : user.lastName || ''
  }

  public buildApiUserStatus(user: Prisma.User): UserStatus {
    const lastActiveDate = user.lastActivity
    if (!lastActiveDate) {
      return { type: 'userStatusRecently' }
    }
    const currentDate = new Date()
    const oneWeekAgo = new Date(currentDate.setDate(currentDate.getDate() - 7))
    const oneMonthAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 1))

    // Цього тижня
    if (lastActiveDate > oneWeekAgo) {
      return { type: 'userStatusOffline', wasOnline: lastActiveDate.getTime() }
    }

    // Минулого тижня
    if (lastActiveDate > oneMonthAgo) {
      return { type: 'userStatusLastWeek' }
    }

    // Минулого місяця
    if (lastActiveDate > new Date(currentDate.setFullYear(currentDate.getFullYear() - 1))) {
      return { type: 'userStatusLastMonth' }
    }

    // Дуже давно
    return { type: 'userStatusLongTimeAgo' }
  }

  public buildApiChat(chat: PrismaChat, requesterId: string): Api.Chat {
    const requesterMember = this.selectChatMember(chat, requesterId)
    const privateChatPartner =
      chat.type === 'chatTypePrivate' ? this.selectPrivateChatMember(chat, requesterId) : undefined
    const chatId = privateChatPartner?.id || chat.id

    const title = privateChatPartner
      ? privateChatPartner.isSelf
        ? 'Saved Messages'
        : this.getUserName(privateChatPartner)
      : chat.title
    return {
      id: chatId,
      userId: privateChatPartner?.id,
      color: privateChatPartner?.color || (chat.color as Api.ColorVariants),
      type: chat.type as Api.ChatType,
      title,
      draft: requesterMember?.draft,
      createdAt: chat.createdAt,
      isNotJoined: !requesterMember,
      unreadCount: requesterMember?.unreadCount,
      lastMessage: chat.lastMessage ? this.buildApiMessage(chat.lastMessage, requesterId, chatId) : undefined,
      membersCount: chat.fullInfo!.members.length,
      isSavedMessages: privateChatPartner?.id === requesterId,
      inviteLink: chat.inviteLink,
      photo: this.buildApiPhoto(chat.photo),
      isOwner: Boolean(requesterMember?.isOwner),
      isPinned: Boolean(requesterMember?.isPinned),
      _id: chat.id,
    }
  }

  public buildApiChatId(chat: PrismaChat, requesterId: string): string {
    const privateChatPartner =
      chat.type === 'chatTypePrivate' ? this.selectPrivateChatMember(chat, requesterId) : undefined
    return privateChatPartner?.id || chat.id
  }
  public async buildApiChatFull(chat: PrismaChat, requesterId: string): Promise<Api.ChatFull> {
    const { fullInfo /* permissions */ } = chat
    const { canViewMembers, description, members, historyForNewMembers } = fullInfo!

    // const requesterMember = this.selectChatMember(chat, requesterId)

    return {
      members: members.map((m) => this.buildApiChatMember(m)),
      historyForNewMembers,
      areMembersHidden: !canViewMembers,
      description,
      onlineCount: await this.buildOnlineCount(members),
      // permissions,
      // currentUserPermissions: requesterMember?.userPermissions,
      // currentAdminPermissions: requesterMember?.adminPermissions,
    }
  }
  public buildApiChatMember(member: PrismaChatMember): Api.ChatMember {
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

  /* helpers */
  private async buildOnlineCount(members: PrismaChatMember[]) {
    return (
      await Promise.all(members.map(async (m) => this.buildApiUserStatus(m.user).type === 'userStatusOnline'))
    ).filter(Boolean).length
  }

  private selectChatMember(chat: PrismaChat, userId: string) {
    return chat.fullInfo?.members.find((m) => m.userId === userId)
  }
  private selectPrivateChatMember(chat: PrismaChat, requesterId: string) {
    const members = chat.fullInfo?.members || []

    const notMe: UserFieldsForBuild | undefined = members.filter((m) => m.userId !== requesterId)[0]?.user
    const me = members.find((m) => m.userId === requesterId)?.user

    return this.buildApiUser(notMe || me, requesterId)
  }

  /** MESSAGES */
  public buildApiMessage(message: PrismaMessage, requesterId: string, chatId: string): Api.Message {
    const { action, entities, senderId, ...primaryFields } = message

    return {
      ...primaryFields,
      _chatId: primaryFields.chatId,
      chatId,
      content: {
        formattedText: {
          text: primaryFields.text!,
          ...(entities && { entities: JSON.parse(entities as string) as Api.MessageEntity[] }),
        },
        action: (action as Api.MessageAction) || undefined,
      },
      senderId: senderId,
      isOutgoing: senderId === requesterId,
      action: action as Api.MessageAction,
    }
  }

  /* OTHER */
  public buildApiPhoto(photo: PhotoFields): Api.Photo | undefined {
    return photo ? (photo as Api.Photo) : undefined
  }

  public buildApiAuthorization(session: Prisma.Session, requesterSession: Api.Session): Api.Session {
    return {
      ...session,
      isCurrent: session.id === requesterSession.id,
    }
  }
}
