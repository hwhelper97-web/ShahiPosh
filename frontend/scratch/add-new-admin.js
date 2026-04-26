const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'mzaikhatira@shahiposh.com';
  const password = 'Admin@khatira';
  const name = 'Mzaikhatira';
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    const admin = await prisma.user.upsert({
      where: { email },
      update: { 
        passwordHash: hashedPassword,
        role: 'ADMIN',
        isActive: true
      },
      create: {
        email,
        passwordHash: hashedPassword,
        name: name,
        role: 'ADMIN',
        isActive: true
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
