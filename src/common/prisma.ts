import { Prisma } from '@prisma/client'

export const participantPopulated = {
  participants: {
    select: {
      id: true,
      username: true,
      photo: true,
    },
  },
}

export const conversationPopulated = Prisma.validator<Prisma.ConversationInclude>()({
  ...participantPopulated,
  lastMessage: {
    include: {
      sender: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  },
})
