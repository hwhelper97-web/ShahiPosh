'use client';

import { useState, useEffect } from 'react';
import { 
  CreditCard, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  Eye,
  Check,
  X,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPaymentsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL'); // ALL, AWAITING_VERIFICATION, PAID, FAILED

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const stats = {
    totalVolume: orders.reduce((acc, o) => acc + (o.paymentStatus === 'PAID' ? o.totalPrice : 0), 0),
    pendingVerification: orders.filter(o => o.paymentStatus === 'AWAITING_VERIFICATION').length,
    failedPayments: orders.filter(o => o.paymentStatus === 'FAILED').length,
    successRate: orders.length > 0 ? (orders.filter(o => o.paymentStatus === 'PAID').length / orders.length) * 100 : 0
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = (o.orderNumber?.toLowerCase() || '').includes(search.toLowerCase()) || 
                         (o.customerName?.toLowerCase() || '').includes(search.toLowerCase());
    const matchesFilter = filter === 'ALL' || o.paymentStatus === filter;
    return matchesSearch && matchesFilter;
  });

  const handleVerify = async (orderId: string, status: 'PAID' | 'FAILED', reason?: string) => {
    // In production, this calls /api/admin/payments/verify
    alert(`Verifying Order ${orderId} as ${status}`);
    fetchOrders(); // Refresh
  };

  return (
    <div className="p-10 space-y-12 pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-accent mb-2">
            <CreditCard size={18} />
            <span className="text-xs font-black uppercase tracking-widest">Financial Treasury</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tighter">Payments & Reconciliation</h1>
          <p className="text-muted-foreground text-sm">Enterprise-grade transaction management and settlement gateway.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Gateway Status</span>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-full border border-green-100">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold">Systems Operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Settled Volume', value: `Rs ${stats.totalVolume.toLocaleString()}`, icon: ArrowUpRight, color: 'emerald' },
          { label: 'Pending Verification', value: stats.pendingVerification, icon: Clock, color: 'orange' },
          { label: 'Failed Attempts', value: stats.failedPayments, icon: AlertCircle, color: 'rose' },
          { label: 'Payment Success', value: `${stats.successRate.toFixed(1)}%`, icon: ShieldCheck, color: 'accent' },
        ].map((s, i) => (
          <div key={i} className="p-8 bg-white border border-border rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500 group">
            <div className="flex items-center justify-between mb-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-${s.color}-50 text-${s.color}-600 group-hover:scale-110 transition-transform`}>
                <s.icon size={24} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Live Metrics</span>
            </div>
            <p className="text-sm font-bold text-muted-foreground mb-1">{s.label}</p>
            <h3 className="text-3xl font-black tracking-tighter">{s.value}</h3>
          </div>
        ))}
      </div>

      {/* Verification Queue (If any) */}
      {orders.filter(o => o.paymentStatus === 'AWAITING_VERIFICATION').length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Clock className="text-orange-500" size={20} />
            <h2 className="text-xl font-bold tracking-tight">Manual Verification Queue</h2>
            <span className="px-3 py-1 bg-orange-100 text-orange-600 text-[10px] font-black rounded-full uppercase tracking-widest">
              {orders.filter(o => o.paymentStatus === 'AWAITING_VERIFICATION').length} Pending
            </span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {orders.filter(o => o.paymentStatus === 'AWAITING_VERIFICATION').map((o) => (
              <div key={o.id} className="p-8 bg-white border-2 border-orange-100 rounded-[2.5rem] flex gap-8 items-center shadow-lg hover:shadow-2xl transition-all animate-in slide-in-from-bottom-4">
                <div className="relative w-32 aspect-[3/4] bg-muted rounded-2xl overflow-hidden shadow-inner flex-shrink-0 group">
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer">
                    <Eye className="text-white" />
                  </div>
                  <div className="w-full h-full flex items-center justify-center">
                    <FileText size={32} className="text-muted-foreground" />
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-lg font-black tracking-tight">{o.customerName}</h3>
                    <p className="text-xs text-muted-foreground font-mono font-bold">#{o.orderNumber}</p>
                  </div>
                  <div className="flex items-center justify-between">
                     <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Amount</p>
                       <p className="text-lg font-black text-accent">Rs {o.totalPrice.toLocaleString()}</p>
                     </div>
                     <div className="flex gap-2">
                       <button 
                         onClick={() => handleVerify(o.id, 'PAID')}
                         className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                       >
                         <Check size={20} />
                       </button>
                       <button 
                         onClick={() => handleVerify(o.id, 'FAILED')}
                         className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                       >
                         <X size={20} />
                       </button>
                     </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Transactions List */}
      <div className="bg-white border border-border rounded-[3rem] overflow-hidden shadow-sm">
        <div className="p-10 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-6 bg-muted/20">
           <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-border shadow-inner w-full max-w-md">
             <Search size={18} className="text-muted-foreground" />
             <input 
               placeholder="Search Transactions..." 
               className="bg-transparent border-none outline-none text-sm font-bold w-full"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
             />
           </div>
           <div className="flex items-center gap-3">
             <Filter size={18} className="text-muted-foreground mr-2" />
             {['ALL', 'PAID', 'AWAITING_VERIFICATION', 'FAILED'].map((f) => (
               <button 
                 key={f}
                 onClick={() => setFilter(f)}
                 className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                   filter === f ? 'bg-primary text-white shadow-lg' : 'bg-white text-muted-foreground border border-border hover:bg-muted'
                 }`}
               >
                 {f.replace('_', ' ')}
               </button>
             ))}
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-muted/30">
              <tr>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Order ID</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Customer</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Method</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Amount</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-muted/10 transition-all group">
                  <td className="px-10 py-8">
                    <span className="text-sm font-black font-mono tracking-tight group-hover:text-accent transition-colors">{o.orderNumber}</span>
                  </td>
                  <td className="px-10 py-8">
                    <div>
                      <p className="text-sm font-bold">{o.customerName}</p>
                      <p className="text-[10px] text-muted-foreground font-bold">{o.customerPhone}</p>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center">
                         <CreditCard size={12} className="text-muted-foreground" />
                       </div>
                       <span className="text-[10px] font-black uppercase tracking-widest">{o.paymentMethod || 'COD'}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="text-sm font-black">Rs {o.totalPrice.toLocaleString()}</span>
                  </td>
                  <td className="px-10 py-8">
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      o.paymentStatus === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 
                      o.paymentStatus === 'AWAITING_VERIFICATION' ? 'bg-orange-50 text-orange-600' :
                      o.paymentStatus === 'FAILED' ? 'bg-rose-50 text-rose-600' : 'bg-muted text-muted-foreground'
                    }`}>
                      {o.paymentStatus === 'PAID' && <CheckCircle2 size={12} />}
                      {o.paymentStatus === 'AWAITING_VERIFICATION' && <Clock size={12} />}
                      {o.paymentStatus === 'FAILED' && <AlertCircle size={12} />}
                      {o.paymentStatus?.replace('_', ' ') || 'UNSET'}
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right text-xs text-muted-foreground font-bold">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="p-20 text-center space-y-4">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto opacity-30">
                <Search size={32} />
              </div>
              <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">No transactions found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
