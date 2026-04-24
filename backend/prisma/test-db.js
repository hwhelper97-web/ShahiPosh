import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Testing Database Operations...');
  
  // Try to find a category or create one
  let category = await prisma.category.findFirst();
  if (!category) {
    console.log('Creating a test category...');
    category = await prisma.category.create({
      data: {
        name: 'Test Category',
        slug: 'test-category',
      }
    });
  }
  console.log('Category:', category.name);

  // Try to create a product
  console.log('Creating a test product...');
  const product = await prisma.product.create({
    data: {
      name: 'Test Product ' + Date.now(),
      slug: 'test-product-' + Date.now(),
      sku: 'TEST-' + Date.now(),
      regularPrice: 100,
      description: 'Test description',
      categoryId: category.id,
      images: [],
    }
  });
  console.log('Product created:', product.name);

  // Try to find orders
  const ordersCount = await prisma.order.count();
  console.log('Current order count:', ordersCount);

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error('Test failed:', e);
  await prisma.$disconnect();
  process.exit(1);
});
