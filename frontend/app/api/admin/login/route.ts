import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'shahiposh_secret_key_123';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Missing credentials' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    console.log('Enterprise login attempt for:', normalizedEmail);

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      console.log('User not found in DB:', normalizedEmail);
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Check if user has admin/staff roles
    const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'STAFF', 'MANAGER'];
    if (!allowedRoles.includes(user.role)) {
      console.log('Unauthorized role access attempt:', user.role);
      return NextResponse.json({ message: 'Access denied: Insufficient permissions' }, { status: 403 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      console.log('Invalid password for:', normalizedEmail);
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    return NextResponse.json({ 
      token, 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

  } catch (err: any) {
    console.error('Enterprise login error:', err.message || err);
    return NextResponse.json({ 
      message: 'System error during authentication' 
    }, { status: 500 });
  }
}
