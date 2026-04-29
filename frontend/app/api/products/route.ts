import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const categoryId = searchParams.get('categoryId');
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

    if (categoryId) {
      const subCategories = await prisma.category.findMany({
        where: { parentId: categoryId },
        select: { id: true }
      });
      const categoryIds = [categoryId, ...subCategories.map(c => c.id)];
      where.categoryId = { in: categoryIds };
    } else if (category && category !== 'All') {
      where.category = {
        OR: [
          { name: category },
          { slug: category }
        ]
      };
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

    // Parse JSON strings for frontend
    const parsedProducts = products.map(p => ({
      ...p,
      images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images,
      tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags,
      attributes: typeof p.attributes === 'string' ? JSON.parse(p.attributes) : p.attributes,
    }));

    return NextResponse.json(parsedProducts);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Generate unique slug
    const timestamp = Date.now().toString().slice(-4);
    const slug = body.slug || `${body.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')}-${timestamp}`;

    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: slug,
        sku: body.sku || `SKU-${Date.now()}`,
        regularPrice: parseFloat(body.price),
        salePrice: body.discountPrice ? parseFloat(body.discountPrice) : null,
        description: body.description || '',
        richDescription: body.description || '', 
        inventory: body.inventory !== undefined ? parseInt(body.inventory) : undefined,
        images: body.images || [], 
        categoryId: body.categoryId,
        status: body.status || "Active",
        isPublished: true, 
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
