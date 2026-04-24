import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'shahiposh_customer_secret';

export async function POST(req: Request) {
  try {
    const { provider, email, name, image } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Missing email' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          name: name || 'Valued Customer',
          passwordHash: 'social-login-no-password', // Placeholder
          role: 'CUSTOMER'
        }
      });
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

    return NextResponse.json({ 
      token, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (err: any) {
    console.error('SOCIAL AUTH ERROR:', err);
    return NextResponse.json({ message: 'Social authentication failed' }, { status: 500 });
  }
}
