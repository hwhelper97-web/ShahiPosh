'use client';

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    name: "Sarah Ahmed",
    role: "Fashion Blogger",
    text: "The quality of the silk sherwani I ordered was beyond my expectations. ShahiPosh is now my go-to for all traditional wear.",
    rating: 5,
    avatar: "/avatar1.jpg"
  },
  {
    name: "Omar Malik",
    role: "Groom",
    text: "Meticulous craftsmanship and perfect fit. The team went above and beyond to ensure my wedding outfit was perfect.",
    rating: 5,
    avatar: "/avatar2.jpg"
  },
  {
    name: "Ayesha Khan",
    role: "Regular Customer",
    text: "Minimalist luxury at its best. Their cotton kurtas are incredibly comfortable and stylish for daily wear.",
    rating: 5,
    avatar: "/avatar3.jpg"
  }
];

export default function Testimonials() {
  return (
    <section className="py-32 bg-muted/30">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent mb-4 block">Kind Words</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">Client Experiences</h2>
          <p className="text-muted-foreground leading-relaxed">Join thousands of satisfied customers who have chosen ShahiPosh for their most important moments.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-[3rem] shadow-sm border border-border relative group hover:shadow-xl transition-luxury"
            >
              <div className="absolute top-10 right-10 text-accent/10 group-hover:text-accent/20 transition-luxury">
                <Quote size={60} fill="currentColor" />
              </div>
              
              <div className="flex gap-1 mb-6">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={14} className="fill-accent text-accent" />
                ))}
              </div>

              <p className="text-lg font-medium leading-relaxed mb-8 relative z-10 italic">
                "{t.text}"
              </p>

              <div className="flex items-center gap-4 border-t border-border pt-8">
                <div className="w-12 h-12 rounded-full bg-muted overflow-hidden relative">
                  {/* Avatar Image */}
                </div>
                <div>
                  <p className="text-sm font-bold">{t.name}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
