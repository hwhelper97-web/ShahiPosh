'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Search, User, Menu, X, Heart, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchOverlay from './search-overlay';
import { useSettings } from './settings-context';
import { useCart } from './cart-context';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { settings } = useSettings();
  const { cart } = useCart();
  const [isAdmin, setIsAdmin] = useState(false);

  const cartItemsCount = cart.reduce((acc: number, item: any) => acc + item.quantity, 0);

  useEffect(() => {
    const adminToken = localStorage.getItem('admin_token');
    if (adminToken) setIsAdmin(true);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Categories', href: '/#categories' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];




  // Calculate total height of top bars
  const ayatBarHeight = 32; // h-8 = 32px
  const promoBarHeight = settings.topBarMessage ? 32 : 0;
  const totalTopOffset = ayatBarHeight + promoBarHeight;

  return (
    <>
      {/* 1. Ayat ul Kursi Scrolling Bar */}
      <div className="relative w-full bg-gradient-to-r from-primary via-accent to-primary text-white py-1.5 z-[60] overflow-hidden border-b border-accent/20 shadow-lg">
        <div className="whitespace-nowrap animate-marquee-reverse inline-block font-arabic text-[14px] md:text-[16px] drop-shadow-md">
          <span className="mx-8 opacity-90 hover:opacity-100 transition-opacity">اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ</span>
          <span className="mx-8 opacity-90 hover:opacity-100 transition-opacity">اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ</span>
        </div>
      </div>

      {/* 2. Top Announcement Bar */}
      {settings.topBarMessage && (
        <div className="relative w-full bg-accent text-white py-2 z-[60] text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-center">
          {settings.topBarMessage}
        </div>
      )}

      <nav
        className={`relative w-full z-50 transition-all duration-300 py-5 md:py-6 bg-white border-b border-border shadow-sm`}
      >
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between">
            {/* MOBILE ONLY: Menu Toggle (Left) */}
            <div className="flex md:hidden flex-1 justify-start">
              <button
                className="hover:text-accent transition-luxury"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* 🏆 FULL WORDMARK LUXURY LOGO: Left on Desktop, Center on Mobile */}
            <div className="flex flex-[2] md:flex-initial justify-center md:justify-start">
              <Link href="/" className="group relative flex flex-col items-center md:items-start">
                <div className="flex items-baseline relative">
                  {/* Wordmark Part 1: Shahi */}
                  <span 
                    className="text-2xl md:text-4xl font-bold tracking-tight text-primary uppercase relative font-logo"
                  >
                    Shahi
                    {/* Decorative Dot over 'i' */}
                    <span className="absolute -top-1 right-[2px] w-1 h-1 md:w-1.5 md:h-1.5 bg-accent rounded-full shadow-[0_0_10px_rgba(197,160,89,0.5)] transition-all duration-500 group-hover:scale-150" />
                  </span>
                  
                  {/* Wordmark Part 2: Posh */}
                  <span 
                    className="text-2xl md:text-4xl font-light text-accent italic tracking-tighter -ml-1 md:-ml-2 font-logo"
                  >
                    Posh
                  </span>
                </div>

                {/* ✨ CSS Royal Underline */}
                <div className="relative w-full h-[2px] md:h-[3px] mt-1 md:mt-2 overflow-hidden rounded-full">
                  <div className="absolute inset-0 bg-muted/20" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-full bg-accent group-hover:w-full transition-all duration-700" />
                </div>

                {/* Subtitle / Tagline (Hidden on smaller screens) */}
                <span className="hidden md:block text-[8px] font-black uppercase tracking-[0.5em] text-muted-foreground/40 mt-1 pl-1 transition-colors duration-500 group-hover:text-accent">
                  Luxury Artisanship
                </span>
              </Link>
            </div>

            {/* DESKTOP NAVIGATION: Center */}
            <div className="hidden md:flex flex-1 justify-center items-center gap-8 lg:gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-[14px] font-medium uppercase tracking-[0.08em] hover:text-accent transition-luxury whitespace-nowrap"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* ACTION ICONS: Right (Desktop and Mobile) */}
            <div className="flex flex-1 items-center justify-end gap-3 md:gap-5">
              {isAdmin && (
                <Link href="/admin" className="hidden lg:flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-[10px] font-black uppercase tracking-widest border border-accent/20 hover:bg-accent hover:text-white transition-all duration-500">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                  Admin
                </Link>
              )}
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="hover:text-accent transition-luxury hidden sm:block"
              >
                <Search size={20} strokeWidth={2} />
              </button>
              <Link href="/wishlist" className="hover:text-accent transition-luxury hidden sm:block">
                <Heart size={20} strokeWidth={2} />
              </Link>
              <Link href="/dashboard" className="hover:text-accent transition-luxury hidden sm:block">
                <User size={20} strokeWidth={2} />
              </Link>
              <Link href="/cart" className="relative group">
                <ShoppingBag size={20} strokeWidth={2} className="group-hover:text-accent transition-luxury" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center text-white animate-in zoom-in">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="md:hidden fixed top-0 left-0 w-full h-screen bg-white z-[100] p-8 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-12">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="group relative flex flex-col items-start">
                  <div className="flex items-baseline relative">
                    <span className="text-2xl font-bold tracking-tight text-primary uppercase relative font-logo">
                      Shahi
                      <span className="absolute -top-0.5 right-[1px] w-1 h-1 bg-accent rounded-full" />
                    </span>
                    <span className="text-2xl font-light text-accent italic tracking-tighter -ml-1 font-logo">
                      Posh
                    </span>
                  </div>
                  <div className="w-full h-[2px] bg-accent/20 mt-1" />
                </Link>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X size={28} />
                </button>
              </div>
              <div className="flex flex-col gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-[14px] font-medium uppercase tracking-[0.08em] hover:text-accent transition-luxury"
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="pt-8 border-t border-border mt-4 flex flex-col gap-6">
                  <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest">
                    <User size={20} /> My Account
                  </Link>
                  <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest">
                    <Heart size={20} /> Wishlist
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}