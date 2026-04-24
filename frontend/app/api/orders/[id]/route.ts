import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id: id },
      include: { user: true }
    });
    return NextResponse.json(order);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const order = await prisma.order.update({
      where: { id: id },
      data: body
    });
    return NextResponse.json(order);
  } catch (err) {
    console.error('Order update error:', err);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.order.delete({
      where: { id: id }
    });
    return NextResponse.json({ message: 'Order deleted' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
