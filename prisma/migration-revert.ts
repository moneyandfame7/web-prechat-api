import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type FetchTables = Array<Record<'table_name', string>>

async function dropAllTables() {
  console.log('DROP ALL TABLES')
  await prisma.$queryRaw<FetchTables>`
  DROP SCHEMA IF EXISTS public CASCADE;
  `
  console.log('✅')
}

async function main() {
  await dropAllTables()
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
