'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, User, Menu, X, Heart } from 'lucide-react';
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
    { name: 'Collections', href: '/#collections' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      {settings.topBarMessage && (
        <div className="fixed top-0 left-0 w-full bg-primary text-white py-2 z-[60] text-[10px] font-bold uppercase tracking-[0.2em] text-center">
          {settings.topBarMessage}
        </div>
      )}

      <nav
        className={`fixed left-0 w-full z-50 transition-all duration-300 ${
          settings.topBarMessage ? 'top-8' : 'top-0'
        } ${
          isScrolled ? 'py-4 glass border-b shadow-sm' : 'py-6 bg-transparent'
        }`}
      >
        <div className="container flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group">
            <h1 className={`text-2xl font-black tracking-tighter transition-luxury group-hover:text-accent ${isScrolled ? 'text-primary' : 'text-primary'}`}>
              {settings.storeName}
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-[11px] font-bold uppercase tracking-[0.2em] hover:text-accent transition-luxury"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-5">
            {isAdmin && (
              <Link href="/admin" className="hidden lg:flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-[10px] font-black uppercase tracking-widest border border-accent/20 hover:bg-accent hover:text-white transition-all duration-500">
                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                Admin Portal
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
            <Link href="/dashboard" className="hover:text-accent transition-luxury">
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
            
            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden hover:text-accent transition-luxury"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b overflow-hidden"
            >
              <div className="container py-8 flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-sm font-bold uppercase tracking-widest hover:text-accent transition-luxury"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}