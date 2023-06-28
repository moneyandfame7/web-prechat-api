import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Seeder {
  public async createUsers(count: number) {
    // for (let k = 0; k < count; k++) {
    //   // const user = await prisma.user.create({
    //   //   data: {
    //   //     firstName: faker.name.firstName(),
    //   //     lastName: k % 2 === 0 ? faker.name.lastName() : undefined,
    //   //     username: faker.internet.userName(),
    //   //     phoneNumber: faker.phone.number('+380 ## ### ####'),
    //   //     avatar: {
    //   //       create: {
    //   //         avatarVariant:AvatarVariants.,
    //   //       },
    //   //     },
    //   //     sessions: {
    //   //       create: {
    //   //         country: faker.address.country(),
    //   //         region: faker.address.cityName(),
    //   //         ip: faker.internet.ip(),
    //   //         platform: faker.lorem.word(),
    //   //         hash: faker.internet.password(),
    //   //       },
    //   //     },
    //   //   },
    //   // })
    //   // console.log(`user ${user.id} created successfully ✅`)
    // }
  }

  public async deleteUsers() {
    await prisma.user.deleteMany()
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
