import type { Contact, Prisma } from '@prisma/client'

import type { User, InputUser } from '@generated/graphql'
import type { UserFieldsForBuild } from 'types/users'
import { selectPhotoFields } from './photos'
import { pick } from '../utils/pick'

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

export function buildApiUser(currentUserId: string, u: UserFieldsForBuild) {
  const contactAddedByCurrent = getContact(u.addedByContacts, currentUserId)

  const isCurrentUserInContact = u.addedByContacts.some((c) => c.ownerId === currentUserId)

  const isCurrentUserAddedToContact = u.contacts.some((c) => c.contactId === currentUserId)

  // const status=buildUserStatus(u)
  const baseFields = pick(u, ['id', 'color', 'photo', 'username', 'phoneNumber'])
  return {
    ...baseFields,

    firstName: contactAddedByCurrent?.firstName || u.firstName,
    lastName: contactAddedByCurrent?.lastName || u.lastName,
    isSelf: u.id === currentUserId,
    isContact: isCurrentUserInContact,
    isMutualContact: isCurrentUserInContact && isCurrentUserAddedToContact,
  } as Omit<User, 'status'>

  /* status here -  */
}
