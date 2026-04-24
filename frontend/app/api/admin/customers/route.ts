import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const customers = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });
    return NextResponse.json(customers);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}
