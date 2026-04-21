import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    // Admin check logic here
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const order = await prisma.order.create({
      data: {
        customerName: body.customerName,
        phone: body.phone,
        address: body.address,
        totalPrice: body.totalPrice,
        items: body.items, // JSON field
      },
    });
    return NextResponse.json(order);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to create order' }, { status: 500 });
  }
}
