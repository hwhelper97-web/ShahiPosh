'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentCategory = searchParams.get('category') || 'All';
  const currentSort = searchParams.get('sort') || 'latest';
  const currentMaxPrice = searchParams.get('maxPrice') || '50000';

  const [price, setPrice] = useState(currentMaxPrice);

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'All' && value !== 'latest') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <aside className="hidden lg:block space-y-10">
      {/* Categories */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Categories</h3>
        <div className="flex flex-col gap-4">
          {['All', 'Men', 'Women', 'Unisex', 'Accessories'].map((cat) => (
            <Link 
              key={cat} 
              href={cat === 'All' ? '/shop' : `/shop?category=${cat}`}
              className="flex items-center gap-3 group cursor-pointer"
            >
              <div className={`w-4 h-4 rounded-full border border-border transition-luxury ${
                currentCategory === cat ? 'bg-accent border-accent' : 'group-hover:border-accent'
              }`} />
              <span className={`text-sm transition-luxury ${
                currentCategory === cat ? 'text-primary font-bold' : 'text-muted-foreground group-hover:text-primary'
              }`}>{cat}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Max Price: Rs {Number(price).toLocaleString()}</h3>
        <div className="space-y-4">
          <input 
            type="range" 
            min="0" 
            max="100000" 
            step="1000"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onMouseUp={() => updateFilters('maxPrice', price)}
            onTouchEnd={() => updateFilters('maxPrice', price)}
            className="w-full accent-accent cursor-pointer" 
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Rs 0</span>
            <span>Rs 100,000+</span>
          </div>
        </div>
      </div>

      {/* Sort By */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Sort By</h3>
        <select 
          value={currentSort}
          onChange={(e) => updateFilters('sort', e.target.value)}
          className="w-full bg-muted border-none rounded-2xl px-4 py-3 text-sm focus:ring-1 focus:ring-accent transition-luxury appearance-none cursor-pointer"
        >
          <option value="latest">Latest Arrivals</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>
    </aside>
  );
}
