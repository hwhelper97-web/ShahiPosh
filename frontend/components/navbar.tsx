'use client';

import Link from 'next/link';
import { useCart } from './cart-context';

export function Navbar() {
  const { items } = useCart();
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-xl font-semibold tracking-widest">ShahiPosh</Link>
        <nav className="flex items-center gap-4 text-sm text-white/80">
          <Link href="/shop">Shop</Link>
          <Link href="/admin">Admin</Link>
          <Link href="/cart">Cart ({items.length})</Link>
        </nav>
      </div>
    </header>
  );
}
