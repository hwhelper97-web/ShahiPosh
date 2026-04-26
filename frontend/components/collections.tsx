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
      .then(data => setCategories(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="py-24 flex items-center justify-center">
      <Loader2 className="animate-spin text-accent" size={40} />
    </div>
  );

  return (
    <section id="collections" className="py-24">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-bold tracking-tight mb-4">Our Collections</h2>
            <p className="text-muted-foreground">Explore our curated selections for every occasion.</p>
          </div>
          <Link href="/shop" className="text-sm font-bold uppercase tracking-widest hover:text-accent transition-luxury">
            View All collections →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-[2.5rem] group cursor-pointer"
            >
              <div className="aspect-[4/5] bg-muted relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-60 group-hover:opacity-80 transition-opacity" />
                <Image
                  src={item.image ? (item.image.startsWith('http') || item.image.startsWith('/') ? item.image : `/categories/${item.image}`) : '/products/traditional_shawl_hero.png'}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
              </div>
              
              <div className="absolute bottom-0 left-0 w-full p-8 z-20">
                <p className="text-accent text-[10px] font-black uppercase tracking-[0.3em] mb-2">Signature Series</p>
                <h3 className="text-white text-3xl font-bold mb-6 tracking-tight">{item.name}</h3>
                <Link href={`/categories/${item.slug}`} className="inline-block bg-white text-primary px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-accent hover:text-white transition-all duration-500 shadow-xl">
                  Explore Now
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
