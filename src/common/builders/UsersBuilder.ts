import { Injectable } from '@nestjs/common'
import type * as Api from '@generated/graphql'
import type { Contact } from '@prisma/client'

import { pick } from 'common/utils/pick'
import type { AnyUser, PrismaUser, UserStatus, UserWithoutStatus } from '../../interfaces/users'

@Injectable()
export class UsersBuilder {
  public build(requesterId: string, user: PrismaUser): UserWithoutStatus {
    const myContact = this.getContact(requesterId, user.addedByContacts) // maybe user.contacts ??? ( подивитись яка різниця ......)
    const isCurrentUserInContact = user.addedByContacts.some((c) => c.ownerId === requesterId)

    const isCurrentUserAddedToContact = user.contacts.some((c) => c.contactId === requesterId)

    const primaryFields = pick(user, ['id', 'color', 'photo', 'username', 'phoneNumber', 'bio'])

    return {
      ...primaryFields,
      firstName: myContact?.firstName || user.firstName,
      lastName: myContact?.lastName || user.lastName,
      isSelf: user.id === requesterId,
      isContact: isCurrentUserInContact,
      isMutualContact: isCurrentUserInContact && isCurrentUserAddedToContact,
    } as Omit<Api.User, 'status'>
  }

  public buildStatus(user: PrismaUser): UserStatus {
    // const lastActiveDate = user.lastActivity
    // if (!lastActiveDate) {
    //   return { type: 'userStatusRecently' }
    // }
    // const currentDate = new Date()
    // const oneWeekAgo = new Date(currentDate.setDate(currentDate.getDate() - 7))
    // const oneMonthAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 1))

    // // Цього тижня
    // if (lastActiveDate > oneWeekAgo) {
    //   return { type: 'userStatusOffline', wasOnline: lastActiveDate.getTime() }
    // }

    // // Минулого тижня
    // if (lastActiveDate > oneMonthAgo) {
    //   return { type: 'userStatusLastWeek' }
    // }

    // // Минулого місяця
    // if (lastActiveDate > new Date(currentDate.setFullYear(currentDate.getFullYear() - 1))) {
    //   return { type: 'userStatusLastMonth' }
    // }

    // // Дуже давно
    // return { type: 'userStatusLongTimeAgo' }

    // Якщо дати останньої активності немає, то статус "Нещодавно"
    if (!user.lastActivity) {
      return { type: 'userStatusRecently' }
    }

    const currentDate = new Date()

    // Рахуємо допоміжні дати
    const oneWeekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000)
    const oneMonthAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000)
    const oneYearAgo = new Date(currentDate.getTime() - 365 * 24 * 60 * 60 * 1000)

    // Порівнюємо з timestamp, а не датами напряму
    if (user.lastActivity.getTime() > oneWeekAgo.getTime()) {
      // Онлайн цього тижня
      return {
        type: 'userStatusOffline',
        wasOnline: user.lastActivity.getTime(),
      }
    } else if (user.lastActivity.getTime() > oneMonthAgo.getTime()) {
      // Онлайн минулого тижня
      return { type: 'userStatusLastWeek' }
    } else if (user.lastActivity.getTime() > oneYearAgo.getTime()) {
      // Онлайн минулого місяця
      return { type: 'userStatusLastMonth' }
    } else {
      // Давно онлайн
      return { type: 'userStatusLongTimeAgo' }
    }
  }

  public buildManyWithStatus(requesterId: string, users: PrismaUser[]): Api.User[] {
    return users.map((user) => this.buildWithStatus(requesterId, user))
  }

  public buildWithStatus(requesterId: string, user: PrismaUser): Api.User {
    const buildedUser = this.build(requesterId, user)
    const status = this.buildStatus(user)

    return {
      ...buildedUser,
      status,
    }
  }

  public getUserName(user: AnyUser) {
    return user.firstName ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ''}` : user.lastName || ''
  }

  private getContact(requesterId: string, contacts: Contact[]) {
    return contacts.find((c) => c.ownerId === requesterId)
  }
}
