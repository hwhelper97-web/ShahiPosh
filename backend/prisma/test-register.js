import { PrismaClient } from '../frontend/lib/generated/client/index.js';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testRegister() {
  console.log('Testing User Registration...');
  const email = `test_user_${Date.now()}@example.com`;
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        name: 'Background Test User',
        email: email,
        phone: '+92 300 0000000',
        passwordHash: hashedPassword,
        role: 'CUSTOMER'
      }
    });

    console.log('✅ User Created Successfully:', user.id);
    console.log('User Email:', user.email);
  } catch (err) {
    console.error('❌ Registration Failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

testRegister();
