import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Seeder {
  public async deleteUsers() {
    await prisma.user.deleteMany()
  }

  public async deleteChats() {
    await prisma.chat.deleteMany()
  }
}

const seed = new Seeder()
async function main() {
  await seed.deleteUsers()
  console.log('Users deleted successfully ✅')
  await seed.deleteChats()
  console.log('Conversations deleted successfully ✅')
}

main()
  .catch((e) => {
    console.log(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
