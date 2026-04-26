import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function updateBankDetails() {
  const bankSettings = {
    bankAccountName: 'HBL Habib Bank Limited',
    bankAccountHolder: 'Syed Saif',
    bankAccountNumber: 'PK33HABB0006967901747803'
  };

  for (const [key, value] of Object.entries(bankSettings)) {
    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    });
  }

  console.log('Bank details updated successfully');
}

updateBankDetails()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
