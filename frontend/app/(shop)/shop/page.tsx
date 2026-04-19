import { getProducts } from '@/lib/api';
import { ProductCard } from '@/components/product-card';

export default async function ShopPage({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  const params = new URLSearchParams();
  if (searchParams.category) params.set('category', searchParams.category);
  if (searchParams.sort === 'price') params.set('sort', 'price_asc');
  if (searchParams.q) params.set('q', searchParams.q);

  const products = await getProducts(params);

  return (
    <div className="container py-10">
      <h1 className="mb-6 text-3xl font-semibold">Shop</h1>
      <form className="mb-8 grid gap-4 md:grid-cols-4">
        <input name="q" placeholder="Search product" className="rounded-xl border border-white/20 bg-transparent px-3 py-2" />
        <select name="category" className="rounded-xl border border-white/20 bg-black px-3 py-2">
          <option value="">All Categories</option>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="New Arrival">New Arrival</option>
        </select>
        <select name="size" className="rounded-xl border border-white/20 bg-black px-3 py-2">
          <option value="">All Sizes</option>
          <option value="S">S</option><option value="M">M</option><option value="L">L</option>
        </select>
        <select name="sort" className="rounded-xl border border-white/20 bg-black px-3 py-2">
          <option value="latest">Latest</option>
          <option value="price">Price Low-High</option>
        </select>
        <button className="rounded-xl bg-accent px-4 py-2 text-black md:col-span-4">Apply Filters</button>
      </form>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
