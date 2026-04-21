import { getProducts } from '@/lib/api';
import { ProductCard } from '@/components/product-card';
import { Filter, ChevronDown, SlidersHorizontal } from 'lucide-react';

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const paramsObj = await searchParams;

  const params = new URLSearchParams();
  if (paramsObj.category) params.set('category', paramsObj.category);
  if (paramsObj.sort === 'price') params.set('sort', 'price_asc');
  if (paramsObj.q) params.set('q', paramsObj.q);

  const products = await getProducts(params);

  return (
    <div className="bg-background min-h-screen pt-32 pb-20">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-bold tracking-tighter mb-4">The Collection</h1>
            <p className="text-muted-foreground">Discover our latest pieces, crafted for the modern wardrobe.</p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <input 
                name="q" 
                placeholder="Search products..." 
                className="w-full bg-muted border-none rounded-full px-6 py-3 text-sm focus:ring-1 focus:ring-accent transition-luxury"
              />
            </div>
            <button className="p-3 bg-muted rounded-full hover:bg-accent hover:text-white transition-luxury">
              <SlidersHorizontal size={20} />
            </button>
          </div>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block space-y-10">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Categories</h3>
              <div className="flex flex-col gap-4">
                {['All', 'Men', 'Women', 'Kids', 'Accessories', 'New Arrival'].map((cat) => (
                  <label key={cat} className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-4 h-4 rounded-full border border-border group-hover:border-accent transition-luxury" />
                    <span className="text-sm text-muted-foreground group-hover:text-primary transition-luxury">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Price Range</h3>
              <div className="space-y-4">
                <input type="range" className="w-full accent-accent" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Rs 0</span>
                  <span>Rs 50,000+</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Sort By</h3>
              <select className="w-full bg-muted border-none rounded-2xl px-4 py-3 text-sm focus:ring-1 focus:ring-accent transition-luxury appearance-none">
                <option value="latest">Latest Arrivals</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {products.length === 0 ? (
              <div className="py-20 text-center">
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
              <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-luxury">3</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}