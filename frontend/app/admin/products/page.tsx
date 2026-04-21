'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Product } from '@/lib/types';
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import Image from 'next/image';

const API = '/api';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ 
    name: '', 
    price: '', 
    description: '', 
    category: 'Men', 
    sizes: 'S,M,L', 
    images: '' 
  });

  const load = async () => {
    setLoading(true);
    try {
      const prodRes = await fetch(`${API}/products`);
      setProducts(await prodRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    await fetch(`${API}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ 
        ...form, 
        price: Number(form.price), 
        sizes: form.sizes.split(','), 
        images: form.images.split(',') 
      })
    });
    setIsAdding(false);
    setForm({ name: '', price: '', description: '', category: 'Men', sizes: 'S,M,L', images: '' });
    await load();
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    const token = localStorage.getItem('admin_token');
    await fetch(`${API}/products/${id}`, { 
      method: 'DELETE', 
      headers: { Authorization: `Bearer ${token}` } 
    });
    await load();
  };

  return (
    <AdminShell>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter">Products</h1>
            <p className="text-muted-foreground text-sm">Manage your inventory and product listings.</p>
          </div>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="btn-premium flex items-center gap-2 py-2"
          >
            {isAdding ? <ChevronLeft size={18} /> : <Plus size={18} />}
            {isAdding ? 'Back to List' : 'Add New Product'}
          </button>
        </div>

        {isAdding ? (
          <div className="bg-white rounded-[2.5rem] border border-border p-10 shadow-xl max-w-3xl">
            <h2 className="text-xl font-bold uppercase tracking-widest mb-8 text-accent">Product Details</h2>
            <form onSubmit={createProduct} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-4">Product Name</label>
                  <input 
                    required 
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Premium Silk Sherwani" 
                    className="w-full bg-muted border-none rounded-2xl px-6 py-4 text-sm focus:ring-1 focus:ring-accent transition-luxury" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-4">Price (Rs)</label>
                  <input 
                    required 
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="25000" 
                    className="w-full bg-muted border-none rounded-2xl px-6 py-4 text-sm focus:ring-1 focus:ring-accent transition-luxury" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-4">Description</label>
                <textarea 
                  required 
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the product details, fabric, and care instructions..." 
                  className="w-full bg-muted border-none rounded-2xl px-6 py-4 text-sm focus:ring-1 focus:ring-accent transition-luxury" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-4">Category</label>
                  <select 
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-muted border-none rounded-2xl px-6 py-4 text-sm focus:ring-1 focus:ring-accent transition-luxury appearance-none"
                  >
                    <option>Men</option>
                    <option>Women</option>
                    <option>Kids</option>
                    <option>Accessories</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-4">Available Sizes (Comma separated)</label>
                  <input 
                    value={form.sizes}
                    onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                    placeholder="S,M,L,XL" 
                    className="w-full bg-muted border-none rounded-2xl px-6 py-4 text-sm focus:ring-1 focus:ring-accent transition-luxury" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-4">Image URLs (Comma separated)</label>
                <div className="relative">
                  <ImageIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input 
                    value={form.images}
                    onChange={(e) => setForm({ ...form, images: e.target.value })}
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg" 
                    className="w-full bg-muted border-none rounded-2xl px-14 py-4 text-sm focus:ring-1 focus:ring-accent transition-luxury" 
                  />
                </div>
              </div>

              <button className="btn-premium w-full py-5 text-lg font-bold shadow-2xl">
                Save Product
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
            {/* Filter Bar */}
            <div className="p-6 border-b border-border flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                  placeholder="Search products..." 
                  className="w-full bg-muted border-none rounded-full px-12 py-2.5 text-sm focus:ring-1 focus:ring-accent transition-luxury" 
                />
              </div>
              <div className="flex gap-2">
                <button className="p-2.5 bg-muted rounded-full hover:bg-accent hover:text-white transition-luxury">
                  <Filter size={18} />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Product</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Category</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Price</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {products.map((p) => (
                    <tr key={p.id} className="group hover:bg-muted/30 transition-luxury">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-16 bg-muted rounded-lg overflow-hidden relative">
                            {/* Product Image logic here */}
                          </div>
                          <div>
                            <p className="text-sm font-bold">{p.name}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{p.id.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-accent/10 text-accent px-3 py-1 rounded-full">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-sm font-bold">Rs {p.price.toLocaleString()}</p>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 text-muted-foreground hover:text-primary hover:bg-white rounded-full shadow-sm transition-luxury">
                            <Edit3 size={16} />
                          </button>
                          <button 
                            onClick={() => deleteProduct(p.id)}
                            className="p-2 text-muted-foreground hover:text-red-500 hover:bg-white rounded-full shadow-sm transition-luxury"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-6 border-t border-border flex justify-between items-center">
              <p className="text-xs text-muted-foreground">Showing {products.length} products</p>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-luxury">
                  <ChevronLeft size={14} />
                </button>
                <button className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-luxury">
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
