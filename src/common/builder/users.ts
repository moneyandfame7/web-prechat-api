import type { Contact, Prisma } from '@prisma/client'

import type { InputUser } from '@generated/graphql'
import { selectPhotoFields } from './photos'

/**
 * Select default user fields.
 */

export function selectUserFields() /* : Required<UserFieldsToBuild> */ {
  return {
    id: true,
    firstName: true,
    lastName: true,
    username: true,
    phoneNumber: true,
    contacts: true,
    addedByContacts: true,
    color: true,
    lastActivity: true,
    isDeleted: true,
    createdAt: true,
    // fullInfoId: true,
    bio: true,
    photo: {
      ...selectPhotoFields(),
    },
  } satisfies Prisma.UserSelect
}
export function getContact(contacts: Contact[], currentUserId: string) {
  return contacts.find((c) => c.ownerId === currentUserId)
}

export function isSelf(requiesterId: string, user: InputUser | string) {
  const id = typeof user === 'string' ? user : user.userId

  return requiesterId === id
}
