import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    console.log('[CONTACT] Received submission request');
    const body = await req.json();
    console.log('[CONTACT] Body:', JSON.stringify(body));
    
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      console.error('[CONTACT] Validation failed: Missing fields');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log('[CONTACT] Attempting DB create...');
    const contact = await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject: subject || 'General Inquiry',
        message
      }
    });
    console.log('[CONTACT] DB Create success:', contact.id);

    // Email Sending
    try {
      console.log('[CONTACT] Initializing Nodemailer...');
      console.log('[CONTACT] SMTP Config:', {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER,
        from: process.env.SMTP_FROM
      });

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        timeout: 10000 // 10 seconds timeout
      });

      console.log('[CONTACT] Sending mail...');
      await transporter.sendMail({
        from: `"${name}" <${process.env.SMTP_FROM}>`,
        to: process.env.SMTP_USER,
        replyTo: email,
        subject: `[Contact Form] ${subject || 'New Inquiry'}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333; border: 1px solid #c5a059; border-radius: 10px;">
            <h2 style="color: #c5a059; border-bottom: 2px solid #c5a059; padding-bottom: 10px;">New Inquiry from ShahiPosh</h2>
            <div style="margin-top: 20px;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject}</p>
            </div>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-line;">${message}</p>
            </div>
          </div>
        `,
      });
      console.log(`[CONTACT] Real email sent to info@shahiposh.com`);
    } catch (mailErr) {
      console.error('[CONTACT] Nodemailer error:', mailErr);
      // We still return success if DB saved
    }

    return NextResponse.json({ message: 'Message sent successfully', id: contact.id });
  } catch (err: any) {
    console.error('[CONTACT] CRITICAL ERROR:', err.message, err.stack);
    return NextResponse.json({ error: 'Failed to send message: ' + err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(messages);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}
