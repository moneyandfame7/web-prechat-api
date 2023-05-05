import { PrismaClient, User } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const createUsers = async (count: number) => {
  const users: User[] = [];
  for (let k = 0; k < count; k++) {
    const user = await prisma.user.create({
      data: {
        username: faker.internet.userName(),
        displayName: faker.name.fullName(),
        email: faker.internet.email(),
        photo: faker.internet.avatar(),
        messages: {
          create: Array.from({ length: faker.datatype.number({ min: 3, max: 10 }) }).map(() => ({
            text: faker.lorem.sentence(),
          })),
        },
      },
    });
    console.log(`user ${user.id} created successfully ✅`);
    users.push(user);
  }
};

async function main() {
  await prisma.user.deleteMany();
  console.log('--- 🧹 CLEAR DATABASE 🧹 ---');
  await createUsers(30);
  console.log(' Created successfully ');
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
