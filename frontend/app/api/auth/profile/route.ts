import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(req: Request) {
  try {
    const { id, name, phone } = await req.json();

    const user = await prisma.user.update({
      where: { id },
      data: { name, phone },
    });

    return NextResponse.json(user);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Account deleted' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
  }
}
