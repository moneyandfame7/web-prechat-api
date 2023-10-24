import type { ColorVariants, Contact, UserBlock } from '@prisma/client'
import type { PhotoFields } from 'common/builder/photos'

export interface UserFieldsForBuild {
  id: string
  firstName: string
  lastName: string | null
  username: string | null
  phoneNumber: string
  contacts: Contact[]
  addedByContacts: Contact[]
  blockedByUsers: UserBlock[]
  photo: PhotoFields
  bio: string | null
  color: ColorVariants
  lastActivity: Date | null
  isDeleted: boolean
  createdAt: Date
  privacySettingsId: string
  orderedFoldersIds: number[]
}
export type UserStatusType =
  | 'userStatusOnline'
  | 'userStatusRecently'
  | 'userStatusLastMonth'
  | 'userStatusLastWeek'
  | 'userStatusLongTimeAgo'

export type UserStatus =
  | {
      type: UserStatusType
    }
  | {
      type: 'userStatusOffline'
      wasOnline: number
    }
