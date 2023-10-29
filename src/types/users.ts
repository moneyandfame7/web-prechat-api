import type { ColorVariants, Contact, User } from '@prisma/client'
import type * as Api from '@generated/graphql'
import type { PhotoFields } from 'types/Diff'

export interface PrismaUser {
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
}

export type UserWithoutStatus = Omit<Api.User, 'status'>
export type AnyUser = User | Api.User | UserWithoutStatus

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
