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
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent mb-4 block">Get In Touch</span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-none">
            We'd Love to <br />
            <span className="text-accent italic font-serif">Hear From You.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Have a question about our products, sizing, or an order? Our dedicated support team is here to help you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Contact Info */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-8">
              <div className="flex gap-6 items-start group">
                <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center flex-shrink-0 group-hover:bg-accent group-hover:text-white transition-luxury">
                  <Mail size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-2">Email Us</h3>
                  <p className="text-muted-foreground hover:text-primary transition-luxury">{settings.storeEmail}</p>
                </div>
              </div>

              <div className="flex gap-6 items-start group">
                <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center flex-shrink-0 group-hover:bg-accent group-hover:text-white transition-luxury">
                  <Phone size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-2">Call Us</h3>
                  <p className="text-muted-foreground hover:text-primary transition-luxury">{settings.storePhone}</p>
                  <p className="text-muted-foreground text-xs mt-1">Mon - Sat: 9:00 AM - 6:00 PM</p>
                </div>
              </div>

              <div className="flex gap-6 items-start group">
                <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center flex-shrink-0 group-hover:bg-accent group-hover:text-white transition-luxury">
                  <MapPin size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-2">Visit Us</h3>
                  <p className="text-muted-foreground whitespace-pre-line">{settings.storeAddress}</p>
                </div>
              </div>
            </div>

            <div className="pt-10 border-t border-border">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Follow Our Journey</h3>
              <div className="flex gap-4">
                {settings.instagramUrl && (
                  <a href={settings.instagramUrl} target="_blank" className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-luxury">
                    <Instagram size={20} />
                  </a>
                )}
                {settings.facebookUrl && (
                  <a href={settings.facebookUrl} target="_blank" className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-luxury">
                    <Facebook size={20} />
                  </a>
                )}
                {settings.twitterUrl && (
                  <a href={settings.twitterUrl} target="_blank" className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-luxury">
                    <Twitter size={20} />
                  </a>
                )}
                {settings.youtubeUrl && (
                  <a href={settings.youtubeUrl} target="_blank" className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-luxury">
                    <Youtube size={20} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-12 rounded-[3rem] shadow-xl border border-border"
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-4">Your Name</label>
                    <input 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe" 
                      className="w-full bg-muted border-none rounded-2xl px-6 py-4 text-sm focus:ring-1 focus:ring-accent transition-luxury" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-4">Email Address</label>
                    <input 
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com" 
                      className="w-full bg-muted border-none rounded-2xl px-6 py-4 text-sm focus:ring-1 focus:ring-accent transition-luxury" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-4">Subject</label>
                  <select 
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-muted border-none rounded-2xl px-6 py-4 text-sm focus:ring-1 focus:ring-accent transition-luxury appearance-none"
                  >
                    <option>General Inquiry</option>
                    <option>Order Support</option>
                    <option>Wholesale</option>
                    <option>Press & Media</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-4">Your Message</label>
                  <textarea 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we help you?" 
                    rows={6}
                    className="w-full bg-muted border-none rounded-2xl px-6 py-4 text-sm focus:ring-1 focus:ring-accent transition-luxury" 
                  />
                </div>

                <button 
                  disabled={loading}
                  className="btn-premium w-full py-5 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  <Send size={18} />
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Map Section Placeholder */}
      <section className="container mt-32">
        <div className="w-full h-[400px] bg-muted rounded-[3rem] overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <p className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <MapPin size={20} />
              Interactive Map Placeholder
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}