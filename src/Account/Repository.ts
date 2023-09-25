import { Injectable } from '@nestjs/common'

import { PrismaService } from 'common/prisma'
import type * as Api from '@generated/graphql'
@Injectable()
export class AccountRepository {
  public constructor(private prisma: PrismaService) {}

  public async getPassword(requesterId: string) {
    return this.prisma.twoFaAuth.findUnique({
      where: {
        userId: requesterId,
      },
    })
  }

  public async getActiveSessions(requesterId: string) {
    return this.prisma.session.findMany({
      where: {
        userId: requesterId,
      },
    })
  }

  public async createAuthorization(input: Api.SessionData, requesterId: string) {
    return this.prisma.session.create({
      data: {
        ...input,
        userId: requesterId,
      },
    })
  }

  public async updateUserLastActivity(currentSession: Api.Session) {
    // const userPrivacy = await this.prisma.user.findUnique({
    //   where: {
    //     id: '',
    //   },
    //   include: {
    //     privacySettings: {
    //       include: {
    //         lastSeen: {
    //           include: {
    //             allowedUsers: true,
    //             blockedUsers: true,
    //           },
    //         },
    //       },
    //     },
    //   },
    // })
    // userPrivacy?.privacySettings.lastSeen.allowedUsers.find(u=>u.id===requesterId)
    // ||

    /**
     * ??????
     *
     * // REUSABLE PRIVACY_BUILDER(allowedRule:'', disalowedRule: '')
     * if (lastSeen.blockedUsers.find(u => u.id === requesterId)) {
     *    return {type: "userStatusRecently "}
     *  }
     * if (lastSeen.allowedUsers.find(u=>u.id===requesterId)) {
     *    return {""} // buildStatus
     *  }
     *
     *
     * if (lastSeen.visibility === PrivacyVisibility.EveryBody) {
     *    return {''} // buildStatus?
     *  }
     *
     * if (lastSeen.visibility === PrivacyVisibility.Contacts && isInContact){
     *    return {""} // buildStatus
     *  }
     *
     * if (lastSeen.visibility === PrivacyVisibility.Nobody ) {
     *    return {type:"userStatusRecently "}
     *  }
     */
    // return this.prisma.$transaction(async (tx) => {
    const now = new Date()

    const user = await this.prisma.user.update({
      where: {
        id: currentSession.userId,
      },
      data: {
        lastActivity: now,
        // sessions: {
        //   update: {
        //     where: {
        //       id: currentSession.id,
        //     },
        //     data: {
        //       activeAt: now,
        //     },
        //   },
        // },
      },
    })

    return user
    // })
  }
}
