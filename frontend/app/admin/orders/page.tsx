'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AdminShell } from '@/components/admin-shell';
import { 
  Search, 
  Filter, 
  Eye, 
  Truck, 
  CheckCircle2, 
  Clock,
  ChevronLeft,
  ChevronRight,
  Download,
  ShoppingBag,
  X,
  User,
  Package,
  Loader2,
  ExternalLink,
  MapPin,
  AlertCircle,
  Hash,
  Phone,
  Calendar,
  CreditCard,
  Trash2
} from 'lucide-react';
import { useSettings } from '@/components/settings-context';
import toast, { Toaster } from 'react-hot-toast';

const API = '/api';

function AdminOrdersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const { settings } = useSettings();
  
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const orderRes = await fetch(`${API}/orders`);
      if (orderRes.ok) {
        const data = await orderRes.json();
        setOrders(data);
        
        const orderId = searchParams.get('id');
        if (orderId) {
          const order = data.find((o: any) => o.id === orderId);
          if (order) setSelectedOrder(order);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to sync orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setStatusUpdating(true);
    const loadingToast = toast.loading(`Transitioning to ${newStatus}...`);
    try {
      const res = await fetch(`${API}/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        toast.success(`Manifest ${newStatus}`, { id: loadingToast });
        await load();
        if (selectedOrder?.id === id) {
          setSelectedOrder((prev: any) => ({ ...prev, status: newStatus }));
        }
      } else {
        toast.error("Protocol failed", { id: loadingToast });
      }
    } catch (err) {
      toast.error("Network synchronization error", { id: loadingToast });
    } finally {
      setStatusUpdating(false);
    }
  };

  const handlePostExBooking = async () => {
    if (!selectedOrder) return;
    setBookingLoading(true);
    const bookingToast = toast.loading("Deploying shipment to PostEx...");

    try {
      const res = await fetch('/api/admin/courier/postex/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          orderId: selectedOrder.id,
          city: selectedOrder.city,
          area: selectedOrder.area
        })
      });

      if (res.ok) {
        const data = await res.json();
        
        // AUTOMATIC STATUS UPGRADE: Set to Shipped
        await fetch(`${API}/orders/${selectedOrder.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'Shipped' })
        });

        toast.success(`PostEx Deployment Successful: ${data.trackingNumber}`, { id: bookingToast });
        await load();
        
        // Refresh selected order data
        const updated = await fetch(`${API}/orders/${selectedOrder.id}`).then(r => r.json());
        setSelectedOrder(updated);
      } else {
        const error = await res.json();
        toast.error(error.error || 'PostEx connection rejected', { id: bookingToast });
      }
    } catch (err) {
      console.error(err);
      toast.error("Logistics system error", { id: bookingToast });
    } finally {
      setBookingLoading(false);
    }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm("Are you sure? This will permanently delete the order record.")) return;
    try {
      const res = await fetch(`${API}/orders/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Order record purged");
        setSelectedOrder(null);
        await load();
      }
    } catch (err) {
      toast.error("Failed to delete order");
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesStatus = filterStatus === 'All' || o.status === filterStatus;
    const matchesSearch = 
      (o.orderNumber?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
      (o.id?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
      (o.customerName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (o.customerPhone || o.phone || '').includes(searchTerm) ||
      (o.shippingAddress || o.address || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'Confirmed': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Shipped': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'Delivered': return 'bg-green-50 text-green-600 border-green-100';
      case 'Cancelled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  if (loading && orders.length === 0) return (
    <AdminShell>
      <div className="h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-accent" size={40} />
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Synchronizing Transactions...</p>
        </div>
      </div>
    </AdminShell>
  );

  return (
    <AdminShell>
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto space-y-10 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 text-accent mb-2">
              <ShoppingBag size={14} />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Order Fulfillment</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tighter">Command Center</h1>
            <p className="text-muted-foreground text-sm mt-1">Track customer acquisitions and manage transaction flow.</p>
          </div>
          <button className="btn-outline flex items-center gap-3 py-4 px-8 shadow-sm group bg-white border-2 border-border rounded-2xl hover:border-accent transition-all">
            <Download size={18} className="group-hover:-translate-y-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Export Ledger (CSV)</span>
          </button>
        </div>

        <div className="bg-white rounded-[3rem] border border-border shadow-sm overflow-hidden animate-in fade-in duration-700">
          {/* Filters Bar */}
          <div className="p-8 border-b border-border flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input 
                placeholder="Search by ID, Name, or Phone..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-muted/50 border-none rounded-full px-16 py-4 text-sm focus:ring-2 focus:ring-accent/20 transition-all outline-none" 
              />
            </div>
            <div className="flex gap-4 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
               {['All', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                 <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    filterStatus === status 
                      ? 'bg-primary text-white shadow-lg' 
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                  }`}
                 >
                   {status}
                 </button>
               ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-muted/30">
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Manifest #</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Client Profile</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Transaction Details</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Fulfillment Status</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="group hover:bg-muted/20 transition-all duration-300">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/5 text-primary rounded-2xl flex items-center justify-center border border-primary/10 shadow-sm">
                          <Hash size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-black tracking-tight">#{o.id.slice(-6).toUpperCase()}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar size={10} className="text-muted-foreground/60" />
                            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">
                              {new Date(o.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-accent" />
                          <p className="text-sm font-black">{o.customerName}</p>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone size={12} />
                          <p className="text-[11px] font-medium">{o.customerPhone || o.phone}</p>
                        </div>
                        <div className="flex items-start gap-2 text-muted-foreground max-w-[200px]">
                          <MapPin size={12} className="mt-0.5 flex-shrink-0" />
                          <p className="text-[10px] leading-tight font-medium line-clamp-2">{o.shippingAddress || o.address}, {o.city}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="space-y-2">
                        <div className="flex items-baseline gap-1">
                          <span className="text-[10px] font-bold text-muted-foreground/60">{settings.currency}</span>
                          <p className="text-lg font-black tracking-tighter">{o.totalPrice.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`px-2 py-1 rounded-md border flex items-center gap-1.5 ${
                            o.paymentMethod === 'CARD' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                            o.paymentMethod === 'EASYPAISA' ? 'bg-green-50 border-green-100 text-green-600' :
                            o.paymentMethod === 'JAZZCASH' ? 'bg-orange-50 border-orange-100 text-orange-600' :
                            o.paymentMethod === 'BANK_TRANSFER' ? 'bg-purple-50 border-purple-100 text-purple-600' :
                            'bg-muted/50 border-border text-muted-foreground'
                          }`}>
                            <CreditCard size={10} />
                            <p className="text-[8px] font-black uppercase tracking-widest">
                              {o.paymentMethod?.replace('_', ' ') || 'COD'}
                            </p>
                          </div>
                          <div className={`px-2 py-1 rounded-md border text-[8px] font-black uppercase tracking-widest ${
                            o.paymentStatus === 'PAID' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-red-50 border-red-100 text-red-600'
                          }`}>
                            {o.paymentStatus || 'UNPAID'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                       <div className="flex flex-wrap gap-1.5 max-w-[240px]">
                         {[
                           { name: 'Pending', color: 'bg-orange-500' },
                           { name: 'Confirmed', color: 'bg-blue-600' },
                           { name: 'Shipped', color: 'bg-purple-600' },
                           { name: 'Delivered', color: 'bg-green-600' },
                           { name: 'Cancelled', color: 'bg-red-600' }
                         ].map((s) => (
                           <button
                             key={s.name}
                             disabled={statusUpdating}
                             onClick={() => handleStatusUpdate(o.id, s.name)}
                             className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${
                               o.status === s.name 
                                 ? `${s.color} text-white shadow-lg scale-105 border-transparent` 
                                 : 'bg-muted/40 text-muted-foreground/60 hover:bg-muted hover:text-primary border border-border/50'
                             }`}
                           >
                             {s.name}
                           </button>
                         ))}
                       </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                       <div className="flex justify-end gap-2">
                         <button 
                          onClick={() => setSelectedOrder(o)} 
                          className="w-12 h-12 bg-white border-2 border-border rounded-2xl shadow-sm hover:text-accent hover:border-accent transition-all flex items-center justify-center group/btn"
                         >
                           <Eye size={20} className="group-hover/btn:scale-110 transition-transform" />
                         </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modern Order Detail Slide-over / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div onClick={() => setSelectedOrder(null)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
          <div className="relative w-full max-w-5xl bg-white rounded-[3.5rem] p-12 shadow-2xl overflow-y-auto max-h-[90vh] border border-border space-y-12">
            <button onClick={() => setSelectedOrder(null)} className="absolute top-10 right-10 p-3 hover:bg-muted rounded-2xl transition-all">
              <X size={24} />
            </button>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-border pb-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-accent">
                  <Package size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Manifest Ledger</span>
                </div>
                <h2 className="text-5xl font-black tracking-tighter">#{selectedOrder.id.slice(-6).toUpperCase()}</h2>
                <div className="flex items-center gap-4">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  <div className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
                  <span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map((s) => (
                  <button
                    key={s}
                    disabled={statusUpdating}
                    onClick={() => handleStatusUpdate(selectedOrder.id, s)}
                    className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                      selectedOrder.status === s 
                        ? 'bg-primary text-white scale-105' 
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {statusUpdating && selectedOrder.status !== s ? '...' : s}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Left Side: Information */}
              <div className="lg:col-span-7 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-4">
                     <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                       <User size={12} />
                       Client Profile
                     </p>
                     <div className="bg-muted/30 rounded-[2rem] p-8 space-y-2">
                        <p className="text-xl font-bold">{selectedOrder.customerName}</p>
                        <p className="text-sm font-medium text-muted-foreground">{selectedOrder.customerPhone || selectedOrder.phone}</p>
                     </div>
                   </div>
                   <div className="space-y-4">
                     <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                       <MapPin size={12} />
                       Shipping Destination
                     </p>
                     <div className="bg-muted/30 rounded-[2rem] p-8 space-y-2">
                        <p className="text-sm text-muted-foreground leading-relaxed font-medium">{selectedOrder.shippingAddress || selectedOrder.address}</p>
                        {(selectedOrder.city || selectedOrder.area) && (
                          <div className="flex gap-2 pt-2">
                            <span className="bg-white px-3 py-1 rounded-lg text-[9px] font-bold uppercase border border-border">{selectedOrder.city}</span>
                            <span className="bg-white px-3 py-1 rounded-lg text-[9px] font-bold uppercase border border-border">{selectedOrder.area}</span>
                          </div>
                        )}
                     </div>
                   </div>
                </div>

                <div className="space-y-6">
                   <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                     <ShoppingBag size={12} />
                     Cart Composition
                   </p>
                   <div className="space-y-3">
                     {(() => {
                       const items = typeof selectedOrder.items === 'string' ? JSON.parse(selectedOrder.items) : selectedOrder.items;
                       return (items as any[]).map((item: any, i: number) => (
                         <div key={i} className="flex justify-between items-center bg-white border border-border p-6 rounded-[2rem] hover:shadow-lg transition-all group">
                            <div className="flex items-center gap-5">
                              <div className="w-14 h-14 bg-muted rounded-2xl overflow-hidden relative border border-border group-hover:scale-105 transition-transform">
                                <img src={item.image || '/placeholder.jpg'} alt="" className="object-cover w-full h-full" />
                              </div>
                              <div>
                                <p className="text-sm font-black">{item.name}</p>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Quantity: {item.quantity} • Size: {item.size}</p>
                              </div>
                            </div>
                            <p className="font-black text-sm">{settings.currency} {(item.price * item.quantity).toLocaleString()}</p>
                         </div>
                       ));
                     })()}
                   </div>

                   <div className="pt-6 border-t border-border flex justify-between items-end">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Total Valuation</span>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                            selectedOrder.paymentStatus === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                          }`}>
                            {selectedOrder.paymentStatus || 'UNPAID'}
                          </span>
                        </div>
                        <p className="text-4xl font-black tracking-tighter">{settings.currency} {selectedOrder.totalPrice.toLocaleString()}</p>
                        <p className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">{selectedOrder.paymentMethod?.replace('_', ' ') || 'Cash on Delivery'}</p>
                      </div>
                      <button 
                        onClick={() => deleteOrder(selectedOrder.id)}
                        className="p-4 text-red-500 hover:bg-red-50 rounded-2xl transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                      >
                        <Trash2 size={16} />
                        Purge Record
                      </button>
                   </div>
                </div>
              </div>

              {/* Right Side: Logistics Integration */}
              <div className="lg:col-span-5">
                <div className="bg-black text-white rounded-[3rem] p-10 space-y-10 shadow-2xl relative overflow-hidden h-full">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-bl-full blur-3xl" />
                  
                  <div className="relative z-10 space-y-2">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                      <Truck size={24} />
                    </div>
                    <h3 className="text-2xl font-black tracking-tighter pt-4">Logistics Suite</h3>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Powered by PostEx Pakistan</p>
                  </div>

                  {selectedOrder.trackingId ? (
                    <div className="space-y-8 relative z-10">
                      <div className="bg-white/10 border border-white/10 rounded-[2.5rem] p-8 text-center space-y-4">
                         <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto">
                           <CheckCircle2 size={32} />
                         </div>
                         <div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-green-400/80">Shipment Manifested</p>
                           <p className="text-3xl font-black tracking-tighter mt-2">{selectedOrder.trackingId}</p>
                           <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mt-1">Global Tracking Identity</p>
                         </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-xs font-bold border-b border-white/5 pb-4">
                          <span className="text-white/40 uppercase tracking-widest text-[9px]">Courier</span>
                          <span className="bg-blue-600 px-3 py-1 rounded-lg text-[9px] uppercase tracking-widest">{selectedOrder.courier}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs font-bold border-b border-white/5 pb-4">
                          <span className="text-white/40 uppercase tracking-widest text-[9px]">Status</span>
                          <span className="text-green-400 uppercase tracking-widest text-[9px]">Active</span>
                        </div>
                      </div>

                      <button className="w-full py-5 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-accent hover:text-white transition-all flex items-center justify-center gap-3">
                         <ExternalLink size={16} />
                         Track on PostEx.pk
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-8 relative z-10">
                      <div className="bg-white/5 border border-dashed border-white/20 rounded-[2.5rem] p-10 text-center space-y-4">
                         <Clock size={40} className="text-white/20 mx-auto" />
                         <p className="text-sm font-medium text-white/60">No active shipment found for this order.</p>
                      </div>

                      <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Shipment Specifications</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                            <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest">Weight</p>
                            <p className="text-xs font-black">0.5 Kg</p>
                          </div>
                          <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                            <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest">Type</p>
                            <p className="text-xs font-black">Overnight</p>
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={handlePostExBooking}
                        disabled={bookingLoading}
                        className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3"
                      >
                        {bookingLoading ? (
                          <Loader2 className="animate-spin" size={18} />
                        ) : (
                          <>
                            <Truck size={18} />
                            Deploy via PostEx
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-3 justify-center text-white/30">
                        <AlertCircle size={14} />
                        <p className="text-[8px] font-bold uppercase tracking-widest">Ensure address and phone are valid</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-accent" size={40} /></div>}>
      <AdminOrdersContent />
    </Suspense>
  );
}
