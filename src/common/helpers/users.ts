import type * as Api from '@generated/graphql'
import type * as Prisma from '@prisma/client'

export function getUserName(user: Api.User | Prisma.User) {
  return user.firstName ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ''}` : user.lastName || ''
}
