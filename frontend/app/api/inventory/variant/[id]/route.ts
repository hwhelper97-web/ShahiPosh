import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { inventory } = await req.json();
    const { id } = params;

    const variant = await prisma.productVariant.update({
      where: { id },
      data: { inventory: parseInt(inventory) },
    });

    // Also update parent product's stock status if necessary
    // (Optional: depending on business logic)

    return NextResponse.json(variant);
  } catch (err) {
    console.error('Failed to update variant inventory:', err);
    return NextResponse.json({ error: 'Failed to update inventory' }, { status: 500 });
  }
}
