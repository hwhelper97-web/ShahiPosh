import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Delete all products named "asdasdas" or with specific test values
    const deleted = await prisma.product.deleteMany({
      where: {
        OR: [
          { name: { contains: 'asdasdas', mode: 'insensitive' } },
          { name: { contains: 'test', mode: 'insensitive' } },
          { id: 'cmoknfxk00001l8042grwpr19' },
          { id: 'cmokngvpn0001la04zfw9brne' }
        ]
      }
    });

    return NextResponse.json({ 
      message: 'Cleanup successful', 
      deletedCount: deleted.count,
      status: 'Ready'
    });
  } catch (error: any) {
    console.error("Cleanup failed:", error);
    return NextResponse.json({ 
      message: 'Cleanup failed', 
      error: error.message 
    }, { status: 500 });
  }
}
