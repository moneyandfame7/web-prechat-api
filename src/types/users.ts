import type { AvatarVariants, Contact } from '@prisma/client'

export interface UserFieldsForBuild {
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
}
