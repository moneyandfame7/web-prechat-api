import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'
import { getRandomColor } from './../src/Media/Helpers'
import { buildPrivacySettings } from '../src/common/builder/users'
import { generateId } from '../src/common/helpers/generateId'
import { FOLDER_ID_ALL } from '../src/common/constants'
const prisma = new PrismaClient()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Seeder {
  private mockUserId1 = generateId('user')
  private mockUserId2 = generateId('user')
  private mockUserId3 = generateId('user')
  private mockUserPhone3 = faker.phone.number('+380#########')
  public async createUsers(count = 100) {
    // const poll = await prisma.poll.findFirst({
    //   include: {
    //     answers: {
    //       include: {
    //         voters: {
    //           include: {
    //             user: true,
    //           },
    //         },
    //       },
    //     },
    //   },
    // })
    // poll?.answers[0].voters[0].
    // poll.
    for (let k = 0; k < count; k++) {
      const user = await prisma.user.create({
        data: {
          id: generateId('user'),
          lastActivity: k % 3 === 0 ? faker.date.past() : faker.date.recent(),
          orderedFoldersIds: [FOLDER_ID_ALL],
          isDeleted: k % 7 === 0,
          bio: faker.lorem.paragraphs(),
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          phoneNumber: faker.phone.number('+380#########'),
          username: faker.internet.userName(),
          color: getRandomColor(),
          privacySettings: buildPrivacySettings(),
          sessions: {
            create: {
              country: faker.address.country(),
              region: faker.address.cityName(),
              ip: faker.internet.ip(),
              platform: faker.lorem.word(),
              browser: faker.internet.userAgent(),
            },
          },
          folders: {
            create: {
              orderId: FOLDER_ID_ALL,
              title: 'All',
              excludeArchived: true,
            },
          },
        },
      })

      console.log(`user ${user.id} created successfully ✅`)
    }

    console.log('[100 USERS] created successfully 🤝')
  }

  public async createMockAccounts() {
    /* First */
    await prisma.user.create({
      data: {
        id: this.mockUserId1,
        color: getRandomColor(),
        phoneNumber: '+380684178101',
        firstName: 'Google',
        privacySettings: buildPrivacySettings(),
        sessions: {
          create: {
            country: faker.address.country(),
            region: faker.address.cityName(),
            ip: faker.internet.ip(),
            platform: faker.lorem.word(),
            browser: faker.internet.userAgent(),
          },
        },
      },
    })
    /* Second */
    await prisma.user.create({
      data: {
        id: this.mockUserId2,
        color: getRandomColor(),
        phoneNumber: '+12345678',
        firstName: 'Safari',
        privacySettings: buildPrivacySettings(),
        sessions: {
          create: {
            country: faker.address.country(),
            region: faker.address.cityName(),
            ip: faker.internet.ip(),
            platform: faker.lorem.word(),
            browser: faker.internet.userAgent(),
          },
        },
      },
    })
    /* Third */
    await prisma.user.create({
      data: {
        id: this.mockUserId3,
        color: getRandomColor(),
        phoneNumber: this.mockUserId3,
        firstName: 'Mozila',
        privacySettings: buildPrivacySettings(),
        sessions: {
          create: {
            country: faker.address.country(),
            region: faker.address.cityName(),
            ip: faker.internet.ip(),
            platform: faker.lorem.word(),
            browser: faker.internet.userAgent(),
          },
        },
      },
    })
  }

  public async addContacts(contactsLimit = 50) {
    const users = await prisma.user.findMany({
      take: contactsLimit,
    })

    users.map(async (u) => {
      await prisma.user.update({
        where: {
          id: this.mockUserId1,
        },
        data: {
          contacts: {
            create: {
              contactId: u.id,
              firstName: faker.name.firstName(),
              lastName: faker.name.lastName(),
            },
          },
        },
      })
      await prisma.user.update({
        where: {
          id: this.mockUserId2,
        },
        data: {
          contacts: {
            create: {
              contactId: u.id,
              firstName: faker.name.firstName(),
              lastName: faker.name.lastName(),
            },
          },
        },
      })
      await prisma.user.update({
        where: {
          id: this.mockUserId3,
        },
        data: {
          contacts: {
            create: {
              contactId: u.id,
              firstName: faker.name.firstName(),
              lastName: faker.name.lastName(),
            },
          },
        },
      })
    })
  }

  public async deleteUsers() {
    await prisma.user.deleteMany({
      where: {
        NOT: {
          phoneNumber: '+380684178101',
        },
        AND: {
          NOT: {
            phoneNumber: '+12345678',
          },
        },
      },
    })
  }

  public async removeContacts() {
    const MOCKED = await prisma.user.findUnique({
      where: {
        phoneNumber: '+380684178101',
      },
    })
    if (!MOCKED) {
      throw new Error('MOCK USER NOT REGISTERED')
    }
    await prisma.user.update({
      where: {
        id: MOCKED.id,
      },
      data: {
        contacts: {
          deleteMany: {},
        },
      },
    })

    console.log('[CONTACTS]: Deleted successfully 😈')
  }

  public async createChannels(count = 10) {
    for (let k = 0; k < count; k++) {
      await prisma.chat.create({
        data: {
          id: generateId('chat'),
          type: 'chatTypeChannel',
          color: getRandomColor(),
          title: faker.internet.userName(),
          isPrivate: k % 3 === 0,
        },
      })
    }
  }

  public async createGroups(count = 10) {
    for (let k = 0; k < count; k++) {
      await prisma.chat.create({
        data: {
          id: generateId('chat'),
          type: 'chatTypeGroup',
          color: getRandomColor(),
          title: faker.internet.userName(),
          isPrivate: k % 3 === 0,
        },
      })
    }
  }

  public async createPrivateChats() {}

  public async createMessages() {
    // for (let i = 0; i <= count; i++) {
    //   const message = await prisma.message.create({
    //     data: {
    //       chatId: MOCKED_GROUP,
    //       senderId: i % 3 === 0 ? MOCKED_TWINK : i % 2 === 0 ? MOCKED_MAIN : MOCKED_TWINK,
    //       text: faker.lorem.text(),
    //       createdAt: faker.date.recent(),
    //     },
    //   })
    //   if (i === count) {
    //     await prisma.chat.update({
    //       where: {
    //         id: MOCKED_GROUP,
    //       },
    //       data: {
    //         lastMessage: {
    //           connect: {
    //             id: message.id,
    //           },
    //         },
    //       },
    //     })
    //   }
    // }
  }
}

const seed = new Seeder()
async function main() {
  // await seed.createMessages(100)
  await seed.createMockAccounts()
  console.log('[SEED]: Mock accounts created 💅')

  await seed.createUsers(50)
  console.log(`[SEED]: Users created 🤝`)

  await seed.addContacts(15)
  console.log(`[SEED]: Contacts created 📞`)

  await seed.createChannels()
  console.log(`[SEED]: Channels created 📺`)

  await seed.createGroups()
  console.log(`[SEED]: Groups created 🏘️`)

  // await seed.deleteUsers()
  // await seed.addContacts(100)
  // await seed.removeContacts()
}

main()
  .catch((e) => {
    console.log(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
