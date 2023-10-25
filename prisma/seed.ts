/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'
import { getRandomColor } from './../src/Media/Helpers'
import { generateId } from '../src/common/helpers/generateId'
import sharp from 'sharp'
import { encode } from 'blurhash'
const prisma = new PrismaClient()
const encodeImageToBlurhash = (path: string) =>
  new Promise<{ hash: string; metadata: sharp.Metadata }>(async (resolve, reject) => {
    const metadata = await sharp(path).metadata()

    sharp(path)
      .raw()
      .ensureAlpha()
      .resize(32, 32, { fit: 'inside' })
      .toBuffer((err, buffer, { width, height }) => {
        if (err) return reject(err)
        resolve({ hash: encode(new Uint8ClampedArray(buffer), width, height, 4, 4), metadata })
      })
  })

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Seeder {
  private mockUserId1 = generateId('user')
  private mockUserId2 = generateId('user')
  private mockUserId3 = generateId('user')
  private mockUserPhone3 = faker.phone.number('+380#########')
  private async createPhoto() {
    const url = faker.image.image()
    const test = await (await fetch(url)).arrayBuffer()
    const { hash, metadata } = await encodeImageToBlurhash(test as any)

    return {
      blurHash: hash,
      url,
      width: metadata.width,
      height: metadata.height,
    }
  }
  public async createUsers(count = 100) {
    for (let k = 0; k < count; k++) {
      const user = await prisma.user.create({
        data: {
          id: generateId('user'),
          lastActivity: k % 3 === 0 ? faker.date.past() : faker.date.recent(),
          isDeleted: k % 7 === 0,
          bio: faker.lorem.paragraphs(),
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          phoneNumber: faker.phone.number('+380#########'),
          username: faker.internet.userName(),
          color: getRandomColor(),
          sessions: {
            create: {
              country: faker.address.country(),
              region: faker.address.cityName(),
              ip: faker.internet.ip(),
              platform: faker.lorem.word(),
              browser: faker.internet.userAgent(),
            },
          },
          photo: {
            create: await this.createPhoto(),
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
        sessions: {
          create: {
            country: faker.address.country(),
            region: faker.address.cityName(),
            ip: faker.internet.ip(),
            platform: faker.lorem.word(),
            browser: faker.internet.userAgent(),
          },
        },
        photo: {
          create: await this.createPhoto(),
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
        sessions: {
          create: {
            country: faker.address.country(),
            region: faker.address.cityName(),
            ip: faker.internet.ip(),
            platform: faker.lorem.word(),
            browser: faker.internet.userAgent(),
          },
        },
        photo: {
          create: await this.createPhoto(),
        },
      },
    })

    /* Third */
    await prisma.user.create({
      data: {
        id: this.mockUserId3,
        color: getRandomColor(),
        phoneNumber: '+380123456789',
        firstName: 'Mozila',
        sessions: {
          create: {
            country: faker.address.country(),
            region: faker.address.cityName(),
            ip: faker.internet.ip(),
            platform: faker.lorem.word(),
            browser: faker.internet.userAgent(),
          },
        },
        photo: {
          create: await this.createPhoto(),
        },
      },
    })
  }

  public async findMockAccounts() {
    const first = await prisma.user.findUnique({
      where: {
        phoneNumber: '+380684178101',
      },
    })
    /* Second */
    const second = await prisma.user.findUnique({
      where: {
        phoneNumber: '+12345678',
      },
    })
    if (first) {
      this.mockUserId1 = first.id
    }
    if (second) {
      this.mockUserId2 = second.id
    }
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
          photo: {
            create: await this.createPhoto(),
          },
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
          photo: {
            create: await this.createPhoto(),
          },
          // photo:
        },
      })
    }
  }

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

  public async connectChats() {
    const chats = await prisma.chat.findMany()

    chats.map(async (c, cIdx) => {
      await prisma.chat.update({
        where: {
          id: c.id,
        },
        data: {
          fullInfo: {
            create: {
              members: {
                create: [this.mockUserId1, this.mockUserId2].map((u, idx) => ({
                  // id: u,
                  unreadCount: 0,
                  isOwner: cIdx % 3 === 0,
                  isAdmin: idx % 3 === 0,
                  inviterId: cIdx % 3 === 0 ? this.mockUserId1 : this.mockUserId2,
                  user: {
                    connect: {
                      id: u,
                    },
                  },
                })),
              },
              description: faker.lorem.paragraph(),
            },
          },
        },
      })
      // await prisma.user.update({
      //   where: {
      //     id: this.mockUserId1,
      //   },
      //   data: {
      //     chats: {
      //       connect: {
      //         id: c.id,
      //       },
      //     },
      //   },
      // })
      // await prisma.user.update({
      //   where: {
      //     id: this.mockUserId2,
      //   },
      //   data: {
      //     chats: {
      //       connect: {
      //         id: c.id,
      //       },
      //     },
      //   },
      // })
    })
  }

  public async addChatAvatars() {
    const chats = await prisma.chat.findMany()

    chats.map(async (c) => {
      const photoUrl = faker.image.image(undefined, undefined, true)
      const test = await (await fetch(photoUrl)).arrayBuffer()
      const { hash, metadata } = await encodeImageToBlurhash(test as any)

      await prisma.chat.update({
        where: {
          id: c.id,
        },
        data: {
          photo: {
            create: {
              url: photoUrl,
              blurHash: hash,
              width: metadata.width,
              height: metadata.height,
            },
          },
        },
      })
    })
  }
}

const seed = new Seeder()
async function main() {
  // await seed.createMessages(100)
  await seed.createMockAccounts()
  console.log('[SEED]: Mock accounts created 💅')
  // await seed.findMockAccounts()
  // console.log('[SEED]: Mock accounts founded 👀')
  await seed.createUsers(50)
  console.log(`[SEED]: Users created 🤝`)
  await seed.addContacts(15)
  console.log(`[SEED]: Contacts created 📞`)
  await seed.createChannels()
  console.log(`[SEED]: Channels created 📺`)
  await seed.createGroups()
  console.log(`[SEED]: Groups created 🏘️`)
  await seed.connectChats()
  console.log(`[SEED]: Chats connected 📶`)
  // await seed.addChatAvatars()
  // console.log(`[SEED]: Chats avatar added `)
  // await seed.deleteUsers()
  // await seed.addContacts(100)
  // await seed.removeContacts()
  // await seed.addChatMembers()
  // console.log(`[SEED]: Chats members added `)
}

main()
  .catch((e) => {
    console.log(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
