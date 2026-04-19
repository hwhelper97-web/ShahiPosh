'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ProductCard } from '@/components/product-card';
import { Product } from '@/lib/types';
import { useEffect, useState } from 'react';
import { getProducts } from '@/lib/api';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then((p) => setProducts(p.slice(0, 6))).catch(() => setProducts([]));
  }, []);

  return (
    <div>
      <section className="relative flex min-h-[88vh] items-center justify-center overflow-hidden bg-gradient-to-b from-black via-zinc-950 to-bg text-center">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="container space-y-6">
          <h1 className="text-5xl font-semibold md:text-7xl">ShahiPosh</h1>
          <p className="text-xl text-white/70">Wear Royalty</p>
          <Link href="/shop" className="inline-block rounded-full bg-accent px-8 py-3 font-medium text-black">Shop Now</Link>
        </motion.div>
      </section>

      <section className="container py-16">
        <h2 className="mb-6 text-2xl font-semibold">Featured Collections</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {['Men', 'Women', 'New Arrival'].map((c) => (
            <div key={c} className="card p-8 text-center text-xl">{c}</div>
          ))}
        </div>
      </section>

      <section className="container py-16">
        <h2 className="mb-6 text-2xl font-semibold">Trending Products</h2>
        <div className="grid gap-6 md:grid-cols-3">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      </section>

      <section className="container grid gap-6 py-16 md:grid-cols-2">
        <div className="card p-8">
          <h2 className="mb-3 text-2xl font-semibold">Brand Story</h2>
          <p className="text-white/70">ShahiPosh blends heritage craftsmanship with modern luxury, delivering timeless silhouettes for those who lead with confidence.</p>
        </div>
        <div className="card p-8">
          <h2 className="mb-3 text-2xl font-semibold">Testimonials</h2>
          <p className="text-white/70">“The quality and fit are unmatched. Premium feel from packaging to fabric.”</p>
        </div>
      </section>

      <section className="container py-16">
        <div className="card p-8 text-center">
          <h2 className="text-2xl font-semibold">Join the Royal Circle</h2>
          <p className="mb-4 text-white/60">Get first access to drops and exclusive offers.</p>
          <input placeholder="Enter your email" className="rounded-full border border-white/20 bg-transparent px-4 py-2" />
        </div>
      </section>
    </div>
  );
}
