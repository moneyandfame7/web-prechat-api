import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'
import { getRandomAvatarVariant } from './../src/Media/Helpers'
const prisma = new PrismaClient()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Seeder {
  public async createUsers(count = 100) {
    for (let k = 0; k < count; k++) {
      const user = await prisma.user.create({
        data: {
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          phoneNumber: faker.phone.number('+380#########'),
          fullInfo: {
            create: {
              avatar: {
                create: {
                  avatarVariant: getRandomAvatarVariant(),
                },
              },
              bio: faker.lorem.sentence(),
            },
          },
          privacySettings: {
            create: {
              addByPhone: {
                create: {
                  visibility: 'Everybody',
                },
              },
              phoneNumber: {
                create: {
                  visibility: 'Everybody',
                },
              },
              lastSeen: {
                create: {
                  visibility: 'Everybody',
                },
              },
              addForwardLink: {
                create: {
                  visibility: 'Everybody',
                },
              },
              chatInvite: {
                create: {
                  visibility: 'Everybody',
                },
              },
              profilePhoto: {
                create: {
                  visibility: 'Everybody',
                },
              },
            },
          },
          sessions: {
            create: {
              country: faker.address.country(),
              region: faker.address.cityName(),
              ip: faker.internet.ip(),
              platform: faker.lorem.word(),
              browser: faker.internet.userAgent(),
            },
          },
          username: faker.internet.userName(),
        },
      })

      console.log(`user ${user.id} created successfully ✅`)
    }

    console.log('[100 USERS] created successfully 🤝')
  }

  public async addContacts(contactsLimit = 50) {
    const MOCKED = await prisma.user.findUnique({
      where: {
        phoneNumber: '+380684178101',
      },
    })
    if (!MOCKED) {
      throw new Error('MOCK USER NOT REGISTERED')
    }
    const users = await prisma.user.findMany({
      take: contactsLimit,
      where: {
        id: {
          not: MOCKED.phoneNumber,
        },
      },
    })

    users.map(async (newContact, idx) => {
      await prisma.user.update({
        where: {
          id: MOCKED.id,
        },
        data: {
          contacts: {
            create: {
              contactId: newContact.id,
              firstName: idx === 0 ? 'DOLBAEB PERWIY' : faker.internet.userName(),
              lastName: idx === 2 ? 'DOLBAEB TRETIY' : undefined,
            },
          },
        },
      })

      console.log(`[CONTACTS]: connect to ${MOCKED.id} from - ${newContact.id}`)
    })

    console.log('[100 CONTACTS] connected successfully 🤝')
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
