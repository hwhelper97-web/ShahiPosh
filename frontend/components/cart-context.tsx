'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import { CartItem, Product } from '@/lib/types';

type CartContextType = {
  items: CartItem[];
  add: (product: Product, size: string, quantity?: number) => void;
  remove: (id: string, size: string) => void;
  updateQty: (id: string, size: string, quantity: number) => void;
  subtotal: number;
  clear: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const add = (product: Product, size: string, quantity = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === product.id && i.size === size);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx].quantity += quantity;
        return copy;
      }
      return [...prev, { ...product, size, quantity }];
    });
  };

  const remove = (id: string, size: string) => setItems((prev) => prev.filter((i) => !(i.id === id && i.size === size)));
  const updateQty = (id: string, size: string, quantity: number) => setItems((prev) => prev.map((i) => (i.id === id && i.size === size ? { ...i, quantity: Math.max(quantity, 1) } : i)));
  const clear = () => setItems([]);

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items]);

  return <CartContext.Provider value={{ items, add, remove, updateQty, subtotal, clear }}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
