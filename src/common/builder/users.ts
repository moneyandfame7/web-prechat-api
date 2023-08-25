import type { AvatarVariants, Contact, Prisma } from '@prisma/client'

import type { User, UserInput } from '@generated/graphql'

import { getRandomAvatarVariant } from 'Media/Helpers'

/**
 * Just create relation for User and PrivacySettings.
 */
export function buildPrivacySettings(): Prisma.UserCreateInput['privacySettings'] {
  return {
    create: {
      addByPhone: {
        create: {
          visibility: 'Everybody',
        },
      },
      phoneNumber: {
        create: {
          visibility: 'Everybody',
        },
      },
      lastSeen: {
        create: {
          visibility: 'Everybody',
        },
      },
      addForwardLink: {
        create: {
          visibility: 'Everybody',
        },
      },
      chatInvite: {
        create: {
          visibility: 'Everybody',
        },
      },
      profilePhoto: {
        create: {
          visibility: 'Everybody',
        },
      },
    },
  }
}

/**
 * Just create relation for User and UserFullInfo.
 */
export function buildUserFullInfo(): Prisma.UserCreateInput['fullInfo'] {
  return {
    create: {
      avatar: {
        create: {
          avatarVariant: getRandomAvatarVariant(),
        },
      },
    },
  }
}

/**
 * Select default user fields.
 */

export function selectUserFieldsToBuild() /* : Required<UserFieldsToBuild> */ {
  return {
    id: true,
    firstName: true,
    lastName: true,
    username: true,
    phoneNumber: true,
    fullInfo: {
      select: {
        avatar: {
          select: {
            avatarVariant: true,
            // url: true,
            // hash:true
          },
        },
        bio: true,
      },
    },
    contacts: true,
    addedByContacts: true,
  }
}
export function getContact(contacts: Contact[], currentUserId: string) {
  return contacts.find((c) => c.ownerId === currentUserId)
}

export function isSelf(requiesterId: string, user: UserInput | string) {
  const id = typeof user === 'string' ? user : user.userId

  return requiesterId === id
}

export function buildApiUser(
  currentUserId: string,

  u: {
    id: string
    firstName: string
    lastName: string | null
    username: string | null
    phoneNumber: string
    fullInfo: {
      bio: string | null
      avatar: {
        avatarVariant: AvatarVariants
      }
    }
    contacts: Contact[]
    addedByContacts: Contact[]
  },
) {
  const contactAddedByCurrent = getContact(u.addedByContacts, currentUserId)

  const isCurrentUserInContact = u.addedByContacts.some((c) => c.ownerId === currentUserId)

  const isCurrentUserAddedToContact = u.contacts.some((c) => c.contactId === currentUserId)
  return {
    ...u,
    firstName: contactAddedByCurrent?.firstName || u.firstName,
    lastName: contactAddedByCurrent?.lastName || u.lastName,
    isSelf: u.id === currentUserId,
    isContact: isCurrentUserInContact,
    isMutualContact: isCurrentUserInContact && isCurrentUserAddedToContact,
  } as User
}
