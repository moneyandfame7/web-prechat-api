import type { ColorVariants, Contact } from '@prisma/client'
import type { PhotoFields } from 'common/builder/photos'

export interface UserFieldsForBuild {
  id: string
  firstName: string
  lastName: string | null
  username: string | null
  phoneNumber: string
  contacts: Contact[]
  addedByContacts: Contact[]
  photo: PhotoFields
  bio: string | null
  color: ColorVariants
  lastActivity: Date | null
  isDeleted: boolean
  createdAt: Date
  privacySettingsId: string
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
