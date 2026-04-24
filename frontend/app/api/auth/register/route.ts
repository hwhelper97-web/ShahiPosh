import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { name, email, phone, password } = await req.json();

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        phone,
        passwordHash: hashedPassword,
      },
    });

    // Send Welcome Email
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const welcomeHtml = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 20px; overflow: hidden; background: #fff;">
          <div style="background: #000; padding: 40px; text-align: center;">
            <h1 style="color: #c5a059; margin: 0; letter-spacing: 5px; font-weight: 900; font-size: 28px;">SHAHIPOSH</h1>
            <p style="color: #fff; text-transform: uppercase; letter-spacing: 3px; font-size: 10px; margin-top: 10px; opacity: 0.8;">The World of Luxury Craftsmanship</p>
          </div>
          <div style="padding: 40px; line-height: 1.6; color: #333;">
            <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 20px;">Welcome to the Inner Circle, ${name}.</h2>
            <p style="font-size: 16px; margin-bottom: 25px;">We are delighted to have you join us. At SHAHIPOSH, we don't just create clothing; we craft pieces that celebrate your individuality and confidence.</p>
            <div style="background: #fcf8f1; border-left: 4px solid #c5a059; padding: 20px; margin-bottom: 30px;">
              <p style="margin: 0; font-size: 14px; font-weight: 600; color: #c5a059;">YOUR MEMBER PRIVILEGES:</p>
              <ul style="margin: 10px 0 0 20px; padding: 0; font-size: 14px; color: #666;">
                <li>Early access to new collections</li>
                <li>Exclusive member-only events</li>
                <li>Faster checkout and order tracking</li>
                <li>Personal styling consultations</li>
              </ul>
            </div>
            <p style="font-size: 14px; color: #666; margin-bottom: 30px;">Your account is now active. Explore our latest arrivals and experience the pinnacle of Pakistani craftsmanship.</p>
            <a href="http://localhost:3000/shop" style="display: inline-block; background: #000; color: #fff; padding: 18px 35px; text-decoration: none; border-radius: 50px; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Start Exploring</a>
          </div>
          <div style="padding: 40px; background: #f9f9f9; border-top: 1px solid #eee; text-align: center;">
            <p style="font-size: 12px; color: #999; margin: 0;">Need assistance? Contact our concierge at</p>
            <p style="font-size: 14px; font-weight: 700; color: #333; margin: 5px 0 20px;">info@shahiposh.com • +92 300 1234567</p>
            <div style="display: flex; justify-content: center; gap: 20px;">
              <span style="font-size: 12px; color: #c5a059; font-weight: 700;">INSTAGRAM</span>
              <span style="font-size: 12px; color: #c5a059; font-weight: 700;">FACEBOOK</span>
            </div>
          </div>
        </div>
      `;

      await transporter.sendMail({
        from: `"SHAHIPOSH" <${process.env.SMTP_FROM}>`,
        to: normalizedEmail,
        cc: 'abidtanha1@gmail.com',
        subject: 'Welcome to the World of SHAHIPOSH',
        html: welcomeHtml,
      });
      console.log(`[MAIL] Welcome email sent to ${normalizedEmail}`);
    } catch (mailErr) {
      console.error('[MAIL] Welcome mail error:', mailErr);
    }

    return NextResponse.json({ 
      id: user.id, 
      name: user.name, 
      email: user.email,
      phone: user.phone
    });
  } catch (err) {
    console.error('Registration error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
