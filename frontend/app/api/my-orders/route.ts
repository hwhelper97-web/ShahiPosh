import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone');

    if (!phone) {
      return NextResponse.json({ message: 'Phone number required' }, { status: 400 });
    }

    const orders = await prisma.order.findMany({
      where: { customerPhone: phone },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(orders);
  } catch (err) {
    console.error('Fetch orders error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
