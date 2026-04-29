'use client';

import { motion } from 'framer-motion';
import { HelpCircle, ChevronRight, MessageCircle, Truck, CreditCard, RotateCcw } from 'lucide-react';

export default function FAQPage() {
  const faqs = [
    {
      category: "Shipping & Delivery",
      icon: Truck,
      items: [
        { q: "How long does delivery take?", a: "Domestic orders typically arrive within 3-5 business days. International shipping varies by location but generally takes 7-14 business days." },
        { q: "Do you offer free shipping?", a: "Yes, we offer free domestic shipping on all orders above Rs 5,000." }
      ]
    },
    {
      category: "Orders & Payments",
      icon: CreditCard,
      items: [
        { q: "What payment methods do you accept?", a: "We accept Cash on Delivery (COD), Credit/Debit Cards, and popular digital wallets like JazzCash and EasyPaisa." },
        { q: "Can I cancel my order?", a: "Orders can be cancelled within 24 hours of placement, provided they haven't been shipped yet." }
      ]
    },
    {
      category: "Returns & Exchanges",
      icon: RotateCcw,
      items: [
        { q: "What is your return policy?", a: "We offer a 14-day return and exchange policy for unworn items in their original packaging." },
        { q: "How do I initiate a return?", a: "Please contact our support team via the Contact Us page or WhatsApp to start your return process." }
      ]
    }
  ];

  return (
    <div className="bg-background min-h-screen pt-32 pb-20">
      <div className="container max-w-4xl">
        <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest mb-12">
          <a href="/" className="hover:text-primary transition-luxury">Home</a>
          <ChevronRight size={12} />
          <span className="text-primary font-bold">FAQs</span>
        </div>

        <div className="text-center mb-20">
          <div className="w-20 h-20 bg-accent/10 rounded-[2rem] flex items-center justify-center text-accent mx-auto mb-8">
            <HelpCircle size={40} strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl md:text-7xl font-bold tracking-tighter mb-6">Common Questions</h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Everything you need to know about ShahiPosh artisanship, service, and delivery.
          </p>
        </div>

        <div className="space-y-16">
          {faqs.map((group, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg">
                  <group.icon size={20} />
                </div>
                <h2 className="text-xl font-bold uppercase tracking-widest">{group.category}</h2>
              </div>

              <div className="grid gap-4">
                {group.items.map((faq, i) => (
                  <div key={i} className="bg-white p-8 rounded-3xl border border-border hover:shadow-xl transition-luxury group">
                    <h3 className="text-lg font-bold mb-3 group-hover:text-accent transition-colors">{faq.q}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{faq.a}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 p-12 bg-primary rounded-[3rem] text-center text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
            <p className="text-white/60 mb-8 max-w-md mx-auto font-medium">Our artisans and support team are here to help you find the perfect piece.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="/contact" className="px-10 py-4 bg-accent text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-primary transition-luxury">Contact Us</a>
              <a href="#" className="px-10 py-4 bg-white/10 backdrop-blur-md text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/20 transition-luxury flex items-center justify-center gap-2">
                <MessageCircle size={16} /> WhatsApp
              </a>
            </div>
          </div>
          <div className="absolute right-[-5%] top-[-10%] w-[40%] h-[120%] bg-white/5 skew-x-12 -z-0 blur-3xl pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
