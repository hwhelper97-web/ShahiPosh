'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Product } from '@/lib/types';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminPage() {
  const [token, setToken] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', price: '', description: '', category: 'Men', sizes: 'S,M,L', images: '' });

  const load = async (jwt?: string) => {
    const t = jwt || token;
    const prodRes = await fetch(`${API}/products`);
    setProducts(await prodRes.json());
    if (t) {
      const orderRes = await fetch(`${API}/orders`, { headers: { Authorization: `Bearer ${t}` } });
      if (orderRes.ok) setOrders(await orderRes.json());
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem('admin_token') || '';
    setToken(stored);
    load(stored);
  }, []);

  const createProduct = async () => {
    await fetch(`${API}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...form, price: Number(form.price), sizes: form.sizes.split(','), images: form.images.split(',') })
    });
    await load();
  };

  const deleteProduct = async (id: string) => {
    await fetch(`${API}/products/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    await load();
  };

  return (
    <AdminShell>
      <h1 className="mb-6 text-2xl font-semibold">Dashboard</h1>
      {!token && <p className="mb-6 text-yellow-400">Please login at /admin/login to manage data.</p>}

      <div className="mb-8 grid gap-3 md:grid-cols-2">
        {Object.entries(form).map(([key, value]) => (
          <input key={key} value={value} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={key} className="rounded-xl border border-white/20 bg-transparent px-3 py-2" />
        ))}
        <button onClick={createProduct} className="rounded-xl bg-accent px-4 py-2 text-black md:col-span-2">Add Product</button>
      </div>

      <h2 className="mb-2 text-xl">Products</h2>
      <table className="mb-8 w-full text-left text-sm">
        <thead><tr className="text-white/60"><th>Name</th><th>Price</th><th>Category</th><th /></tr></thead>
        <tbody>
          {products.map((p) => <tr key={p.id} className="border-t border-white/10"><td>{p.name}</td><td>${p.price}</td><td>{p.category}</td><td><button onClick={() => deleteProduct(p.id)} className="text-red-400">Delete</button></td></tr>)}
        </tbody>
      </table>

      <h2 className="mb-2 text-xl">Orders</h2>
      <table className="w-full text-left text-sm">
        <thead><tr className="text-white/60"><th>Customer</th><th>Phone</th><th>Total</th><th>Date</th></tr></thead>
        <tbody>
          {orders.map((o) => <tr key={o.id} className="border-t border-white/10"><td>{o.customerName}</td><td>{o.phone}</td><td>${o.totalPrice}</td><td>{new Date(o.createdAt).toLocaleDateString()}</td></tr>)}
        </tbody>
      </table>
    </AdminShell>
  );
}
