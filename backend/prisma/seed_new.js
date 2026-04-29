import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding ShahiPosh Database with Official Categories...');

  // 1. Create Super Admin
  const hashedPassword = await bcrypt.hash('@Blackzerox22@', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@shahiposh.com' },
    update: {},
    create: {
      email: 'admin@shahiposh.com',
      passwordHash: hashedPassword,
      name: 'Abid Tanha',
      role: 'SUPER_ADMIN',
    },
  });
  console.log('✅ Created Admin');

  // 2. Define Categories
  const categories = [
    { name: 'Embroidered dupatta', slug: 'embroidered-dupatta' },
    { name: 'Luxury khaddar shawl', slug: 'luxury-khaddar-shawl' },
    { name: 'Chunri dupatta', slug: 'chunri-dupatta' },
    { name: 'Velvet embroidered shawl', slug: 'velvet-embroidered-shawl' },
    { name: 'Vintage jewelry', slug: 'vintage-jewelry' }
  ];

  const createdCategories = [];
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat
    });
    createdCategories.push(created);
    console.log(`✅ Category: ${cat.name}`);
  }

  // 3. Create Sample Products for each category
  const products = [
    {
      name: 'Traditional Embroidered Dupatta',
      slug: 'trad-emb-dupatta',
      description: 'Hand-crafted embroidered dupatta with gold thread work.',
      sku: 'ED-001',
      regularPrice: 4500,
      inventory: 20,
      categoryId: createdCategories[0].id,
      images: JSON.stringify([{ url: '/products/silk_embroidered_dupatta_1.png', alt: 'Embroidered Dupatta' }]),
      isPublished: true
    },
    {
      name: 'Luxury Khaddar Shawl',
      slug: 'lux-khaddar-shawl',
      description: 'Premium quality khaddar shawl for winter elegance.',
      sku: 'KS-001',
      regularPrice: 7500,
      inventory: 15,
      categoryId: createdCategories[1].id,
      images: JSON.stringify([{ url: '/products/khaddar_shawl_brown_1.png', alt: 'Khaddar Shawl' }]),
      isPublished: true
    },
    {
      name: 'Classic Chunri Dupatta',
      slug: 'classic-chunri',
      description: 'Traditional pink chunri dupatta with vibrant patterns.',
      sku: 'CD-001',
      regularPrice: 3500,
      inventory: 25,
      categoryId: createdCategories[2].id,
      images: JSON.stringify([{ url: '/products/chunri_pink_3.png', alt: 'Chunri Dupatta' }]),
      isPublished: true
    },
    {
      name: 'Blue Velvet Embroidered Shawl',
      slug: 'blue-velvet-shawl',
      description: 'Stunning blue velvet shawl with silver embroidery.',
      sku: 'VS-001',
      regularPrice: 12500,
      inventory: 10,
      categoryId: createdCategories[3].id,
      images: JSON.stringify([{ url: '/products/velvet_shawl_blue_2.png', alt: 'Velvet Shawl' }]),
      isPublished: true
    },
    {
      name: 'Vintage Royal Necklace',
      slug: 'vintage-necklace',
      description: 'Exquisite vintage jewelry piece with royal heritage.',
      sku: 'VJ-001',
      regularPrice: 18500,
      inventory: 5,
      categoryId: createdCategories[4].id,
      images: JSON.stringify([{ url: '/products/vintage_necklace_1.png', alt: 'Vintage Necklace' }]),
      isPublished: true
    }
  ];

  for (const prod of products) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {},
      create: prod
    });
    console.log(`✅ Product: ${prod.name}`);
  }

  console.log('🚀 Seed Complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
