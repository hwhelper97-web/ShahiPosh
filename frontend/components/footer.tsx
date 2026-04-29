'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, ShieldCheck } from 'lucide-react';
import { useSettings } from './settings-context';
import Logo from './logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { settings } = useSettings();

  return (
    <footer className="bg-muted pt-20 md:pt-32 pb-10">
      <div className="container px-5 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16 mb-20">
          {/* Brand Info */}
          <div className="flex flex-col gap-8">
            <Logo size="md" className="!items-start" />
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs font-medium">
              {settings.footerAboutText}
            </p>
            <div className="flex gap-4">
              {[
                { icon: Instagram, url: settings.instagramUrl },
                { icon: Facebook, url: settings.facebookUrl },
                { icon: Twitter, url: settings.twitterUrl },
                { icon: Youtube, url: settings.youtubeUrl }
              ].map((social, i) => social.url && (
                <a key={i} href={social.url} target="_blank" className="w-12 h-12 rounded-2xl bg-white border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm active:scale-90">
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Shop</h3>
            <ul className="flex flex-col gap-5 text-sm text-muted-foreground font-medium">
              <li><Link href="/shop?category=embroidered-dupatta" className="hover:text-accent transition-colors">Embroidered Dupatta</Link></li>
              <li><Link href="/shop?category=luxury-khaddar-shawl" className="hover:text-accent transition-colors">Luxury Khaddar Shawl</Link></li>
              <li><Link href="/shop?category=chunri-dupatta" className="hover:text-accent transition-colors">Chunri Dupatta</Link></li>
              <li><Link href="/shop?category=velvet-embroidered-shawl" className="hover:text-accent transition-colors">Velvet Embroidered Shawl</Link></li>
              <li><Link href="/shop?category=vintage-jewelry" className="hover:text-accent transition-colors">Vintage Jewelry</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="flex flex-col gap-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Support</h3>
            <ul className="flex flex-col gap-5 text-sm text-muted-foreground font-medium">
              <li><Link href="/contact" className="hover:text-accent transition-colors">Contact Us</Link></li>
              <li><Link href="/policies/shipping" className="hover:text-accent transition-colors">Shipping Policy</Link></li>
              <li><Link href="/policies/returns" className="hover:text-accent transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/faq" className="hover:text-accent transition-colors">FAQs</Link></li>
              <li><Link href="/size-guide" className="hover:text-accent transition-colors">Size Guide</Link></li>
            </ul>
          </div>


        </div>

        <div className="pt-10 border-t border-border flex flex-col lg:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            © {currentYear} {settings.storeName}. All Rights Reserved.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            <Link href="/policies/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="/policies/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="/admin/login" className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-border hover:text-primary transition-colors">
              <ShieldCheck size={14} className="text-accent" />
              <span>Vault Access</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>

  );
}
