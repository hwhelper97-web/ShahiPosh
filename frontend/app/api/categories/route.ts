import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        parent: {
          select: { name: true }
        },
        _count: {
          select: { products: true }
        }
      }
    });
    return NextResponse.json(categories);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const slug = body.slug || body.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    
    const category = await prisma.category.create({
      data: {
        name: body.name,
        slug: slug,
        description: body.description,
        image: body.image,
        parentId: body.parentId || null
      }
    });
    return NextResponse.json(category);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
