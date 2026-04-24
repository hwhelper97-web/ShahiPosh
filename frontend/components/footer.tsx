'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';
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
            <h2 className="text-2xl font-bold tracking-tighter">{settings.storeName}</h2>
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
              <li><Link href="/shop?category=men" className="hover:text-accent transition-luxury">Men's Collection</Link></li>
              <li><Link href="/shop?category=women" className="hover:text-accent transition-luxury">Women's Collection</Link></li>
              <li><Link href="/shop?category=kids" className="hover:text-accent transition-luxury">Kids' Wear</Link></li>
              <li><Link href="/shop?category=accessories" className="hover:text-accent transition-luxury">Accessories</Link></li>
              <li><Link href="/shop?category=new" className="hover:text-accent transition-luxury">New Arrivals</Link></li>
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
