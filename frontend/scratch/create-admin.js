const { PrismaClient } = require('../generated/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'abidtanha1@gmail.com';
  const password = '@Black0x22@';
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    const admin = await prisma.admin.upsert({
      where: { email },
      update: { password: hashedPassword },
      create: {
        email,
        password: hashedPassword,
      },
    });
    console.log('Admin user created/updated successfully:', admin.email);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
