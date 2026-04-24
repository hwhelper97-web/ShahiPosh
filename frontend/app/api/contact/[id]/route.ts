import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await req.json();
    const { id } = params;

    const message = await prisma.contactMessage.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(message);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update message status' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.contactMessage.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Message deleted' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}

// Separate POST for Replying to a message via email
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { replyText, originalMessage, customerEmail, subject } = await req.json();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const replyHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 20px; overflow: hidden; background: #fff;">
        <div style="background: #000; padding: 40px; text-align: center;">
          <h1 style="color: #c5a059; margin: 0; letter-spacing: 5px; font-weight: 900; font-size: 24px;">SHAHIPOSH</h1>
          <p style="color: #fff; text-transform: uppercase; letter-spacing: 2px; font-size: 9px; margin-top: 8px;">Official Response</p>
        </div>
        <div style="padding: 40px; line-height: 1.6; color: #333;">
          <p style="font-size: 16px; margin-bottom: 25px;">${replyText.replace(/\n/g, '<br>')}</p>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #999; font-style: italic;">In response to your inquiry regarding: "${subject}"</p>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 10px; margin-top: 10px; font-size: 13px; color: #666;">
              ${originalMessage}
            </div>
          </div>
        </div>
        <div style="background: #f1f5f9; padding: 20px; text-align: center;">
          <p style="font-size: 11px; color: #94a3b8; margin: 0;">SHAHIPOSH Luxury Retail • Dedicated Support</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"SHAHIPOSH Support" <${process.env.SMTP_FROM}>`,
      to: customerEmail,
      subject: `RE: ${subject}`,
      html: replyHtml,
    });

    // Mark as seen if it was unread
    await prisma.contactMessage.update({
      where: { id },
      data: { status: 'READ' },
    });

    return NextResponse.json({ message: 'Reply sent successfully' });
  } catch (err) {
    console.error('Failed to send reply:', err);
    return NextResponse.json({ error: 'Failed to send reply' }, { status: 500 });
  }
}
