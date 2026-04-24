const { PrismaClient } = require('../generated/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const admins = await prisma.admin.findMany();
    console.log('Admins in DB:', admins.map(a => a.email));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
