'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[700px] flex items-center overflow-hidden">
      {/* Background Image/Video Placeholder */}
      <div className="absolute inset-0 z-0 bg-[#f3f3f3]">
        {/* You can replace this with a real image once you have one */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-transparent z-10" />
      </div>

      <div className="container relative z-20">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] mb-4 text-accent">
              New Collection 2026
            </span>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-none mb-8">
              Elegance in <br />
              <span className="text-accent italic font-serif">Every Stitch.</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed max-w-lg">
              Discover the ShahiPosh experience. Premium fabrics, timeless designs, and unmatched quality for the modern lifestyle.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/shop" className="btn-premium">
                Shop Collection
              </Link>
              <Link href="/about" className="btn-outline">
                Our Story
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Element */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-[60%] h-[80%] bg-accent/5 rounded-full blur-3xl -z-10"
      />
    </section>
  );
}
