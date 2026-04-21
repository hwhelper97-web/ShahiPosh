import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH || '');
    if (!ok) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET || 'secret', { expiresIn: '12h' });
    return NextResponse.json({ token });
  } catch (error) {
    return NextResponse.json({ message: 'Login failed' }, { status: 500 });
  }
}
