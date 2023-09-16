import type * as Prisma from '@prisma/client'
import type * as Api from '@generated/graphql'
import type { UserStatus } from 'types/users'

import { milliseconds } from 'common/utils/ms'

export function buildAuthorization(session: Prisma.Session, requesterSession: Api.Session): Api.Session {
  return {
    ...session,
    isCurrent: session.id === requesterSession.id,
  }
}

const WEEK_IN_MS = milliseconds({ weeks: 1 })
export function buildUserStatus(user: Prisma.User): UserStatus {
  // if (!user.lastActivity) {
  //   // fix it, need to set last activity default value??
  //   return { type: 'userStatusRecently' }
  // }
  // const lastActive = user.lastActivity
  // // Дивитись у requesterId і в user.privacy якщо в нього nobody, або contacts, і треба робити buildApiUser? або передавати вже сюди одразу buildApiUser
  // const now = new Date()
  // const thisWeekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
  // const isActiveThisWeek = lastActive < thisWeekStart

  // if (isActiveThisWeek) {
  //   return {
  //     type: 'userStatusOffline',
  //     wasOnline: user.lastActivity.getTime(),
  //   }
  // }

  // // Був активний минулого тижня
  // const prevWeekStart = new Date(thisWeekStart.getTime() - WEEK_IN_MS)
  // const prevWeekEnd = new Date(thisWeekStart.getTime() - 1)
  // const isActiveLastWeek = lastActive > prevWeekStart && lastActive < prevWeekEnd

  // if (isActiveLastWeek) {
  //   return { type: 'userStatusLastWeek' }
  // }
  // // Був активний минулого місяця
  // const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  // const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
  // const isActiveLastMonth = lastActive > prevMonthStart && lastActive < prevMonthEnd

  // if (isActiveLastMonth) {
  //   return { type: 'userStatusLastMonth' }
  // }
  // // Був активний раніше, ніж минулого місяця
  // const isActiveLongTimeAgo = lastActive < prevMonthStart

  // if (isActiveLongTimeAgo) {
  //   return { type: 'userStatusLongTimeAgo' }
  // }

  // return { type: 'userStatusRecently' }

  const lastActiveDate = user.lastActivity
  if (!lastActiveDate) {
    return { type: 'userStatusRecently' }
  }
  const currentDate = new Date()
  const oneWeekAgo = new Date(currentDate.setDate(currentDate.getDate() - 7))
  const oneMonthAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 1))

  if (lastActiveDate > oneWeekAgo) {
    return { type: 'userStatusOffline', wasOnline: lastActiveDate.getTime() }
  }

  if (lastActiveDate > oneMonthAgo) {
    return { type: 'userStatusLastWeek' }
  }

  if (lastActiveDate > new Date(currentDate.setFullYear(currentDate.getFullYear() - 1))) {
    return { type: 'userStatusLastMonth' }
  }

  return { type: 'userStatusLongTimeAgo' }
}
