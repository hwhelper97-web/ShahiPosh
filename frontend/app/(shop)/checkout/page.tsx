'use client';

import { FormEvent, useState } from 'react';
import { useCart } from '@/components/cart-context';
import { createOrder } from '@/lib/api';

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const [form, setForm] = useState({ customerName: '', phone: '', address: '' });
  const [done, setDone] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await createOrder({ ...form, items, totalPrice: subtotal });
    clear();
    setDone(true);
  };

  if (done) return <div className="container py-12 text-2xl">Order placed successfully.</div>;

  return (
    <div className="container grid gap-8 py-10 md:grid-cols-2">
      <form onSubmit={onSubmit} className="card space-y-4 p-6">
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <input required placeholder="Name" className="w-full rounded-xl border border-white/20 bg-transparent px-3 py-2" onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
        <input required placeholder="Phone" className="w-full rounded-xl border border-white/20 bg-transparent px-3 py-2" onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <textarea required placeholder="Address" className="w-full rounded-xl border border-white/20 bg-transparent px-3 py-2" onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <button className="rounded-full bg-accent px-6 py-3 text-black">Place Order</button>
      </form>
      <div className="card p-6">
        <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
        {items.map((i) => <p key={`${i.id}-${i.size}`}>{i.name} ({i.size}) x {i.quantity}</p>)}
        <p className="mt-4 text-lg">Total: ${subtotal.toFixed(2)}</p>
      </div>
    </div>
  );
}
