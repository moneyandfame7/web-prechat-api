import { Prisma } from '@prisma/client'

export const memberPopulated = {
  members: {
    select: {
      id: true,
      username: true,
      photo: true,
    },
  },
}

export const chatPopulated = Prisma.validator<Prisma.ChatInclude>()({
  ...memberPopulated,
  members: true,
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
