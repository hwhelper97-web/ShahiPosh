import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST() {
  try {
    // This API could perform a global stock check or reset.
    // For now, it will ensure all products have at least 1 unit if they are 'IN_STOCK'
    // but the actual logic would typically involve syncing with a warehouse API.
    
    await prisma.product.updateMany({
      where: { 
        stockStatus: 'IN_STOCK',
        inventory: { lt: 0 }
      },
      data: { inventory: 0 }
    });

    return NextResponse.json({ message: 'Bulk sync complete' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to perform bulk sync' }, { status: 500 });
  }
}
