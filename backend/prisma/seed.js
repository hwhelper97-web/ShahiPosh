import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Enterprise Database...');

  // 1. Create Super Admin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@shahiposh.com' },
    update: {},
    create: {
      email: 'admin@shahiposh.com',
      passwordHash: hashedPassword,
      name: 'System Admin',
      role: 'SUPER_ADMIN',
    },
  });
  console.log('✅ Created Admin');

  // 2. Create Vendors
  const vendorUser = await prisma.user.upsert({
    where: { email: 'vendor@luxury.com' },
    update: {},
    create: {
      email: 'vendor@luxury.com',
      passwordHash: hashedPassword,
      name: 'Luxury Fabrics',
      role: 'VENDOR',
    }
  });

  /*
  const vendor = await prisma.vendor.create({
    data: {
      userId: vendorUser.id,
      storeName: 'Luxury Fabrics',
      slug: 'luxury-fabrics',
      description: 'Premium fabrics from Pakistan',
      isVerified: true,
      status: 'APPROVED',
    }
  });
  console.log('✅ Created Vendor');

  // 3. Create Categories
  const formal = await prisma.category.create({
    data: {
      name: 'Formal Wear',
      slug: 'formal-wear',
      description: 'Elegant formal attire',
    }
  });

  const bridal = await prisma.category.create({
    data: {
      name: 'Bridal',
      slug: 'bridal',
      description: 'Stunning bridal collections',
      parentId: formal.id,
    }
  });
  console.log('✅ Created Categories');

  // 4. Create Products
  const product1 = await prisma.product.create({
    data: {
      name: 'Gold Embroidered Sherwani',
      slug: 'gold-embroidered-sherwani',
      description: 'A masterpiece of craftsmanship.',
      sku: 'SHW-001',
      regularPrice: 45000,
      salePrice: 39999,
      inventory: 15,
      categoryId: bridal.id,
      vendorId: vendor.id,
      isFeatured: true,
      isPublished: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80', alt: 'Sherwani' }
      ],
      tags: ['Sherwani', 'Wedding', 'Formal'],
    }
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Silk Kurta Set',
      slug: 'silk-kurta-set',
      description: 'Comfort meets elegance.',
      sku: 'KRT-002',
      regularPrice: 8500,
      inventory: 3, // Low stock
      categoryId: formal.id,
      vendorId: vendor.id,
      isPublished: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80', alt: 'Kurta' }
      ],
      tags: ['Kurta', 'Silk'],
    }
  });
  console.log('✅ Created Products');
  */

  // 5. Create Orders
  const order1 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-1001',
      customerName: 'Abid Tanha',
      customerEmail: 'customer@example.com',
      customerPhone: '923001234567',
      shippingAddress: '123 Street, Lahore, Pakistan',
      subtotal: 39999,
      totalPrice: 40249, // +250 shipping
      shippingFee: 250,
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      items: [
        { id: product1.id, name: product1.name, price: 39999, quantity: 1, image: product1.images[0].url }
      ],
    }
  });

  const order2 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-1002',
      customerName: 'Syed Ali',
      customerEmail: 'buyer@email.com',
      customerPhone: '923219876543',
      shippingAddress: 'Sector F-7, Islamabad',
      subtotal: 8500,
      totalPrice: 8750,
      shippingFee: 250,
      status: 'SHIPPED',
      items: [
        { id: product2.id, name: product2.name, price: 8500, quantity: 1, image: product2.images[0].url }
      ],
    }
  });
  console.log('✅ Created Orders');

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