'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, User, Menu, X, Heart, ChevronDown, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchOverlay from './search-overlay';
import { useSettings } from './settings-context';
import { useCart } from './cart-context';
import Logo from './logo';
import Image from 'next/image';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileCollectionsOpen, setIsMobileCollectionsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCollectionsHovered, setIsCollectionsHovered] = useState(false);
  const { settings } = useSettings();
  const { cart } = useCart();
  const [isAdmin, setIsAdmin] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  const cartItemsCount = cart.reduce((acc: number, item: any) => acc + item.quantity, 0);

  useEffect(() => {
    const adminToken = localStorage.getItem('admin_token');
    if (adminToken) setIsAdmin(true);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Fetch categories for the menu
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCategories(data.filter(c => !c.parentId));
      })
      .catch(console.error);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Collections', href: '/#categories', hasDropdown: true },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      {/* 1. Ayat ul Kursi Scrolling Bar */}
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
        <div className="container px-4 md:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* MOBILE: Menu Toggle */}
            <div className="flex md:hidden flex-1 justify-start">
              <button
                className="w-10 h-10 flex items-center justify-center hover:text-accent transition-luxury"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
                <div 
                  key={link.name} 
                  className="relative group py-4"
                  onMouseEnter={() => link.hasDropdown && setIsCollectionsHovered(true)}
                  onMouseLeave={() => link.hasDropdown && setIsCollectionsHovered(false)}
                >
                  <Link
                    href={link.href}
                    className="flex items-center gap-1.5 text-[12px] lg:text-[13px] font-bold uppercase tracking-[0.1em] hover:text-accent transition-luxury whitespace-nowrap"
                  >
                    {link.name}
                    {link.hasDropdown && <ChevronDown size={12} className={`transition-transform duration-300 ${isCollectionsHovered ? 'rotate-180' : ''}`} />}
                  </Link>

                  {/* Desktop Mega Dropdown */}
                  {link.hasDropdown && (
                    <AnimatePresence>
                      {isCollectionsHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 w-[600px] bg-white border border-border shadow-2xl rounded-[2rem] p-8 mt-2 overflow-hidden"
                        >
                          <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-4">
                              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Signature Curation</p>
                              <div className="grid grid-cols-1 gap-2">
                                {categories.map((cat) => (
                                  <Link 
                                    key={cat.id} 
                                    href={`/shop?category=${cat.slug}`}
                                    onClick={() => setIsCollectionsHovered(false)}
                                    className="group flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-all"
                                  >
                                    <span className="text-sm font-bold">{cat.name}</span>
                                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-accent">→</span>
                                  </Link>
                                ))}
                                <Link 
                                  href="/shop"
                                  className="mt-4 p-4 bg-primary text-white text-center rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all shadow-lg"
                                >
                                  Explore All Archives
                                </Link>
                              </div>
                            </div>
                            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
                               <Image 
                                src="/products/traditional_shawl_hero.png" 
                                alt="Collection Preview" 
                                fill 
                                className="object-cover"
                               />
                               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                                  <p className="text-white text-lg font-black tracking-tighter">Season Preview</p>
                                  <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">Spring/Summer 2024</p>
                               </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </div>

            {/* ACTION ICONS: Right */}
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

        {/* Mobile Menu Overlay */}
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
                className="md:hidden fixed top-0 left-0 w-[85%] max-w-[400px] h-screen bg-white z-[100] shadow-2xl flex flex-col"
              >
                <div className="p-6 border-b border-border flex justify-between items-center bg-[#faf9f6]">
                  <Logo size="sm" onClick={() => setIsMobileMenuOpen(false)} />
                  <button onClick={() => setIsMobileMenuOpen(false)} className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm"><X size={20} /></button>
                </div>

                <div className="flex-1 overflow-y-auto py-8 px-6 space-y-1">
                  {navLinks.map((link) => (
                    <div key={link.name}>
                      <div className="flex items-center justify-between py-4">
                        <Link
                          href={link.href}
                          onClick={() => !link.hasDropdown && setIsMobileMenuOpen(false)}
                          className="text-lg font-extrabold uppercase tracking-widest text-primary"
                        >
                          {link.name}
                        </Link>
                        {link.hasDropdown && (
                          <button 
                            onClick={() => setIsMobileCollectionsOpen(!isMobileCollectionsOpen)}
                            className="w-10 h-10 flex items-center justify-center bg-muted rounded-xl"
                          >
                            {isMobileCollectionsOpen ? <Minus size={16} /> : <Plus size={16} />}
                          </button>
                        )}
                      </div>
                      
                      {/* Mobile Collections Sub-menu */}
                      {link.hasDropdown && (
                        <AnimatePresence>
                          {isMobileCollectionsOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden bg-muted/30 rounded-2xl px-4"
                            >
                              {categories.map((cat) => (
                                <Link
                                  key={cat.id}
                                  href={`/shop?category=${cat.slug}`}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="block py-4 text-sm font-bold text-muted-foreground border-b border-border/50 last:border-0"
                                >
                                  {cat.name}
                                </Link>
                              ))}
                              <Link
                                href="/shop"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block py-4 text-[10px] font-black uppercase tracking-widest text-accent"
                              >
                                View All Shop →
                              </Link>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      )}
                    </div>
                  ))}

                  <div className="pt-8 border-t border-border mt-6 space-y-4">
                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 py-3 text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground"><User size={20} className="text-accent" /> My Account</Link>
                    <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 py-3 text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground"><Heart size={20} className="text-accent" /> Wishlist</Link>
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