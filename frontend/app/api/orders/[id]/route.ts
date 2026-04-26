import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id: id },
      include: { user: true }
    });

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    const parsedOrder = {
      ...order,
      items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items,
      timeline: typeof order.timeline === 'string' ? JSON.parse(order.timeline) : order.timeline,
    };

    return NextResponse.json(parsedOrder);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const data: any = { ...body };
    if (body.items) data.items = JSON.stringify(body.items);
    if (body.timeline) data.timeline = JSON.stringify(body.timeline);

    const order = await prisma.order.update({
      where: { id: id },
      data: data
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
