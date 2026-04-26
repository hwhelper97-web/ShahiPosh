'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, ShieldCheck, Crown } from 'lucide-react';
import { useSettings } from './settings-context';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { settings } = useSettings();

  return (
    <footer className="bg-muted pt-20 pb-10">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="group relative flex flex-col items-start w-fit">
              <div className="flex items-baseline relative">
                {/* Wordmark Part 1: Shahi */}
                <span 
                  style={{ fontFamily: "'Outfit', sans-serif" }} 
                  className="text-2xl font-black tracking-[-0.05em] text-primary uppercase relative"
                >
                  Shahi
                  <span className="absolute -top-0.5 right-[1px] w-1 h-1 bg-accent rounded-full" />
                </span>
                
                {/* Wordmark Part 2: Posh */}
                <span 
                  style={{ fontFamily: "'Playfair Display', serif" }} 
                  className="text-2xl font-light text-accent italic tracking-tighter -ml-1"
                >
                  Posh
                </span>
              </div>
              <div className="w-full h-[1.5px] bg-accent/20 mt-1" />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              {settings.footerAboutText}
            </p>
            <div className="flex gap-4">
              {settings.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-luxury">
                  <Instagram size={18} />
                </a>
              )}
              {settings.facebookUrl && (
                <a href={settings.facebookUrl} target="_blank" className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-luxury">
                  <Facebook size={18} />
                </a>
              )}
              {settings.twitterUrl && (
                <a href={settings.twitterUrl} target="_blank" className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-luxury">
                  <Twitter size={18} />
                </a>
              )}
              {settings.youtubeUrl && (
                <a href={settings.youtubeUrl} target="_blank" className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-luxury">
                  <Youtube size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Shop</h3>
            <ul className="flex flex-col gap-4 text-sm text-muted-foreground">
              <li><Link href="/shop?category=embroidered-dupatta" className="hover:text-accent transition-luxury">Embroidered Dupatta</Link></li>
              <li><Link href="/shop?category=luxury-khaddar-shawl" className="hover:text-accent transition-luxury">Luxury Khaddar Shawl</Link></li>
              <li><Link href="/shop?category=chunri-dupatta" className="hover:text-accent transition-luxury">Chunri Dupatta</Link></li>
              <li><Link href="/shop?category=velvet-embroidered-shawl" className="hover:text-accent transition-luxury">Velvet Embroidered Shawl</Link></li>
              <li><Link href="/shop?category=vintage-jewelry" className="hover:text-accent transition-luxury">Vintage Jewelry</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="flex flex-col gap-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Support</h3>
            <ul className="flex flex-col gap-4 text-sm text-muted-foreground">
              <li><Link href="/contact" className="hover:text-accent transition-luxury">Contact Us</Link></li>
              <li><Link href="/policies/shipping" className="hover:text-accent transition-luxury">Shipping Policy</Link></li>
              <li><Link href="/policies/returns" className="hover:text-accent transition-luxury">Returns & Exchanges</Link></li>
              <li><Link href="/faq" className="hover:text-accent transition-luxury">FAQs</Link></li>
              <li><Link href="/size-guide" className="hover:text-accent transition-luxury">Size Guide</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Newsletter</h3>
            <p className="text-muted-foreground text-sm">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <div className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-background border border-border rounded-full px-6 py-3 text-sm focus:outline-none focus:border-accent transition-luxury"
              />
              <button className="btn-premium w-full">Subscribe</button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-muted-foreground">
            © {currentYear} {settings.storeName}. All rights reserved.
          </p>
          <div className="flex items-center gap-8 text-xs text-muted-foreground">
            <Link href="/policies/privacy" className="hover:text-primary transition-luxury">Privacy Policy</Link>
            <Link href="/policies/terms" className="hover:text-primary transition-luxury">Terms of Service</Link>
            {/* Secure Admin Access Icon */}
            <Link href="/admin/login" className="flex items-center gap-1 hover:text-primary transition-luxury ml-4">
              <ShieldCheck size={14} />
              <span>Admin Login</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
