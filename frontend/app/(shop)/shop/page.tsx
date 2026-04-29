import { ProductCard } from '@/components/product-card';
import { SlidersHorizontal } from 'lucide-react';
import { SearchInput } from '@/components/search-input';
import { FilterSidebar } from '@/components/filter-sidebar';
import { Suspense } from 'react';
import prisma from '@/lib/prisma';

async function ShopContent({ searchParams }: { searchParams: any }) {
  const paramsObj = await searchParams;

  const category = paramsObj.category;
  const sort = paramsObj.sort;
  const q = paramsObj.q;
  const minPrice = parseFloat(paramsObj.minPrice || '0');
  const maxPrice = parseFloat(paramsObj.maxPrice || '999999');

  let where: any = {
    isPublished: true,
    regularPrice: { gte: minPrice, lte: maxPrice }
  };

  if (category && category !== 'All') {
    where.category = {
      OR: [
        { name: category },
        { slug: category }
      ]
    };
  }

  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } }
    ];
  }

  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'price_low') orderBy = { regularPrice: 'asc' };
  if (sort === 'price_high') orderBy = { regularPrice: 'desc' };

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: { category: true }
  }) as any[];

  return (
    <div className="container px-5 md:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12 md:mb-20">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-[1px] bg-accent" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">Archives</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none">The Collection</h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-md font-medium">Discover our latest pieces, crafted for the modern wardrobe with artisanal excellence.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="w-full sm:w-80">
            <SearchInput />
          </div>
          <button className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-muted rounded-2xl hover:bg-accent hover:text-white transition-luxury lg:hidden text-[10px] font-black uppercase tracking-widest">
            <SlidersHorizontal size={18} />
            Filters
          </button>
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-16">
        <div className="hidden lg:block">
          <FilterSidebar />
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {products.length === 0 ? (
            <div className="py-24 text-center bg-muted/30 rounded-[3.5rem] border-2 border-dashed border-border/50">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">No matches in our archives.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-x-4 md:gap-x-10 gap-y-12 md:gap-y-20">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="mt-24 flex justify-center items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center text-xs font-black shadow-xl shadow-primary/20">1</div>
            <div className="w-12 h-12 rounded-2xl bg-white border-2 border-border flex items-center justify-center text-xs font-black hover:border-accent hover:text-accent transition-all cursor-pointer">2</div>
            <div className="w-12 h-12 rounded-2xl bg-white border-2 border-border flex items-center justify-center text-xs font-black hover:border-accent hover:text-accent transition-all cursor-pointer">→</div>
          </div>
        </div>
      </div>
    </div>

  );
}

export default function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  return (
    <div className="bg-background min-h-screen pt-32 pb-20">
      <Suspense fallback={<div className="container py-20 text-center">Loading collection...</div>}>
        <ShopContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}