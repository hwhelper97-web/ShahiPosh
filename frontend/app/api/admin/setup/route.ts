import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1. Clean up old admin to avoid duplicates
    const adminEmail = 'abidtanha1@gmail.com';
    const adminPassword = '@Black0x22@';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const adminId = 'cl_super_admin_001';

    await prisma.$executeRawUnsafe(`DELETE FROM "User" WHERE "email" = $1`, adminEmail);
    
    // 2. Insert Super Admin using RAW SQL
    await prisma.$executeRawUnsafe(
      `INSERT INTO "User" ("id", "email", "passwordHash", "name", "role", "isActive", "updatedAt") 
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      adminId, adminEmail, hashedPassword, 'Admin User', 'SUPER_ADMIN', true
    );

    // 3. Create Categories using RAW SQL
    const categoriesData = [
      { id: 'cat_001', name: "Embroidered dupatta", slug: "embroidered-dupatta", description: "Beautifully handcrafted silk and embroidered dupattas.", image: "/products/silk_embroidered_dupatta_1.png" },
      { id: 'cat_002', name: "Luxury khaddar shawl", slug: "luxury-khaddar-shawl", description: "Premium quality handcrafted khaddar shawls.", image: "/products/khaddar_shawl_brown_1.png" },
      { id: 'cat_003', name: "Chunri dupatta", slug: "chunri-dupatta", description: "Traditional chunri patterns on premium fabric.", image: "/products/chunri_pink_3.png" },
      { id: 'cat_004', name: "Velvet embroidered shawl", slug: "velvet-embroidered-shawl", description: "Luxurious velvet shawls with intricate tilla and embroidery.", image: "/products/velvet_shawl_blue_2.png" },
      { id: 'cat_005', name: "Vintage jewelry", slug: "vintage-jewelry", description: "Exquisite artisanal vintage jewelry for a royal aesthetic.", image: "/products/vintage_necklace_1.png" }
    ];

    for (const cat of categoriesData) {
      await prisma.$executeRawUnsafe(`DELETE FROM "Category" WHERE "slug" = $1`, cat.slug);
      await prisma.$executeRawUnsafe(
        `INSERT INTO "Category" ("id", "name", "slug", "description", "image", "updatedAt") 
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        cat.id, cat.name, cat.slug, cat.description, cat.image
      );
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
