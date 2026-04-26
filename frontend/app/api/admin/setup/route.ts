import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log('Starting Manual Database Setup...');
    
    // 1. Create Super Admin
    const adminPassword = '@Black0x22@';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    const admin = await prisma.user.upsert({
      where: { email: 'abidtanha1@gmail.com' },
      update: {
        passwordHash: hashedPassword,
        role: 'SUPER_ADMIN',
        isActive: true
      },
      create: {
        email: 'abidtanha1@gmail.com',
        passwordHash: hashedPassword,
        name: 'Admin User',
        role: 'SUPER_ADMIN',
        isActive: true
      }
    });

    // 2. Create Categories
    const categoriesData = [
      { name: "Embroidered dupatta", slug: "embroidered-dupatta", description: "Beautifully handcrafted embroidered dupattas.", image: "/products/traditional_shawl_hero_4k.png" },
      { name: "Luxury khaddar shawl", slug: "luxury-khaddar-shawl", description: "Premium quality khaddar shawls for a regal look.", image: "/products/traditional_shawl_hero.png" },
      { name: "Chunri dupatta", slug: "chunri-dupatta", description: "Traditional chunri patterns on high-quality fabric.", image: "/products/white-dress.jpg" },
      { name: "Velvet embroidered shawl", slug: "velvet-embroidered-shawl", description: "Luxurious velvet shawls with intricate embroidery.", image: "/products/traditional_shawl_hero_4k.png" },
      { name: "Vintage jewelry", slug: "vintage-jewelry", description: "Exquisite vintage-style jewelry to complete your royal look.", image: "/products/traditional_shawl_hero.png" }
    ];

    for (const cat of categoriesData) {
      await prisma.category.upsert({
        where: { slug: cat.slug },
        update: cat,
        create: cat
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Database initialized successfully!",
      admin: admin.email,
      categories: categoriesData.length
    });

  } catch (error: any) {
    console.error('Setup Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
