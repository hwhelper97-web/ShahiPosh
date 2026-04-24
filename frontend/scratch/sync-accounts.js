const { PrismaClient } = require('../generated/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'abidtanha1@gmail.com';
  const password = '@Black0x22@';
  const name = 'Admin User';
  const phone = '923001234567';
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    // 1. Sync to Admin table
    await prisma.admin.upsert({
      where: { email },
      update: { password: hashedPassword },
      create: {
        email,
        password: hashedPassword,
      },
    });
    console.log('Admin account synced.');

    // 2. Sync to User table (for main /login page)
    await prisma.user.upsert({
      where: { email },
      update: { password: hashedPassword, name, phone },
      create: {
        email,
        password: hashedPassword,
        name,
        phone
      },
    });
    console.log('User account synced (for main login).');

  } catch (error) {
    console.error('Error syncing accounts:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
