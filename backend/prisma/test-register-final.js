import { PrismaClient } from '../../frontend/lib/generated/client/index.js';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function run() {
  try {
    console.log('--- STARTING ACCOUNT CREATION TEST ---');
    const testEmail = `test_${Math.random().toString(36).substring(7)}@shahiposh.com`;
    const hashedPassword = await bcrypt.hash('testpassword123', 10);
    
    const user = await prisma.user.create({
      data: {
        name: 'Automated Tester',
        email: testEmail,
        phone: '+92000000000',
        passwordHash: hashedPassword
      }
    });
    
    console.log('✅ SUCCESS: Account created in background.');
    console.log('ID:', user.id);
    console.log('Email:', user.email);
  } catch (err) {
    console.error('❌ FAILURE:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

run();
