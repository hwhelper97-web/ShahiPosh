'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Truck, 
  CheckCircle2, 
  Clock,
  ChevronLeft,
  ChevronRight,
  Download
} from 'lucide-react';

const API = '/api';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
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

  return (
    <AdminShell>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter">Orders</h1>
            <p className="text-muted-foreground text-sm">Track and manage customer orders.</p>
          </div>
          <button className="btn-outline flex items-center gap-2 py-2">
            <Download size={18} />
            Export CSV
          </button>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
          {/* Filter Bar */}
          <div className="p-6 border-b border-border flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input 
                placeholder="Search orders, customers, IDs..." 
                className="w-full bg-muted border-none rounded-full px-12 py-2.5 text-sm focus:ring-1 focus:ring-accent transition-luxury" 
              />
            </div>
            <div className="flex gap-4">
              <select className="bg-muted border-none rounded-full px-6 py-2.5 text-sm focus:ring-1 focus:ring-accent appearance-none transition-luxury">
                <option>All Status</option>
                <option>Pending</option>
                <option>Shipped</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>
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
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Order ID</th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Customer</th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Date</th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Status</th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Total</th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((o) => (
                  <tr key={o.id} className="group hover:bg-muted/30 transition-luxury">
                    <td className="px-8 py-5">
                      <p className="text-sm font-bold">#{o.id.slice(-6).toUpperCase()}</p>
                    </td>
                    <td className="px-8 py-5">
                      <div>
                        <p className="text-sm font-bold">{o.customerName}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{o.phone}</p>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-xs text-muted-foreground">
                        {new Date(o.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </td>
                    <td className="px-8 py-5">
                      <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-green-600 bg-green-50 px-3 py-1 rounded-full w-fit">
                        <CheckCircle2 size={12} />
                        Completed
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-bold">Rs {o.totalPrice.toLocaleString()}</p>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-muted-foreground hover:text-primary hover:bg-white rounded-full shadow-sm transition-luxury">
                          <Eye size={16} />
                        </button>
                        <button className="p-2 text-muted-foreground hover:text-accent hover:bg-white rounded-full shadow-sm transition-luxury">
                          <Truck size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center text-muted-foreground italic text-sm">
                      No orders have been placed yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-6 border-t border-border flex justify-between items-center">
            <p className="text-xs text-muted-foreground">Showing {orders.length} orders</p>
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
      </div>
    </AdminShell>
  );
}
