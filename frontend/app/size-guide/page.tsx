'use client';

import { motion } from 'framer-motion';
import { Ruler, ChevronRight, Info } from 'lucide-react';

export default function SizeGuidePage() {
  const tables = [
    {
      title: "Women's Collection",
      subtitle: "Shawls & Dupattas",
      data: [
        { s: 'S', c: '34-36', w: '28-30', h: '35-37' },
        { s: 'M', c: '38-40', w: '32-34', h: '39-41' },
        { s: 'L', c: '42-44', w: '36-38', h: '43-45' },
        { s: 'XL', c: '46-48', w: '40-42', h: '47-49' },
      ]
    },
    {
      title: "Jewelry Size Guide",
      subtitle: "Necklaces & Accessories",
      data: [
        { s: 'Choker', c: '14-16', w: 'N/A', h: 'N/A' },
        { s: 'Princess', c: '17-19', w: 'N/A', h: 'N/A' },
        { s: 'Matinee', c: '20-24', w: 'N/A', h: 'N/A' },
        { s: 'Opera', c: '28-36', w: 'N/A', h: 'N/A' },
      ]
    }
  ];

  return (
    <div className="bg-background min-h-screen pt-32 pb-20">
      <div className="container max-w-4xl">
        <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest mb-12">
          <a href="/" className="hover:text-primary transition-luxury">Home</a>
          <ChevronRight size={12} />
          <span className="text-primary font-bold">Size Guide</span>
        </div>

        <div className="text-center mb-20">
          <div className="w-20 h-20 bg-accent/10 rounded-[2rem] flex items-center justify-center text-accent mx-auto mb-8">
            <Ruler size={40} strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl md:text-7xl font-bold tracking-tighter mb-6">Perfect Fit</h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Our sizing is carefully designed to ensure comfort and elegance across all our handcrafted pieces.
          </p>
        </div>

        <div className="space-y-16">
          {tables.map((table, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-10 md:p-16 rounded-[3rem] border border-border shadow-xl overflow-hidden"
            >
              <div className="mb-10">
                <h2 className="text-2xl font-bold mb-2 tracking-tighter">{table.title}</h2>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">{table.subtitle}</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Size</th>
                      <th className="py-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Chest (in)</th>
                      <th className="py-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Waist (in)</th>
                      <th className="py-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Hips (in)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {table.data.map((row) => (
                      <tr key={row.s} className="hover:bg-muted/30 transition-luxury">
                        <td className="py-6 text-sm font-bold">{row.s}</td>
                        <td className="py-6 text-sm text-muted-foreground">{row.c}</td>
                        <td className="py-6 text-sm text-muted-foreground">{row.w}</td>
                        <td className="py-6 text-sm text-muted-foreground">{row.h}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 p-8 bg-muted rounded-[2rem] flex gap-6 items-start">
          <div className="p-3 bg-white rounded-xl shadow-sm text-accent shrink-0">
            <Info size={24} />
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-bold uppercase tracking-widest">How to measure</h4>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
              For the most accurate results, measure yourself in your undergarments. Use a flexible measuring tape, kept horizontal, and measure the fullest part of your chest, waist, and hips.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
