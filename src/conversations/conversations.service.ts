import { Injectable } from '@nestjs/common'
import { Conversation } from '@prisma/client'
import { JwtPayload } from 'src/authorization/auth.type'
import { conversationPopulated, participantPopulated } from 'src/common/prisma'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class ConversationsService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(participantsIds: string[]): Promise<Conversation> {
    return this.prismaService.conversation.create({
      data: {
        participants: {
          connect: participantsIds.map((id) => ({ id })),
        },
      },
      include: conversationPopulated,
    })
  }

  getAll(currentUser: JwtPayload) {
    const whereCurrentUserid = {
      participants: {
        some: {
          id: {
            equals: currentUser.id,
          },
        },
      },
    }

    return this.prismaService.conversation.findMany({
      where: {
        ...whereCurrentUserid,
      },
      include: conversationPopulated,
    })
  }

  getOne(currentUser: JwtPayload, id: string) {
    return this.prismaService.conversation.findUnique({
      where: {
        id,
      },
      include: {
        ...participantPopulated,
        messages: {
          select: {
            id: true,
            text: true,
            isRead: true,
          },
        },
      },
    })
  }
}
