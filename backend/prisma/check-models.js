import prisma from '../frontend/lib/prisma.ts';

async function check() {
  console.log('Checking prisma.user...');
  if (prisma.user) {
    console.log('✅ prisma.user is DEFINED');
  } else {
    console.log('❌ prisma.user is UNDEFINED');
  }
  
  const models = Object.keys(prisma).filter(k => !k.startsWith('$') && !k.startsWith('_'));
  console.log('Available models:', JSON.stringify(models));
  
  process.exit(0);
}

check();
