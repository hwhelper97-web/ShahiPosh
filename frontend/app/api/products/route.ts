import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const sort = searchParams.get('sort');
    const q = searchParams.get('q');
    const isAdmin = searchParams.get('admin') === 'true';
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999');

    let where: any = {
      regularPrice: { gte: minPrice, lte: maxPrice }
    };

    if (!isAdmin) {
      where.isPublished = true;
    }

    if (category && category !== 'All') {
      where.category = { name: category };
    }

    if (q) {
      where.OR = [
        { name: { contains: q } },
        { description: { contains: q } }
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_low') orderBy = { regularPrice: 'asc' };
    if (sort === 'price_high') orderBy = { regularPrice: 'desc' };

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: { 
        category: true,
        variants: true
      }
    });
    return NextResponse.json(products);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Generate slug if not provided
    const slug = body.slug || body.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: slug,
        sku: body.sku || `SKU-${Date.now()}`,
        regularPrice: parseFloat(body.price),
        salePrice: body.discountPrice ? parseFloat(body.discountPrice) : null,
        description: body.description || '',
        richDescription: body.description || '', // Placeholder for now
        inventory: parseInt(body.inventory) || 0,
        images: body.images || [], // Prisma Json handles arrays
        categoryId: body.categoryId,
        status: body.status || "Active",
        tags: body.tags || [],
        attributes: body.attributes || {},
      },
    });
    return NextResponse.json(product);
  } catch (err: any) {
    console.error('Product Creation Error:', err);
    return NextResponse.json({ 
      error: 'Failed to create product',
      details: err.message 
    }, { status: 500 });
  }
}
