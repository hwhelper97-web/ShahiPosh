'use client';

import { useEffect, useState } from "react";
import { getProducts } from "@/lib/api";
import { ProductCard } from "@/components/product-card";
import Hero from "@/components/hero";
import Collections from "@/components/collections";
import Testimonials from "@/components/testimonials";
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
      
      <Collections />

      {/* Featured Products */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 text-center md:text-left">
            <div>
              <h2 className="text-4xl font-bold tracking-tight mb-2">Featured Products</h2>
              <p className="text-muted-foreground">Our handpicked selection of the season's must-haves.</p>
            </div>
            <Link href="/shop" className="btn-outline">
              View All Shop
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-muted rounded-2xl mb-4" />
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/2" />
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

      <Testimonials />

      {/* Newsletter Section */}
      <section className="py-24 bg-primary text-white overflow-hidden relative">
        <div className="container relative z-10">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Join the SHAHIPOSH <span className="text-accent italic font-serif">Insider.</span>
            </h2>
            <p className="text-white/70 mb-10 leading-relaxed">
              Subscribe to get early access to new drops, exclusive offers, and the latest style news directly to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 bg-white/10 border border-white/20 rounded-full px-8 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-accent transition-luxury"
              />
              <button className="btn-accent px-10">Subscribe</button>
            </div>
          </div>
        </div>
        
        {/* Decorative background element */}
        <div className="absolute right-0 top-0 w-1/3 h-full bg-white/5 skew-x-12 -z-0" />
      </section>
    </main>
  );
}