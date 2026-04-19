'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getProduct } from '@/lib/api';
import { Product } from '@/lib/types';
import { useCart } from '@/components/cart-context';
import { buildProductMessage, waLink } from '@/lib/whatsapp';

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [size, setSize] = useState('M');
  const [qty, setQty] = useState(1);
  const { add } = useCart();

  useEffect(() => {
    getProduct(params.id).then(setProduct);
  }, [params.id]);

  if (!product) return <div className="container py-10">Loading...</div>;

  return (
    <div className="container grid gap-8 py-10 md:grid-cols-2">
      <div className="grid gap-4">
        {product.images.map((img, i) => (
          <div key={i} className="relative h-96 overflow-hidden rounded-2xl">
            <Image src={img} alt={product.name} fill className="object-cover" />
          </div>
        ))}
      </div>
      <div className="space-y-5">
        <h1 className="text-3xl font-semibold">{product.name}</h1>
        <p className="text-accent text-xl">${product.price}</p>
        <p className="text-white/70">{product.description}</p>
        <select value={size} onChange={(e) => setSize(e.target.value)} className="rounded-xl border border-white/20 bg-black px-3 py-2">
          {product.sizes.map((s) => <option key={s}>{s}</option>)}
        </select>
        <input type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value))} className="ml-4 w-20 rounded-xl border border-white/20 bg-transparent px-3 py-2" />
        <div className="flex gap-3">
          <button onClick={() => add(product, size, qty)} className="rounded-full bg-accent px-6 py-3 font-medium text-black">Add to Cart</button>
          <a href={waLink(buildProductMessage(product, size, qty))} target="_blank" className="rounded-full border border-white/20 px-6 py-3">Order via WhatsApp</a>
        </div>
      </div>
    </div>
  );
}
