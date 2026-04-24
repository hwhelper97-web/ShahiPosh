'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  ShoppingBag, 
  MapPin, 
  Heart, 
  LogOut, 
  Settings, 
  ChevronRight, 
  Package, 
  Clock, 
  ShieldCheck,
  Phone,
  Mail,
  Save,
  Loader2,
  Trash2,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSettings } from '@/components/settings-context';

export default function DashboardPage() {
  const router = useRouter();
  const { settings } = useSettings();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const adminToken = localStorage.getItem('admin_token');
    
    if (!storedUser && !adminToken) {
      router.push('/login');
      return;
    }

    if (adminToken) setIsAdmin(true);

    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setForm({
        name: parsed.name || '',
        email: parsed.email || '',
        phone: parsed.phone || '',
        address: parsed.address || ''
      });
      fetchOrders(parsed.phone);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchOrders = async (phone: string) => {
    if (!phone) return setLoading(false);
    try {
      const res = await fetch(`/api/my-orders?phone=${phone}`);
      if (res.ok) {
        setOrders(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, ...form })
      });
      if (res.ok) {
        const updatedUser = await res.json();
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        alert('Profile updated successfully');
      }
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivateAccount = async () => {
    if (!confirm("Are you absolutely sure? This will permanently delete your account and all order history. This action cannot be undone.")) return;
    
    setSaving(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id })
      });
      if (res.ok) {
        handleSignOut();
      }
    } catch (err) {
      alert('Failed to deactivate account');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('admin_token');
    router.push('/');
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-accent" size={40} />
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Synchronizing your dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="bg-[#fcfcfc] min-h-screen pt-32 pb-20">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3 space-y-8">
            <div className="bg-white p-10 rounded-[3rem] border border-border shadow-sm sticky top-32">
              <div className="flex flex-col items-center text-center mb-10">
                <div className="relative group">
                  <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-xl group-hover:scale-105 transition-all duration-500 overflow-hidden">
                    {user?.image ? (
                      <img src={user.image} alt="User" className="w-full h-full object-cover" />
                    ) : (
                      <User size={40} className="text-muted-foreground" />
                    )}
                  </div>
                  {isAdmin && (
                    <div className="absolute bottom-4 right-0 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                      <ShieldCheck size={14} />
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-bold tracking-tight">{user?.name || "Premium Member"}</h2>
                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-bold mt-1">
                  {isAdmin ? "Administrator" : "Exclusive Member"}
                </p>
              </div>

              <nav className="space-y-2">
                {[
                  { id: 'profile', icon: User, label: "My Profile" },
                  { id: 'orders', icon: ShoppingBag, label: "Order History" },
                  { id: 'wishlist', icon: Heart, label: "Wishlist" },
                  { id: 'addresses', icon: MapPin, label: "My Addresses" },
                  { id: 'settings', icon: Settings, label: "Account Settings" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${
                      activeTab === item.id 
                        ? 'bg-primary text-white shadow-xl shadow-primary/20 -translate-y-0.5' 
                        : 'hover:bg-muted text-muted-foreground hover:text-primary'
                    }`}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </button>
                ))}
                
                <div className="pt-8 border-t border-border mt-8">
                  {isAdmin && (
                    <Link 
                      href="/admin" 
                      className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-accent hover:bg-accent/10 transition-all duration-300 mb-2"
                    >
                      <ShieldCheck size={18} />
                      Admin Console
                    </Link>
                  )}
                  <button 
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all duration-300"
                  >
                    <LogOut size={18} />
                    Terminate Session
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Display Area */}
          <main className="lg:col-span-9 space-y-8 animate-in fade-in duration-700">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Total Transactions", value: String(orders.length).padStart(2, '0'), icon: Package, color: 'text-blue-500' },
                { label: "Wishlist Count", value: "05", icon: Heart, color: 'text-red-500' },
                { label: "Pending Shipments", value: String(orders.filter(o => o.status !== 'Delivered').length).padStart(2, '0'), icon: Clock, color: 'text-orange-500' },
              ].map((stat, idx) => (
                <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-border shadow-sm flex items-center justify-between group hover:shadow-xl transition-all duration-500">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">{stat.label}</p>
                    <p className="text-4xl font-black tracking-tighter">{stat.value}</p>
                  </div>
                  <div className={`w-14 h-14 bg-muted rounded-2xl flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                    <stat.icon size={26} strokeWidth={1.5} />
                  </div>
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div 
                  key="profile"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <div className="bg-white p-12 rounded-[3rem] border border-border shadow-sm">
                    <div className="flex justify-between items-center mb-10">
                      <h3 className="text-2xl font-black tracking-tighter">Profile Configuration</h3>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Member Since {user?.memberSince || '2024'}</p>
                    </div>

                    <form onSubmit={handleUpdateProfile} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-6">Legal Full Name</label>
                          <div className="relative">
                            <User className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <input 
                              value={form.name}
                              onChange={(e) => setForm({ ...form, name: e.target.value })}
                              className="w-full bg-muted/50 border-none rounded-2xl px-16 py-4 text-sm focus:ring-1 focus:ring-accent transition-all" 
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-6">Primary Phone Number</label>
                          <div className="relative">
                            <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <input 
                              value={form.phone}
                              onChange={(e) => setForm({ ...form, phone: e.target.value })}
                              className="w-full bg-muted/50 border-none rounded-2xl px-16 py-4 text-sm focus:ring-1 focus:ring-accent transition-all" 
                            />
                          </div>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-6">Email Address</label>
                          <div className="relative">
                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <input 
                              disabled
                              value={form.email}
                              className="w-full bg-muted/30 border-none rounded-2xl px-16 py-4 text-sm text-muted-foreground cursor-not-allowed" 
                            />
                          </div>
                        </div>
                      </div>

                      <button 
                        disabled={saving}
                        className="btn-premium px-12 py-4 flex items-center gap-3 shadow-xl shadow-primary/10"
                      >
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        Save Synchronization
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div 
                  key="orders"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white p-12 rounded-[3rem] border border-border shadow-sm min-h-[400px]"
                >
                  <div className="flex justify-between items-center mb-10">
                    <h3 className="text-2xl font-black tracking-tighter">Transaction History</h3>
                    <div className="flex gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-muted px-4 py-1.5 rounded-full">{orders.length} Records</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {orders.length > 0 ? orders.map((order) => (
                      <div key={order.id} className="flex flex-col md:flex-row md:items-center justify-between p-8 bg-muted/30 rounded-[2rem] group hover:bg-white hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-border">
                        <div className="flex gap-6 items-center">
                          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-500">
                            <ShoppingBag size={24} />
                          </div>
                          <div>
                            <p className="text-sm font-black group-hover:text-accent transition-colors">#{order.id.slice(-6).toUpperCase()}</p>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">
                              {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between md:gap-12 mt-6 md:mt-0">
                          <div className="text-right">
                             <p className="text-sm font-black">{settings.currency} {order.totalPrice.toLocaleString()}</p>
                             <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                               Completed
                             </span>
                          </div>
                          <Link href={`/orders/${order.id}`} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-border hover:bg-primary hover:text-white transition-all group/btn">
                            <ChevronRight size={18} className="group-hover/btn:translate-x-0.5 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    )) : (
                      <div className="py-20 text-center space-y-4 bg-muted/20 rounded-[3rem] border border-dashed border-border">
                         <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                           <ShoppingBag size={28} className="text-muted-foreground/30" />
                         </div>
                         <div>
                            <p className="text-sm font-bold">No orders found.</p>
                            <p className="text-xs text-muted-foreground mt-1">Start your luxury collection journey today.</p>
                         </div>
                         <Link href="/shop" className="btn-premium inline-block px-8 py-3 text-[10px] font-bold tracking-widest">Explore Boutique</Link>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'addresses' && (
                <motion.div 
                  key="addresses"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  <div className="bg-white p-12 rounded-[3rem] border border-border shadow-sm group hover:shadow-xl transition-all">
                    <div className="flex justify-between items-start mb-8">
                      <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                        <MapPin size={24} />
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest bg-accent text-white px-3 py-1 rounded-full">Default</span>
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-widest mb-6">Delivery Hub</h3>
                    <div className="space-y-4">
                      <p className="text-lg font-bold">{user?.name}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {form.address || "No address synchronized yet."}
                      </p>
                      <div className="flex gap-4 pt-6">
                        <button className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline flex items-center gap-2">
                          <Edit3 size={12} />
                          Modify
                        </button>
                        <button className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:underline flex items-center gap-2">
                          <Trash2 size={12} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 border-2 border-dashed border-border rounded-[3rem] p-12 flex flex-col items-center justify-center text-center space-y-6 group cursor-pointer hover:bg-white hover:border-accent transition-all duration-500">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <Plus size={32} className="text-muted-foreground group-hover:text-accent" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-widest">New Address</h4>
                      <p className="text-xs text-muted-foreground mt-2">Expand your fulfillment network.</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div 
                  key="settings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white p-12 rounded-[3rem] border border-border shadow-sm space-y-12"
                >
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black tracking-tighter">Account Governance</h3>
                    <p className="text-sm text-muted-foreground">Manage your secure credentials and notification preferences.</p>
                  </div>

                  <div className="space-y-8">
                    <div className="flex items-center justify-between p-8 bg-muted/30 rounded-[2rem]">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                          <ShieldCheck size={24} />
                        </div>
                        <div>
                          <p className="text-sm font-bold">Two-Factor Authentication</p>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Enhance session security</p>
                        </div>
                      </div>
                      <div className="w-12 h-6 bg-muted rounded-full relative p-1 cursor-pointer">
                        <div className="w-4 h-4 bg-muted-foreground/30 rounded-full" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-border">
                       <button className="p-8 border border-border rounded-[2rem] text-left hover:bg-muted transition-all space-y-2">
                         <p className="text-xs font-black uppercase tracking-widest">Security Key</p>
                         <p className="text-sm font-bold">Modify Password</p>
                       </button>
                       <button 
                         onClick={handleDeactivateAccount}
                         className="p-8 border border-red-100 rounded-[2rem] text-left hover:bg-red-50 transition-all space-y-2"
                       >
                         <p className="text-xs font-black uppercase tracking-widest text-red-400">Critical Action</p>
                         <p className="text-sm font-bold text-red-600">Deactivate Account</p>
                       </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}

function Edit3({ size, className }: { size: number, className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
  );
}
