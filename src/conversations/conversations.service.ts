import { Injectable } from '@nestjs/common'
import { JwtPayload } from 'src/authorization/auth.type'
import { conversationPopulated, participantPopulated } from 'src/common/prisma'
import { PrismaService } from 'src/prisma.service'
import { CreateConversationResponse } from 'src/types/graphql'

@Injectable()
export class ConversationsService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(participantsIds: string[]): Promise<CreateConversationResponse> {
    const conversation = await this.prismaService.conversation.create({
      data: {
        participants: {
          connect: participantsIds.map((id) => ({ id })),
        },
      },
      include: conversationPopulated,
    })
    console.log(conversation)
    return {
      conversationId: conversation.id,
    }
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
