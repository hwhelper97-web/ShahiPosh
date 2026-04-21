'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('wishlist');
    if (stored) setWishlist(JSON.parse(stored));
  }, []);

  const removeFromWishlist = (id: string) => {
    const updated = wishlist.filter(item => item.id !== id);
    setWishlist(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
  };

  return (
    <div className="bg-background min-h-screen pt-32 pb-20">
      <div className="container">
        <h1 className="text-4xl font-bold tracking-tighter mb-12">My Wishlist</h1>

        {wishlist.length === 0 ? (
          <div className="text-center py-20 bg-muted rounded-[3rem]">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={32} className="text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-8 text-sm uppercase tracking-widest">Start saving your favorite pieces today.</p>
            <Link href="/shop" className="btn-premium inline-block">
              Explore Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {wishlist.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="group relative"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-muted rounded-2xl mb-4">
                  <Link href={`/product/${item.id}`}>
                    <Image
                      src={item.image || "/placeholder.jpg"}
                      alt={item.name}
                      fill
                      className="object-cover transition-luxury group-hover:scale-105"
                    />
                  </Link>
                  <button 
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white transition-luxury"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-bold tracking-tight">{item.name}</h3>
                  <p className="text-sm font-bold">Rs {item.price.toLocaleString()}</p>
                  <button className="btn-outline w-full py-2 mt-4 text-xs flex items-center justify-center gap-2">
                    <ShoppingBag size={14} />
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
