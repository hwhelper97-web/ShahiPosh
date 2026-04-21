'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Award, Heart, Globe, Shield } from 'lucide-react';

export default function AboutPage() {
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
              Modern Elegance. <br />
              <span className="text-accent italic font-serif">Timeless Quality.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Founded in 2024, SHAHIPOSH was born out of a desire to create a clothing brand that celebrates minimalist luxury and high-quality craftsmanship. We believe that true style is effortless and timeless.
            </p>
            <div className="flex gap-12 pt-4">
              <div>
                <p className="text-3xl font-bold tracking-tighter">10k+</p>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Happy Clients</p>
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tighter">500+</p>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Unique Designs</p>
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tighter">50+</p>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Craftspeople</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative aspect-square rounded-[3rem] overflow-hidden bg-muted shadow-2xl"
          >
            <Image 
              src="/about-hero.jpg" 
              alt="Our Story" 
              fill 
              className="object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-muted py-32 overflow-hidden">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl font-bold tracking-tighter mb-6">Our Core Values</h2>
            <p className="text-muted-foreground">The principles that guide everything we do, from design to delivery.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Award, title: "Quality First", desc: "We use only the finest fabrics and materials, ensuring every piece lasts for years." },
              { icon: Heart, title: "Ethical Sourcing", desc: "Our commitment to fair labor practices and ethical manufacturing is unwavering." },
              { icon: Globe, title: "Sustainable", desc: "We are constantly evolving our processes to minimize our environmental footprint." },
              { icon: Shield, title: "Customer Care", desc: "Your satisfaction is our priority. We provide seamless support and returns." }
            ].map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-luxury group"
              >
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-luxury text-accent">
                  <value.icon size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-10 leading-tight">
            "We're not just making clothes; we're crafting the <span className="text-accent italic font-serif">confidence</span> to be yourself."
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto rounded-full" />
        </div>
      </section>

      {/* Team/Visual Grid */}
      <section className="container pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-muted">
            <Image src="/gallery-1.jpg" alt="Gallery" fill className="object-cover" />
          </div>
          <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-muted mt-12">
            <Image src="/gallery-2.jpg" alt="Gallery" fill className="object-cover" />
          </div>
          <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-muted">
            <Image src="/gallery-3.jpg" alt="Gallery" fill className="object-cover" />
          </div>
        </div>
      </section>
    </div>
  );
}
