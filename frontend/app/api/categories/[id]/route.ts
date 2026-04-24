import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const category = await prisma.category.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        image: body.image
      }
    });
    return NextResponse.json(category);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.category.delete({
      where: { id }
    });
    return NextResponse.json({ message: 'Category deleted' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
