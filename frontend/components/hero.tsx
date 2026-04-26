'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useSettings } from './settings-context';

export default function Hero() {
  const { settings } = useSettings();

  return (
    <section className="relative h-screen min-h-[700px] flex items-center overflow-hidden">
      {/* 🌑 Dramatic Cinematic Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      {/* Background Image with Ken Burns Effect */}
      <motion.div 
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
        className="absolute inset-0 z-0"
      >
        <Image
          src={settings.heroBannerImage || "/products/vintage_necklace_1.png"}
          alt="ShahiPosh 4K Artisanal Detail"
          fill
          className="object-cover object-center"
          priority
        />
      </motion.div>

      <div className="container relative z-20 h-full flex flex-col justify-end pb-16 md:pb-24 items-start px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="max-w-2xl space-y-6 md:space-y-10"
        >
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-[1px] bg-accent" />
              <span className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.4em] text-accent">Signature Series</span>
            </div>
            <h1 className="text-white text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] drop-shadow-2xl">
              Timeless <br />
              <span className="text-accent italic font-serif font-light">Elegance.</span>
            </h1>
          </div>

          <Link href="#categories" className="btn-premium px-10 md:px-16 py-4 md:py-6 text-[10px] md:text-xs uppercase tracking-[0.4em] bg-white text-primary border-none hover:bg-accent hover:text-white transition-all duration-700 shadow-2xl">
            Explore Collection
          </Link>
        </motion.div>
      </div>


      {/* 🧊 Glass Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <div className="w-[1px] h-10 bg-gradient-to-b from-transparent via-accent to-transparent animate-pulse" />
        <span className="text-[7px] font-black uppercase tracking-[0.4em] text-white/40">Explore Collection</span>
      </div>
    </section>
  );
}
