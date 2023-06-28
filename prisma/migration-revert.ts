import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type FetchTables = Array<Record<'table_name', string>>

async function dropAllTables() {
  const tables: FetchTables = await prisma.$queryRaw<FetchTables>`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema='public'
    AND table_type='BASE TABLE'
  `

  for (const table of tables) {
    console.log('🧹 Deleting table:', table.table_name)

    await prisma.$queryRaw`
      DROP TABLE IF EXISTS "${table.table_name}" CASCADE
    `
  }
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
