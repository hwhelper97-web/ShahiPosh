import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Force all products to be published
    const result = await prisma.product.updateMany({
      data: {
        isPublished: true,
        status: 'Active'
      }
    });

    return NextResponse.json({
      message: "Successfully synchronized all products to live storefront.",
      count: result.count,
      tip: "Your products should now be visible on the Shop page."
    });
  } catch (err: any) {
    console.error("Emergency sync failed:", err);
    return NextResponse.json({
      error: "Could not sync products. This usually means the DATABASE_URL is missing in Vercel.",
      details: err.message
    }, { status: 500 });
  }
}
