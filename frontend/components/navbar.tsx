'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, User, Menu, X, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchOverlay from './search-overlay';
import { useSettings } from './settings-context';
import { useCart } from './cart-context';

import Logo from './logo';

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

  return (
    <>
      {/* 1. Ayat ul Kursi Scrolling Bar - Optimized for Mobile Performance */}
      <div className="relative w-full bg-gradient-to-r from-primary via-accent to-primary text-white py-2 z-[60] overflow-hidden border-b border-accent/20">
        <div className="whitespace-nowrap animate-marquee-reverse inline-block font-arabic text-[12px] md:text-[15px]">
          <span className="mx-4 md:mx-8">اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ</span>
          <span className="mx-4 md:mx-8">اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ</span>
        </div>
      </div>

      {/* 2. Top Announcement Bar */}
      {settings.topBarMessage && (
        <div className="relative w-full bg-accent text-white py-2 z-[60] text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-center px-4">
          {settings.topBarMessage}
        </div>
      )}

      <nav
        className={`sticky top-0 w-full z-50 transition-all duration-300 py-2 md:py-4 bg-white/95 backdrop-blur-md border-b border-border shadow-sm`}
      >
        <div className="container">
          <div className="flex items-center justify-between gap-4">
            {/* MOBILE: Menu Toggle (Left) - Thumb-friendly touch target */}
            <div className="flex md:hidden flex-1 justify-start">
              <button
                className="w-10 h-10 flex items-center justify-center hover:text-accent transition-luxury"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* 🏆 LUXURY LOGO */}
            <div className="flex-initial">
              <Logo size="sm" />
            </div>

            {/* DESKTOP NAVIGATION: Center */}
            <div className="hidden md:flex flex-1 justify-center items-center gap-6 lg:gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-[12px] lg:text-[13px] font-bold uppercase tracking-[0.1em] hover:text-accent transition-luxury whitespace-nowrap"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* ACTION ICONS: Right - Optimized Touch Targets */}
            <div className="flex flex-1 items-center justify-end gap-1 md:gap-4">
              {isAdmin && (
                <Link href="/admin" className="hidden lg:flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-[9px] font-black uppercase tracking-widest border border-accent/20">
                  Admin
                </Link>
              )}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-10 h-10 flex items-center justify-center hover:text-accent transition-luxury hidden sm:flex"
              >
                <Search size={20} />
              </button>
              <Link href="/wishlist" className="w-10 h-10 hidden sm:flex items-center justify-center hover:text-accent transition-luxury">
                <Heart size={20} />
              </Link>
              <Link href="/cart" className="relative group w-10 h-10 flex items-center justify-center">
                <ShoppingBag size={20} className="group-hover:text-accent transition-luxury" />
                {cartItemsCount > 0 && (
                  <span className="absolute top-1 right-1 bg-accent text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center text-white shadow-sm">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay - Native Feel */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90]"
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="md:hidden fixed top-0 left-0 w-[85%] max-w-[400px] h-screen bg-white z-[100] shadow-2xl flex flex-col overscroll-contain"
              >
                <div className="p-6 border-b border-border flex justify-between items-center bg-[#faf9f6]">
                  <div className="flex items-baseline scale-90">
                    <span className="text-xl font-black text-primary uppercase font-logo">Shahi</span>
                    <span className="text-xl font-light text-accent italic -ml-1 font-logo">Posh</span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto py-8 px-6 space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-4 text-lg font-extrabold uppercase tracking-widest text-primary hover:text-accent transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                  <div className="pt-8 border-t border-border mt-6 space-y-4">
                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 py-3 text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors">
                      <User size={20} className="text-accent" /> My Account
                    </Link>
                    <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 py-3 text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors">
                      <Heart size={20} className="text-accent" /> Wishlist
                    </Link>
                    <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 py-3 text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors">
                      <Search size={20} className="text-accent" /> Search Shop
                    </Link>
                  </div>
                </div>

                <div className="p-8 bg-[#faf9f6] border-t border-border">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 text-center">
                    Luxury Artisanship Since 2024
                  </p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}