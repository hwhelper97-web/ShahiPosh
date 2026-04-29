'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export default function Collections() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          setCategories([]);
        }
      })
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="py-24 flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-widest text-accent animate-pulse">Syncing Collections...</p>
    </div>
  );

  return (
    <section id="categories" className="py-20 md:py-32 bg-[#faf9f6]">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6 px-4 md:px-0">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-[1px] bg-accent" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">Curation</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-primary">Signature Collections</h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-xl font-medium">Explore our meticulously handcrafted collections, where timeless tradition meets contemporary luxury.</p>
          </div>
          <Link href="/shop" className="group flex items-center gap-3 px-8 py-4 bg-white border border-border rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all duration-500 shadow-sm">
            View All Archives
            <span className="group-hover:translate-x-2 transition-transform">→</span>
          </Link>
        </div>

        {/* Mobile Horizontal Scroll / Desktop Grid - Now 4 columns */}
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 overflow-x-auto md:overflow-x-visible pb-12 md:pb-0 px-4 md:px-0 snap-x no-scrollbar">
          {categories.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="min-w-[70vw] md:min-w-0 snap-center relative overflow-hidden rounded-[2rem] group cursor-pointer shadow-lg"
            >
              <div className="aspect-[4/5] bg-muted relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10 opacity-70 group-hover:opacity-90 transition-opacity duration-700" />
                <Image
                  src={item.image ? (item.image.startsWith('http') || item.image.startsWith('/') ? item.image : `/categories/${item.image}`) : '/products/traditional_shawl_hero.png'}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
              </div>
              
              <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 z-20">
                <div className="translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-accent text-[8px] font-black uppercase tracking-[0.4em] mb-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100">Handcrafted</p>
                  <h3 className="text-white text-xl md:text-2xl font-extrabold mb-6 tracking-tighter leading-tight">{item.name}</h3>
                </div>
                <Link href={`/shop?category=${item.slug}`} className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-accent hover:text-white transition-all duration-500 shadow-2xl opacity-0 group-hover:opacity-100">
                  Explore
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

