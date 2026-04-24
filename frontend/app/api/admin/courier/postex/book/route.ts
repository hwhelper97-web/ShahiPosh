import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createPostExShipment } from '@/lib/postex';

export async function POST(req: Request) {
  try {
    const { orderId, cityName, city, area } = await req.json();

    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Get API key from settings
    const setting = await prisma.setting.findUnique({
      where: { key: 'postExApiKey' }
    });
    
    const apiKey = setting?.value as string || 'DEMO_KEY';

    const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
    const totalQuantity = (items as any[]).reduce((acc: number, item: any) => acc + item.quantity, 0);

    const booking = await createPostExShipment(apiKey, {
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerAddress: order.shippingAddress,
      cityName: cityName || 'Lahore', // Default to Lahore if missing
      orderDetail: `Order #${order.orderNumber}`,
      orderType: 'Overnight',
      codAmount: order.totalPrice,
      itemsCount: totalQuantity,
      orderRefNumber: order.orderNumber
    });

    if (booking.success) {
      // Update order with tracking ID
      await prisma.order.update({
        where: { id: orderId },
        data: {
          trackingId: booking.trackingNumber,
          courier: 'PostEx',
          status: 'SHIPPED', // Updated to match new status enum or standard
        }
      });
    }

    return NextResponse.json(booking);
  } catch (err: any) {
    console.error('PostEx Booking Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to connect with PostEx' }, { status: 500 });
  }
}
