import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { inventory } = await req.json();

    const product = await prisma.product.update({
      where: { id },
      data: { 
        inventory: parseInt(inventory),
        stockStatus: parseInt(inventory) > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK'
      },
    });

    return NextResponse.json(product);
  } catch (err) {
    console.error('Failed to update product inventory:', err);
    return NextResponse.json({ error: 'Failed to update inventory' }, { status: 500 });
  }
}
