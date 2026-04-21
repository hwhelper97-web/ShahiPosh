'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Product } from '@/lib/types';
import { 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus,
  MoreVertical
} from 'lucide-react';
import Link from 'next/link';

const API = '/api';

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const prodRes = await fetch(`${API}/products`);
      setProducts(await prodRes.json());
      const token = localStorage.getItem('admin_token');
      if (token) {
        const orderRes = await fetch(`${API}/orders`, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        if (orderRes.ok) setOrders(await orderRes.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const totalRevenue = orders.reduce((acc, o) => acc + (o.totalPrice || 0), 0);

  const stats = [
    { label: 'Total Revenue', value: `Rs ${totalRevenue.toLocaleString()}`, icon: DollarSign, trend: '+12.5%', up: true },
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, trend: '+3.2%', up: true },
    { label: 'Active Products', value: products.length, icon: TrendingUp, trend: 'stable', up: true },
    { label: 'Total Customers', value: '428', icon: Users, trend: '-2.1%', up: false },
  ];

  return (
    <AdminShell>
      <div className="space-y-10">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter">Good morning, Admin</h1>
            <p className="text-muted-foreground text-sm">Here's what's happening with your store today.</p>
          </div>
          <Link href="/admin/products" className="btn-premium flex items-center gap-2 py-2">
            <Plus size={18} />
            Add Product
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-border shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center text-accent">
                  <stat.icon size={20} strokeWidth={1.5} />
                </div>
                <div className={`flex items-center text-xs font-bold ${stat.up ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.trend}
                  {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                </div>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold tracking-tighter">{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Recent Orders */}
          <div className="bg-white rounded-[2.5rem] border border-border p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-sm font-bold uppercase tracking-widest">Recent Orders</h3>
              <Link href="/admin/orders" className="text-xs font-bold uppercase tracking-widest text-accent hover:underline">View All</Link>
            </div>
            <div className="space-y-6">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-xs font-bold">
                      {order.customerName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold group-hover:text-accent transition-luxury">{order.customerName}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">Rs {order.totalPrice.toLocaleString()}</p>
                    <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded-full">Paid</span>
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <p className="text-center text-muted-foreground text-sm py-10 italic">No orders found.</p>
              )}
            </div>
          </div>

          {/* Low Stock / Top Products */}
          <div className="bg-white rounded-[2.5rem] border border-border p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-sm font-bold uppercase tracking-widest">Top Products</h3>
              <Link href="/admin/products" className="text-xs font-bold uppercase tracking-widest text-accent hover:underline">View All</Link>
            </div>
            <div className="space-y-6">
              {products.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                      <ShoppingBag size={16} className="text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-bold group-hover:text-accent transition-luxury">{product.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">Rs {product.price.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">124 sold</p>
                  </div>
                </div>
              ))}
              {products.length === 0 && (
                <p className="text-center text-muted-foreground text-sm py-10 italic">No products found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
