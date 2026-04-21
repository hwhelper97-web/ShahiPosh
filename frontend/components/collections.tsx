'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const collections = [
  {
    title: "Men's Wear",
    subtitle: "Tailored for Perfection",
    image: "/collection-men.jpg", // Placeholder path
    href: "/shop?category=men",
    size: "large"
  },
  {
    title: "Women's Collection",
    subtitle: "Grace & Elegance",
    image: "/collection-women.jpg", // Placeholder path
    href: "/shop?category=women",
    size: "small"
  },
  {
    title: "Kids' Style",
    subtitle: "Comfort Meets Cool",
    image: "/collection-kids.jpg", // Placeholder path
    href: "/shop?category=kids",
    size: "small"
  }
];

export default function Collections() {
  return (
    <section id="collections" className="py-24">
      <div className="container">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-bold tracking-tight mb-4">Our Collections</h2>
            <p className="text-muted-foreground">Explore our curated selections for every occasion.</p>
          </div>
          <Link href="/shop" className="text-sm font-bold uppercase tracking-widest hover:text-accent transition-luxury">
            View All collections →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className={`relative overflow-hidden rounded-3xl group cursor-pointer ${
                item.size === 'large' ? 'lg:col-span-1 lg:row-span-1' : ''
              }`}
            >
              <div className="aspect-[4/5] bg-muted relative">
                {/* Image Placeholder */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-luxury group-hover:scale-110"
                />
              </div>
              
              <div className="absolute bottom-0 left-0 w-full p-8 z-20">
                <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-2">{item.subtitle}</p>
                <h3 className="text-white text-2xl font-bold mb-4">{item.title}</h3>
                <Link href={item.href} className="inline-block bg-white text-primary px-6 py-2 rounded-full text-sm font-medium hover:bg-accent hover:text-white transition-luxury">
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
