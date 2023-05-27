import { Conversation, PrismaClient, User } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Seeder {
  public users: User[] = []
  public conversations: Conversation[] = []

  public async createUsers(count: number) {
    for (let k = 0; k < count; k++) {
      const user = await prisma.user.create({
        data: {
          username: faker.internet.userName(),
          email: faker.internet.email(),
          photo: faker.internet.avatar(),
        },
      })
      console.log(`user ${user.id} created successfully ✅`)
      this.users.push(user)
    }
  }

  public async deleteUsers() {
    await prisma.user.deleteMany()
  }

  public async deleteConversastions() {
    await prisma.conversation.deleteMany()
  }

  // public async createConversationsWithMessages() {
  //   for (let i = 0; i < 20; i++) {
  //     const conversation = await prisma.conversation.create({
  //       data: {
  //         messages: {
  //           createMany: {
  //             data: Array.from({ length: 300 }).map(() => ({
  //               body: faker.lorem.sentence(),
  //               senderId: this.users[faker.datatype.number({ min: 1, max: this.users.length - 1 })].id,
  //             })),
  //           },
  //         },
  //         participants: {
  //           connect: {
  //             id: this.users[faker.datatype.number({ min: 1, max: this.users.length - 1 })].id,
  //           },
  //         },
  //       },
  //     })
  //     this.conversations.push(conversation)
  //   }
  // }
}

const seed = new Seeder()
async function main() {
  await seed.createUsers(100)
  console.log('[100 USERS] created successfully 🤝')
}

main()
  .catch((e) => {
    console.log(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
