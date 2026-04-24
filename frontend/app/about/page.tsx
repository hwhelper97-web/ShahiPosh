'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Award, Heart, Globe, Shield, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
import { useSettings } from '@/components/settings-context';

const storyImages = [
  "/craftsmanship_embroidery_detail_1777052936374.png",
  "/craftsmanship_workshop_shahi_posh_1.png",
  "/artisan_studio_wide_shahi_posh_1.png"
];

const missionImages = [
  "/modern_pakistani_fashion_model_1.png",
  "/elegant_woman_confidence_shahi_posh_1.png",
  "/luxurious_textile_detail_shahi_posh_1.png"
];

export default function AboutPage() {
  const { settings } = useSettings();
  const [storyIndex, setStoryIndex] = useState(0);
  const [missionIndex, setMissionIndex] = useState(0);

  useEffect(() => {
    const storyInterval = setInterval(() => {
      setStoryIndex((prev) => (prev + 1) % storyImages.length);
    }, 6000);
    const missionInterval = setInterval(() => {
      setMissionIndex((prev) => (prev + 1) % missionImages.length);
    }, 7000);
    return () => {
      clearInterval(storyInterval);
      clearInterval(missionInterval);
    };
  }, []);

  return (
    <div className="bg-background pt-32 pb-20">
      {/* Hero Section */}
      <section className="container mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent mb-4 block">Our Story</span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-none">
              Crafting <br />
              <span className="text-accent italic font-serif">Confidence.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Founded with a passion for excellence, SHAHIPOSH is more than a fashion house. It is a sanctuary of craftsmanship where traditional artistry meets modern sensibilities. Our journey began with a simple belief: that clothing should be a reflection of one's inner strength and elegance.
            </p>
            <div className="flex gap-12 pt-4">
              <div>
                <p className="text-3xl font-bold tracking-tighter">15k+</p>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Global Clients</p>
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tighter">1,200+</p>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Masterpieces</p>
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tighter">100+</p>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Artisans</p>
              </div>
            </div>
          </motion.div>

          <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-muted shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={storyIndex}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image 
                  src={storyImages[storyIndex]} 
                  alt="Story Gallery" 
                  fill 
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
            <div className="absolute bottom-10 right-10 flex gap-2 z-20">
              {storyImages.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-all duration-500 ${i === storyIndex ? 'bg-white w-8' : 'bg-white/30'}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="container py-32 border-y border-border/50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1 relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl">
            <Image 
              src="/craftsman_at_work_1777052950909.png" 
              alt="Artisan at work" 
              fill 
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <p className="absolute bottom-10 left-10 text-white font-bold uppercase tracking-widest text-xs">The Hands of SHAHIPOSH</p>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-4xl font-bold tracking-tighter mb-8 italic font-serif">The Art of the Stitch</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Every garment we create is a testament to the thousands of hours our master artisans spend perfecting their craft. From the delicate beadwork on our bridal collections to the precise tailoring of our formal wear, we ensure that every thread tells a story of dedication.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We specialize in premium female clothing, where each silhouette is designed to empower. Our craftsmen utilize age-old techniques—Zardozi, Resham work, and intricate hand-embroidery—to create pieces that are not just worn, but cherished as heirlooms.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container py-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold tracking-tighter mb-10 leading-tight"
          >
            "We're not just making clothes; we're crafting the <span className="text-accent italic font-serif">confidence</span> to be yourself."
          </motion.h2>
          <div className="w-20 h-1 bg-accent mx-auto rounded-full" />
        </div>
      </section>

      {/* Dynamic Gallery Section */}
      <section className="container pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 relative aspect-[16/9] rounded-[3rem] overflow-hidden shadow-2xl bg-muted">
            <AnimatePresence mode="wait">
              <motion.div
                key={missionIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0"
              >
                <Image 
                  src={missionImages[missionIndex]} 
                  alt="Mission Gallery" 
                  fill 
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
            <div className="absolute bottom-12 left-12">
               <p className="text-white text-xs font-bold uppercase tracking-[0.4em] mb-2 opacity-70">Experience Luxury</p>
               <h3 className="text-white text-3xl font-bold tracking-tighter">The Vision of ShahiPosh</h3>
            </div>
          </div>
          <div className="lg:col-span-4 grid grid-cols-1 gap-8">
            <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-lg">
               <Image src="/craftsmanship_jewelry_shahi_posh_1.png" alt="Jewelry Detail" fill className="object-cover" />
            </div>
            <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-lg">
               <Image src="/female_formal_wear_detail_1777052964566.png" alt="Formal Wear" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Follow Our Journey Section */}
      <section className="container py-32 border-t border-border/50">
        <div className="flex flex-col items-center text-center">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent mb-6 block">Stay Connected</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-10">Follow Our Journey</h2>
          
          <div className="flex flex-wrap justify-center gap-8">
            {settings.instagramUrl && (
              <a 
                href={settings.instagramUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-4 group"
              >
                <div className="w-20 h-20 rounded-[2rem] border border-border flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-luxury shadow-sm group-hover:shadow-xl group-hover:-translate-y-2">
                  <Instagram size={32} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">Instagram</span>
              </a>
            )}
            {settings.facebookUrl && (
              <a 
                href={settings.facebookUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-4 group"
              >
                <div className="w-20 h-20 rounded-[2rem] border border-border flex items-center justify-center group-hover:bg-[#1877F2] group-hover:text-white transition-luxury shadow-sm group-hover:shadow-xl group-hover:-translate-y-2">
                  <Facebook size={32} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">Facebook</span>
              </a>
            )}
            {settings.twitterUrl && (
              <a 
                href={settings.twitterUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-4 group"
              >
                <div className="w-20 h-20 rounded-[2rem] border border-border flex items-center justify-center group-hover:bg-black group-hover:text-white transition-luxury shadow-sm group-hover:shadow-xl group-hover:-translate-y-2">
                  <Twitter size={32} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">Twitter / X</span>
              </a>
            )}
            {settings.youtubeUrl && (
              <a 
                href={settings.youtubeUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-4 group"
              >
                <div className="w-20 h-20 rounded-[2rem] border border-border flex items-center justify-center group-hover:bg-[#FF0000] group-hover:text-white transition-luxury shadow-sm group-hover:shadow-xl group-hover:-translate-y-2">
                  <Youtube size={32} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">YouTube</span>
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
