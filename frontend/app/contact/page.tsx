'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
import { useSettings } from '@/components/settings-context';

export default function ContactPage() {
  const { settings } = useSettings();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert("Message sent! Our team will contact you soon.");
        setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
      } else {
        const data = await res.json();
        alert(`Failed to send message: ${data.error || 'Please try again.'}`);
      }
    } catch (err) {
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background pt-32 pb-20">
      <div className="container px-5 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-[1px] bg-accent" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">Liaison</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
            We'd Love to <br />
            <span className="text-accent italic font-serif font-light">Hear From You.</span>
          </h1>
          <p className="text-sm md:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto font-medium">
            Have a question about our artisanal products, bespoke sizing, or an existing order? Our dedicated vault support is here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20">
          {/* Contact Info */}
          <div className="lg:col-span-5 space-y-10 md:space-y-16">
            <div className="space-y-8 md:space-y-12">
              <div className="flex gap-6 items-start group">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white border border-border flex items-center justify-center flex-shrink-0 shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <Mail size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 text-primary">Secure Mail</h3>
                  <p className="text-sm md:text-base text-muted-foreground font-bold hover:text-accent transition-colors">{settings.storeEmail}</p>
                </div>
              </div>

              <div className="flex gap-6 items-start group">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white border border-border flex items-center justify-center flex-shrink-0 shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <Phone size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 text-primary">Direct Line</h3>
                  <p className="text-sm md:text-base text-muted-foreground font-bold hover:text-accent transition-colors">{settings.storePhone}</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-accent mt-2">Available Mon - Sat</p>
                </div>
              </div>

              <div className="flex gap-6 items-start group">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white border border-border flex items-center justify-center flex-shrink-0 shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <MapPin size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 text-primary">Main Atelier</h3>
                  <p className="text-sm md:text-base text-muted-foreground font-bold whitespace-pre-line leading-relaxed">{settings.storeAddress}</p>
                </div>
              </div>
            </div>

            <div className="pt-12 border-t border-border">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-primary">Digital Presence</h3>
              <div className="flex gap-4">
                {[
                  { icon: Instagram, url: settings.instagramUrl },
                  { icon: Facebook, url: settings.facebookUrl },
                  { icon: Twitter, url: settings.twitterUrl },
                  { icon: Youtube, url: settings.youtubeUrl }
                ].map((social, i) => social.url && (
                  <a key={i} href={social.url} target="_blank" className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white border border-border flex items-center justify-center hover:bg-accent hover:text-white transition-all shadow-sm active:scale-90">
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 md:p-16 rounded-[3rem] shadow-2xl border border-border relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full translate-x-10 -translate-y-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-1000" />
              
              <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Your Identity</label>
                    <input 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Name" 
                      className="w-full bg-[#faf9f6] border border-border rounded-2xl px-6 py-4 md:py-5 text-sm focus:ring-2 focus:ring-accent/20 outline-none transition-all shadow-inner font-bold" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Communication Link</label>
                    <input 
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Email" 
                      className="w-full bg-[#faf9f6] border border-border rounded-2xl px-6 py-4 md:py-5 text-sm focus:ring-2 focus:ring-accent/20 outline-none transition-all shadow-inner font-bold" 
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Inquiry Type</label>
                  <div className="relative">
                    <select 
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-[#faf9f6] border border-border rounded-2xl px-6 py-4 md:py-5 text-sm focus:ring-2 focus:ring-accent/20 outline-none transition-all shadow-inner font-bold appearance-none cursor-pointer"
                    >
                      <option>General Inquiry</option>
                      <option>Order Support</option>
                      <option>Bespoke Request</option>
                      <option>Wholesale</option>
                      <option>Press & Media</option>
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                      <Send size={14} className="rotate-90" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Message Content</label>
                  <textarea 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How may we assist you today?" 
                    rows={6}
                    className="w-full bg-[#faf9f6] border border-border rounded-3xl px-6 py-6 text-sm focus:ring-2 focus:ring-accent/20 outline-none transition-all shadow-inner font-medium leading-relaxed" 
                  />
                </div>

                <button 
                  disabled={loading}
                  className="btn-premium w-full py-5 md:py-6 flex items-center justify-center gap-4 disabled:opacity-50 group/btn shadow-xl shadow-accent/10"
                >
                  <Send size={18} className="group-hover/btn:-translate-y-1 group-hover/btn:translate-x-1 transition-transform" />
                  <span className="font-black uppercase tracking-[0.2em] text-[11px]">{loading ? 'Transmitting...' : 'Send Message'}</span>
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Map Section - Premium Framing */}
      <section className="container px-5 md:px-8 mt-24 md:mt-40">
        <div className="w-full h-[400px] md:h-[600px] bg-muted rounded-[3.5rem] overflow-hidden relative shadow-inner border border-border">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none z-10" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground z-0 space-y-4">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg animate-pulse">
              <MapPin size={28} className="text-accent" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40">
              Interactive Atelier Map
            </p>
          </div>
        </div>
      </section>
    </div>

    </div>
  );
}