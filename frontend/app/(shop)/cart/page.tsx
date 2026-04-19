'use client';

import Link from 'next/link';
import { useCart } from '@/components/cart-context';
import { buildCartMessage, waLink } from '@/lib/whatsapp';

export default function CartPage() {
  const { items, subtotal, remove, updateQty } = useCart();

  return (
    <div className="container py-10">
      <h1 className="mb-6 text-3xl font-semibold">Cart</h1>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={`${item.id}-${item.size}`} className="card flex items-center justify-between p-4">
            <div>
              <h3>{item.name}</h3>
              <p className="text-white/60">Size: {item.size}</p>
            </div>
            <input type="number" min={1} value={item.quantity} onChange={(e) => updateQty(item.id, item.size, Number(e.target.value))} className="w-20 rounded border border-white/20 bg-transparent px-2 py-1" />
            <p>${item.price * item.quantity}</p>
            <button onClick={() => remove(item.id, item.size)} className="text-red-400">Remove</button>
          </div>
        ))}
      </div>
      <div className="mt-8 card p-5">
        <p className="text-xl">Subtotal: ${subtotal.toFixed(2)}</p>
        <div className="mt-4 flex gap-3">
          <Link href="/checkout" className="rounded-full bg-accent px-6 py-3 text-black">Proceed to Checkout</Link>
          <a href={waLink(buildCartMessage(items))} target="_blank" className="rounded-full border border-white/20 px-6 py-3">Order via WhatsApp</a>
        </div>
      </div>
    </div>
  );
}
