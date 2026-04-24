import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 1. Check if admin exists
  const user = await prisma.user.findUnique({
    where: { email: 'admin@shahiposh.com' }
  });
  
  console.log('=== Admin User State ===');
  if (!user) {
    console.log('❌ Admin user NOT FOUND in database!');
  } else {
    console.log('✅ Admin found:', { id: user.id, email: user.email, role: user.role });
    console.log('   Password hash:', user.passwordHash);
    
    // 2. Test password comparison
    const testResult = await bcrypt.compare('admin123', user.passwordHash);
    console.log('   Password "admin123" matches:', testResult);
  }

  // 3. Count total users
  const count = await prisma.user.count();
  console.log('\nTotal users in database:', count);
  
  const allUsers = await prisma.user.findMany({ select: { email: true, role: true } });
  console.log('All users:', allUsers);
  
  await prisma.$disconnect();
}

main().catch(console.error);
