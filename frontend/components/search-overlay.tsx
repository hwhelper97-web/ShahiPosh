'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function SearchOverlay({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  // Mock search logic
  useEffect(() => {
    if (query.length > 2) {
      // In a real app, you'd fetch from API
      // fetch(`${API}/products?q=${query}`).then(...)
    }
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-white flex flex-col"
        >
          {/* Header */}
          <div className="container py-8 flex justify-between items-center">
            <h2 className="text-xl font-bold tracking-tighter uppercase">Search</h2>
            <button 
              onClick={onClose}
              className="w-12 h-12 rounded-full bg-muted flex items-center justify-center hover:bg-accent hover:text-white transition-luxury"
            >
              <X size={24} />
            </button>
          </div>

          {/* Search Input */}
          <div className="container flex-1 flex flex-col pt-20">
            <div className="relative mb-20">
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What are you looking for?"
                className="w-full text-4xl md:text-6xl font-bold tracking-tighter border-none bg-transparent placeholder:text-muted focus:ring-0"
              />
              <div className="absolute right-0 bottom-4 w-full h-1 bg-muted rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: query ? '100%' : '0%' }}
                  className="h-full bg-accent"
                />
              </div>
            </div>

            {/* Quick Links / Suggestions */}
            {!query && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-8">Popular Searches</h3>
                  <div className="flex flex-col gap-6">
                    {['Silk Sherwani', 'Velvet Lehengha', 'Cotton Kurta', 'Pashmina Shawl'].map((term) => (
                      <button 
                        key={term}
                        onClick={() => setQuery(term)}
                        className="text-2xl font-bold tracking-tight hover:text-accent transition-luxury flex items-center gap-4 group"
                      >
                        {term}
                        <ArrowRight size={24} className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-luxury" />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-8">Quick Categories</h3>
                  <div className="flex flex-wrap gap-4">
                    {['Men', 'Women', 'Kids', 'Accessories', 'New Arrival'].map((cat) => (
                      <Link 
                        key={cat}
                        href={`/shop?category=${cat}`}
                        onClick={onClose}
                        className="px-8 py-4 bg-muted rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-accent hover:text-white transition-luxury"
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Results Placeholder */}
            {query && (
              <div className="space-y-8 pb-20">
                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">Results for "{query}"</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {/* Result items would go here */}
                  <div className="animate-pulse space-y-4">
                    <div className="aspect-[3/4] bg-muted rounded-2xl" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
