import { Injectable } from '@nestjs/common'
import { Conversation } from '@prisma/client'
import { JwtPayload } from 'src/authorization/auth.type'
import { AvatarVariants, avatarVariantsList } from 'src/common/constants'
import { getRandomArbitrary } from 'src/common/functions'
import { conversationPopulated, participantPopulated } from 'src/common/prisma'
import { PrismaService } from 'src/prisma.service'
import { CreateConversationInput } from 'src/types/graphql'

@Injectable()
export class ConversationsService {
  constructor(private readonly prismaService: PrismaService) {}
  async create({ name, description, participantsIds }: CreateConversationInput): Promise<Conversation> {
    return this.prismaService.conversation.create({
      data: {
        participants: {
          connect: participantsIds.map((id) => ({ id })),
        },
        name,
        description,
        avatarVariant: avatarVariantsList[getRandomArbitrary(0, 3)],
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
