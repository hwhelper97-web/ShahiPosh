const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true }
    });
    console.log('Products in DB:', products.map(p => ({ 
      id: p.id, 
      name: p.name, 
      category: p.category?.name, 
      categoryId: p.categoryId 
    })));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
