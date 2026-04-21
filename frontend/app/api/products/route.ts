import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const sort = searchParams.get('sort');

    let query: any = {};
    if (category && category !== 'All') {
      query.category = category;
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price-low') orderBy = { price: 'asc' };
    if (sort === 'price-high') orderBy = { price: 'desc' };

    const products = await prisma.product.findMany({
      where: query,
      orderBy: orderBy,
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Admin check logic here (e.g., checking JWT from headers)
    const body = await request.json();
    const product = await prisma.product.create({
      data: {
        ...body,
        images: JSON.stringify(body.images),
        sizes: JSON.stringify(body.sizes),
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to create product' }, { status: 500 });
  }
}
