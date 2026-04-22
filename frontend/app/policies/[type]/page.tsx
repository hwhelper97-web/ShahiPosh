'use client';

import { use } from 'react';
import { motion } from 'framer-motion';
import { Shield, Truck, RotateCcw, Lock, ChevronRight } from 'lucide-react';

export default function PolicyPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = use(params);

  const content: any = {
    returns: {
      title: "Returns & Exchanges",
      icon: RotateCcw,
      text: "We want you to be completely satisfied with your purchase. If for any reason you're not happy, you can return or exchange your items within 14 days of delivery. The items must be unworn, with all original tags attached and in their original packaging.",
      sections: [
        { title: "How to Return", content: "To initiate a return, please visit our 'Contact Us' page or email returns@shahiposh.com with your order number." },
        { title: "Exchanges", content: "We offer free exchanges for size issues. For other exchanges, shipping fees may apply." },
        { title: "Refunds", content: "Once we receive and inspect your return, we will process your refund within 5-7 business days to your original payment method." }
      ]
    },
    shipping: {
      title: "Shipping Policy",
      icon: Truck,
      text: "SHAHIPOSH provides premium shipping services nationwide and internationally. We take great care in packaging our products to ensure they arrive in perfect condition.",
      sections: [
        { title: "Domestic Shipping", content: "Free shipping on orders above Rs 5,000. For orders below, a flat rate of Rs 250 applies. Delivery takes 3-5 business days." },
        { title: "International Shipping", content: "We ship worldwide. Rates and delivery times vary by destination and are calculated at checkout." },
        { title: "Order Tracking", content: "Once your order is shipped, you will receive a tracking number via email and SMS." }
      ]
    },
    privacy: {
      title: "Privacy Policy",
      icon: Lock,
      text: "Your privacy is of utmost importance to us. We are committed to protecting the personal information you share with us while using our website.",
      sections: [
        { title: "Data Collection", content: "We only collect information necessary to process your orders and improve your shopping experience." },
        { title: "Data Protection", content: "We use industry-standard encryption and security measures to protect your data from unauthorized access." },
        { title: "Third Parties", content: "We never sell your data to third parties. We only share information with partners essential for order fulfillment (e.g., shipping carriers)." }
      ]
    },
    terms: {
      title: "Terms of Service",
      icon: Shield,
      text: "By using the SHAHIPOSH website, you agree to comply with and be bound by the following terms and conditions of use.",
      sections: [
        { title: "Intellectual Property", content: "All content on this site, including designs, images, and text, is the property of SHAHIPOSH and protected by copyright laws." },
        { title: "Pricing", content: "We reserve the right to change prices and product availability without notice." },
        { title: "User Accounts", content: "You are responsible for maintaining the confidentiality of your account information." }
      ]
    }
  };

  const data = content[type] || content['terms'];
  const Icon = data.icon;

  return (
    <div className="bg-background min-h-screen pt-32 pb-20">
      <div className="container max-w-4xl">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest mb-12">
          <a href="/" className="hover:text-primary transition-luxury">Home</a>
          <ChevronRight size={12} />
          <span className="text-primary font-bold">Policies</span>
          <ChevronRight size={12} />
          <span className="text-primary font-bold">{data.title}</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-12 md:p-20 rounded-[3rem] shadow-xl border border-border"
        >
          <div className="flex flex-col items-center text-center mb-16">
            <div className="w-20 h-20 bg-accent/10 rounded-[2rem] flex items-center justify-center text-accent mb-8">
              <Icon size={40} strokeWidth={1.5} />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">{data.title}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              {data.text}
            </p>
          </div>

          <div className="space-y-12">
            {data.sections.map((section: any, idx: number) => (
              <div key={idx} className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-accent flex items-center gap-4">
                  <span className="w-8 h-px bg-accent/30" />
                  {section.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed pl-12">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-20 pt-12 border-t border-border text-center">
            <p className="text-sm text-muted-foreground mb-6">Still have questions?</p>
            <a href="/contact" className="btn-outline inline-block px-12">Contact Support</a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}