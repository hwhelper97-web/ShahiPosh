import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Testing ContactMessage creation...');
  
  const msg = await prisma.contactMessage.create({
    data: {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'Test Message'
    }
  });
  
  console.log('Message created:', msg.id);
  
  const count = await prisma.contactMessage.count();
  console.log('Total messages:', count);

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error('Test failed:', e);
  await prisma.$disconnect();
  process.exit(1);
});
