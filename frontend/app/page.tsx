'use client';

import { useEffect, useState } from "react";
import { getProducts } from "@/lib/api";
import { ProductCard } from "@/components/product-card";
import Hero from "@/components/hero";
import Collections from "@/components/collections";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <Hero />
      
      <div id="collections">
        <Collections />
      </div>

      {/* Featured Products */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container px-5 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12 md:mb-16">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-[1px] bg-accent" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">Trending</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">Featured Pieces</h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-sm font-medium">Our handpicked selection of the season's must-haves, curated for the modern aristocrat.</p>
            </div>
            <Link href="/shop" className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-widest hover:text-accent transition-luxury">
              View All Shop
              <span className="group-hover:translate-x-2 transition-transform">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-10 gap-y-12 md:gap-y-20">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse space-y-4">
                  <div className="aspect-[3/4] bg-muted rounded-[2.5rem]" />
                  <div className="h-4 bg-muted rounded-full w-3/4 mx-1" />
                  <div className="h-3 bg-muted rounded-full w-1/2 mx-1" />
                </div>
              ))
            ) : (
              products.slice(0, 8).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Newsletter - Premium High Contrast */}
      <section className="py-20 md:py-32 bg-primary overflow-hidden relative">
        <div className="container px-5 md:px-8 relative z-10">
          <div className="max-w-2xl space-y-10">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-[1px] bg-accent" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">Newsletter</span>
              </div>
              <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-white leading-[0.9]">
                Join the <span className="text-accent italic font-serif font-light">Insider.</span>
              </h2>
              <p className="text-sm md:text-lg text-white/60 max-w-md font-medium leading-relaxed">
                Subscribe to get early access to new drops, exclusive offers, and the latest style news directly to your vault.
              </p>
            </div>

            <form className="flex flex-col sm:flex-row gap-4 max-w-md">
              <input 
                type="email" 
                placeholder="Exquisite Email Address" 
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent transition-all shadow-inner"
              />
              <button className="btn-premium bg-accent text-white hover:bg-white hover:text-primary px-10">Subscribe</button>
            </form>
          </div>
        </div>
        
        {/* Abstract Branding Elements */}
        <div className="absolute right-[-10%] top-[-10%] w-[50%] h-[120%] bg-white/5 skew-x-12 -z-0 blur-3xl pointer-events-none" />
        <div className="absolute left-[-5%] bottom-[-5%] w-[30%] h-[60%] bg-accent/5 -skew-x-12 -z-0 blur-2xl pointer-events-none" />
      </section>

    </main>
  );
}