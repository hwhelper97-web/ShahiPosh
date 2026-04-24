import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id: id },
      include: { category: true, vendor: true }
    });

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.product.delete({
      where: { id: id },
    });
    return NextResponse.json({ message: 'Product deleted' });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete product' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const updated = await prisma.product.update({
      where: { id: id },
      data: {
        name: body.name,
        regularPrice: body.price !== undefined ? parseFloat(body.price) : undefined,
        salePrice: body.discountPrice !== undefined ? (body.discountPrice ? parseFloat(body.discountPrice) : null) : undefined,
        description: body.description,
        images: body.images,
        categoryId: body.categoryId,
        inventory: body.inventory !== undefined ? parseInt(body.inventory) : undefined,
        status: body.status,
        sku: body.sku,
        tags: body.tags,
        attributes: body.attributes
      },
    });
    
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Update failed:", error);
    return NextResponse.json({ 
      message: 'Failed to update product',
      details: error.message 
    }, { status: 500 });
  }
}
