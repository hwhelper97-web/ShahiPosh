import { getProducts } from '@/lib/api';
import { ProductCard } from '@/components/product-card';
import { SlidersHorizontal } from 'lucide-react';
import { SearchInput } from '@/components/search-input';
import { FilterSidebar } from '@/components/filter-sidebar';
import { Suspense } from 'react';

async function ShopContent({ searchParams }: { searchParams: any }) {
  const paramsObj = await searchParams;

  const params = new URLSearchParams();
  if (paramsObj.category) params.set('category', paramsObj.category);
  if (paramsObj.sort) params.set('sort', paramsObj.sort);
  if (paramsObj.q) params.set('q', paramsObj.q);
  if (paramsObj.minPrice) params.set('minPrice', paramsObj.minPrice);
  if (paramsObj.maxPrice) params.set('maxPrice', paramsObj.maxPrice);

  const products = await getProducts(params);

  return (
    <div className="container">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div>
          <h1 className="text-5xl font-bold tracking-tighter mb-4">The Collection</h1>
          <p className="text-muted-foreground">Discover our latest pieces, crafted for the modern wardrobe.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <SearchInput />
          <button className="p-3 bg-muted rounded-full hover:bg-accent hover:text-white transition-luxury lg:hidden">
            <SlidersHorizontal size={20} />
          </button>
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <FilterSidebar />

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {products.length === 0 ? (
            <div className="py-20 text-center bg-muted/30 rounded-[3rem] border border-dashed border-border">
              <p className="text-muted-foreground">No products found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {/* Pagination Placeholder */}
          <div className="mt-20 flex justify-center gap-2">
            <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-luxury bg-primary text-white">1</button>
            <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-luxury">2</button>
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