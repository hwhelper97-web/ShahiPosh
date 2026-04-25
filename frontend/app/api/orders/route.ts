import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(orders);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Generate order number
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber: orderNumber,
        customerName: body.customerName || body.name || 'Guest',
        customerEmail: body.customerEmail || 'guest@example.com',
        customerPhone: body.phone || body.customerPhone || '0000000000',
        shippingAddress: body.address || body.shippingAddress || 'No Address',
        items: body.items || [],
        subtotal: body.subtotal || body.totalPrice || 0,
        totalPrice: body.totalPrice || 0,
        status: 'PENDING',
      },
    });

    // Send Order Receipt Email
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      } as any);

      const itemsHtml = (body.items || []).map((item: any) => `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
            <p style="margin: 0; font-weight: 700; font-size: 14px;">${item.name || 'Product'}</p>
            <p style="margin: 0; font-size: 12px; color: #666;">Qty: ${item.quantity || 1}</p>
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: 700; font-size: 14px;">
            Rs. ${(item.price * (item.quantity || 1)).toLocaleString()}
          </td>
        </tr>
      `).join('');

      const receiptHtml = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 24px; overflow: hidden; background: #fff;">
          <div style="background: #000; padding: 40px; text-align: center;">
            <h1 style="color: #c5a059; margin: 0; letter-spacing: 5px; font-weight: 900; font-size: 24px;">SHAHIPOSH</h1>
            <p style="color: #fff; text-transform: uppercase; letter-spacing: 2px; font-size: 9px; margin-top: 8px; opacity: 0.7;">Official Order Confirmation</p>
          </div>
          <div style="padding: 40px;">
            <div style="text-align: center; margin-bottom: 40px;">
              <h2 style="font-size: 20px; font-weight: 800; margin: 0;">Thank you for your order.</h2>
              <p style="color: #666; font-size: 14px; margin-top: 8px;">Order Number: <span style="color: #000; font-weight: 700;">${orderNumber}</span></p>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
              <thead>
                <tr>
                  <th style="text-align: left; font-size: 10px; font-weight: 900; color: #999; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 10px; border-bottom: 2px solid #000;">Item Details</th>
                  <th style="text-align: right; font-size: 10px; font-weight: 900; color: #999; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 10px; border-bottom: 2px solid #000;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div style="background: #fcfcfc; border-radius: 16px; padding: 25px; margin-bottom: 40px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="font-size: 13px; color: #666;">Subtotal</span>
                <span style="font-size: 13px; font-weight: 700;">Rs. ${(body.totalPrice || 0).toLocaleString()}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="font-size: 13px; color: #666;">Shipping</span>
                <span style="font-size: 13px; font-weight: 700; color: #22c55e;">FREE</span>
              </div>
              <div style="margin-top: 15px; padding-top: 15px; border-top: 2px dashed #eee; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 16px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Total Amount</span>
                <span style="font-size: 24px; font-weight: 900; color: #c5a059;">Rs. ${(body.totalPrice || 0).toLocaleString()}</span>
              </div>
            </div>

            <div style="border: 1px solid #eee; border-radius: 16px; padding: 25px; margin-bottom: 40px;">
              <h3 style="font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 15px 0;">Delivery Address</h3>
              <p style="font-size: 14px; color: #555; margin: 0; line-height: 1.5;">${body.address || body.shippingAddress || 'Standard Delivery'}</p>
            </div>

            <p style="text-align: center; font-size: 13px; color: #666; line-height: 1.6;">Your order is being prepared by our master artisans. You will receive another notification once your package has been dispatched.</p>
          </div>
          <div style="background: #000; padding: 30px; text-align: center;">
            <p style="color: #c5a059; font-size: 11px; font-weight: 700; letter-spacing: 1px; margin: 0;">SHAHIPOSH LUXURY RETAIL</p>
          </div>
        </div>
      `;

      await transporter.sendMail({
        from: `"SHAHIPOSH Orders" <${process.env.SMTP_FROM}>`,
        to: body.customerEmail || 'guest@example.com',
        bcc: 'abidtanha1@gmail.com',
        subject: `Order Confirmation - ${orderNumber}`,
        html: receiptHtml,
      });
      console.log(`[MAIL] Order receipt sent to ${body.customerEmail}`);
    } catch (mailErr) {
      console.error('[MAIL] Receipt mail error:', mailErr);
    }

    return NextResponse.json(order);
  } catch (err: any) {
    console.error('Order creation error:', err);
    return NextResponse.json({ 
      error: 'Failed to create order',
      details: err.message 
    }, { status: 500 });
  }
}
