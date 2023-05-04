import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany().then(() => {
    console.log('>>> Clear user table <<<');
  });
  await prisma.message.deleteMany().then(() => {
    console.log('>>> Clear message table <<<');
  });

  // const user = await prisma.user.create({
  //   data: {
  //     displayName: 'Money and Fame',
  //     username: 'moneyandfame7',
  //     email: 'davidoo1234e@gmail.com',
  //   },
  // });
  // const message = await prisma.message.create({
  //   data: {
  //     text: 'Lorem ipsum dorem',
  //     User: {
  //       connect: { id: user.id },
  //     },
  //   },
  //   include: {
  //     User: true,
  //   },
  // });

  // console.log({ user, message });
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
