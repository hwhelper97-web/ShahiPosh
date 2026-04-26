const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 1. Clean up existing data
  console.log('Cleaning up existing data...');
  await prisma.review.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // 1.5 Create Admin User
  const bcrypt = require('bcryptjs');
  const adminPassword = '@Black0x22@';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  
  await prisma.user.create({
    data: {
      email: 'abidtanha1@gmail.com',
      passwordHash: hashedPassword,
      name: 'Admin User',
      role: 'SUPER_ADMIN',
      isActive: true
    }
  });
  console.log('Admin user created successfully.');

  // 2. Create requested Categories
  console.log('Creating requested categories...');
  const categoriesData = [
    { name: "Embroidered dupatta", slug: "embroidered-dupatta", description: "Beautifully handcrafted embroidered dupattas.", image: "/products/traditional_shawl_hero_4k.png" },
    { name: "Luxury khaddar shawl", slug: "luxury-khaddar-shawl", description: "Premium quality khaddar shawls for a regal look.", image: "/products/traditional_shawl_hero.png" },
    { name: "Chunri dupatta", slug: "chunri-dupatta", description: "Traditional chunri patterns on high-quality fabric.", image: "/products/white-dress.jpg" },
    { name: "Velvet embroidered shawl", slug: "velvet-embroidered-shawl", description: "Luxurious velvet shawls with intricate embroidery.", image: "/products/traditional_shawl_hero_4k.png" },
    { name: "Vintage jewelry", slug: "vintage-jewelry", description: "Exquisite vintage-style jewelry to complete your royal look.", image: "/products/traditional_shawl_hero.png" }
  ];

  const categories = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    categories[cat.slug] = created;
  }

  // 3. Create Sample Products for each category
  console.log('Creating sample products...');
  const productsData = [
    {
      name: "Floral Silk Embroidered Dupatta",
      slug: "floral-silk-embroidered-dupatta",
      description: "A stunning silk dupatta with delicate floral embroidery.",
      sku: "ED-001",
      regularPrice: 4500,
      salePrice: 3800,
      inventory: 15,
      images: JSON.stringify([{ url: "/products/traditional_shawl_hero_4k.png", alt: "Floral Silk Dupatta" }]),
      categoryId: categories["embroidered-dupatta"].id,
      isFeatured: true,
      isPublished: true
    },
    {
      name: "Royal Black Luxury Khaddar Shawl",
      slug: "royal-black-khaddar-shawl",
      description: "Heavy khaddar shawl with premium finish.",
      sku: "KS-001",
      regularPrice: 7500,
      inventory: 10,
      images: JSON.stringify([{ url: "/products/traditional_shawl_hero.png", alt: "Black Khaddar Shawl" }]),
      categoryId: categories["luxury-khaddar-shawl"].id,
      isFeatured: true,
      isPublished: true
    },
    {
      name: "Traditional Red Chunri Dupatta",
      slug: "traditional-red-chunri-dupatta",
      description: "Classic red chunri with gold accents.",
      sku: "CD-001",
      regularPrice: 2500,
      inventory: 25,
      images: JSON.stringify([{ url: "/products/white-dress.jpg", alt: "Red Chunri Dupatta" }]),
      categoryId: categories["chunri-dupatta"].id,
      isFeatured: false,
      isPublished: true
    },
    {
      name: "Embellished Velvet Shawl",
      slug: "embellished-velvet-shawl",
      description: "Midnight blue velvet shawl with gold tilla work.",
      sku: "VS-001",
      regularPrice: 12000,
      salePrice: 9500,
      inventory: 8,
      images: JSON.stringify([{ url: "/products/traditional_shawl_hero_4k.png", alt: "Velvet Shawl" }]),
      categoryId: categories["velvet-embroidered-shawl"].id,
      isFeatured: true,
      isPublished: true
    },
    {
      name: "Antique Polki Necklace Set",
      slug: "antique-polki-necklace",
      description: "Vintage style jewelry set for royal occasions.",
      sku: "VJ-001",
      regularPrice: 18000,
      inventory: 5,
      images: JSON.stringify([{ url: "/products/traditional_shawl_hero.png", alt: "Vintage Jewelry" }]),
      categoryId: categories["vintage-jewelry"].id,
      isFeatured: true,
      isPublished: true
    }
  ];

  for (const product of productsData) {
    await prisma.product.create({ data: product });
  }

  console.log("Seed data updated successfully with ShahiPosh categories!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
