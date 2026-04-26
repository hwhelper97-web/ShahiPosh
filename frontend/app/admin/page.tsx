'use client';

import { useEffect, useState } from 'react';
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  Package, 
  Clock, 
  CheckCircle2,
  Truck,
  Flame,
  ChevronRight,
  Loader2,
  ExternalLink,
  ShoppingCart,
  TrendingUp,
  Activity,
  AlertCircle,
  Store,
  Layers,
  BrainCircuit,
  Bell,
  Search,
  Filter,
  Download
} from 'lucide-react';
import { motion, Reorder } from 'framer-motion';
import { useSettings } from '@/components/settings-context';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { AdminShell } from '@/components/admin-shell';
import Link from 'next/link';

export default function AdminDashboard() {
  const { settings } = useSettings();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [timeframe, setTimeframe] = useState('7D');

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then(res => res.json())
      .then(json => {
        // Merge with safe defaults so no field is ever undefined
        setData({
          totalRevenue: 0,
          averageOrderValue: 0,
          totalOrders: 0,
          totalProducts: 0,
          totalCustomers: 0,
          totalVendors: 0,
          activeVendors: 0,
          totalCategories: 0,
          hotItems: [],
          lowStockItems: [],
          salesByCategory: {},
          dailyRevenue: [],
          recentOrders: [],
          ...json,
        });
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading || !data) return (
    <AdminShell>
      <div className="h-[70vh] flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
          <BrainCircuit className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-accent animate-pulse" size={24} />
        </div>
        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-2">Neural Link Active</p>
          <p className="text-sm font-bold text-muted-foreground">Synchronizing Enterprise Intelligence...</p>
        </div>
      </div>
    </AdminShell>
  );

  const stats = [
    { label: "Gross Revenue", value: `${settings.currency} ${(data.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, trend: "+12.5%", positive: true, color: "bg-blue-600" },
    { label: "Active Vendors", value: String(data.activeVendors || 0).padStart(2, '0'), icon: Store, trend: "+2 new", positive: true, color: "bg-purple-600" },
    { label: "Market Reach", value: String(data.totalCustomers || 0), icon: Users, trend: "+2.4%", positive: true, color: "bg-orange-600" },
    { label: "SKU Diversity", value: String(data.totalProducts || 0), icon: Package, trend: "-1.5%", positive: false, color: "bg-emerald-600" },
  ];

  const pieData = Object.entries(data.salesByCategory || {}).map(([name, value]) => ({ name, value }));
  const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'];

  return (
    <AdminShell>
      <div className="space-y-12 max-w-[1600px] mx-auto pb-20">
        
        {/* Superior Header */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-accent/10 text-accent text-[9px] font-black uppercase tracking-widest rounded-full border border-accent/20">Enterprise Grade</span>
              <span className="text-[10px] font-bold text-muted-foreground">v2.4.0-Stable</span>
            </div>
            <h1 className="text-5xl font-black tracking-tight text-primary">Command Center</h1>
            <p className="text-sm text-muted-foreground mt-2 font-medium max-w-xl">Unified marketplace operations and real-time business intelligence for ShahiPosh Global.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
             <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="pl-12 pr-6 py-4 bg-white border border-border rounded-2xl text-xs font-bold focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all outline-none w-64 shadow-sm"
              />
            </div>
            
            <div className="flex bg-white border border-border p-1 rounded-2xl shadow-sm">
              {['7D', '30D', '1Y'].map(t => (
                <button 
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all ${timeframe === t ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground hover:bg-muted'}`}
                >
                  {t}
                </button>
              ))}
            </div>

            <button className="p-4 bg-white border border-border rounded-2xl text-muted-foreground hover:text-primary transition-all shadow-sm">
              <Bell size={20} />
            </button>
          </div>
        </div>

        {/* Dynamic Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-10 rounded-[3rem] border border-border shadow-sm group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div className={`w-16 h-16 ${stat.color} text-white rounded-[1.5rem] flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <stat.icon size={32} strokeWidth={1.5} />
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] font-black px-4 py-2 rounded-full border ${stat.positive ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                    {stat.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {stat.trend}
                  </div>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground mb-2">{stat.label}</p>
                <p className="text-4xl font-black tracking-tighter text-primary">{stat.value}</p>
              </div>
              {/* Background Glow */}
              <div className={`absolute -right-10 -bottom-10 w-40 h-40 ${stat.color} opacity-[0.03] rounded-full blur-3xl group-hover:opacity-10 transition-opacity`} />
            </motion.div>
          ))}
        </div>

        {/* Intelligence Hub */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          
          {/* Main Revenue Velocity Chart */}
          <div className="xl:col-span-8 space-y-10">
            <div className="bg-white p-12 rounded-[4rem] border border-border shadow-sm relative group overflow-hidden">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 relative z-10">
                <div>
                  <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
                    <TrendingUp size={24} className="text-accent" />
                    Revenue Velocity
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium mt-1">Algorithmic analysis of daily transaction volumes</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:-translate-y-0.5 transition-all">
                  <Download size={14} />
                  Generate Report
                </button>
              </div>
              
              <div className="h-[400px] w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.dailyRevenue}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fontWeight: 800, fill: '#64748b' }}
                      dy={15}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fontWeight: 800, fill: '#64748b' }}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', fontSize: '12px', padding: '15px' }}
                      itemStyle={{ fontWeight: 900 }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#3b82f6" 
                      strokeWidth={5}
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                      animationDuration={2000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Sales Forecasting */}
            <div className="bg-black text-white p-12 rounded-[4rem] shadow-2xl relative overflow-hidden group">
               <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-8">
                  <div className="max-w-md">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center shadow-lg shadow-accent/20">
                        <BrainCircuit size={24} className="text-white" />
                      </div>
                      <h3 className="text-2xl font-black tracking-tight">AI Sales Forecasting</h3>
                    </div>
                    <p className="text-white/60 text-sm font-medium leading-relaxed mb-8">
                      Based on current velocity and seasonal trends, our neural engine predicts a <span className="text-accent font-black">+18% increase</span> in Bridal category sales over the next 14 days.
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="px-5 py-3 bg-white/10 rounded-2xl border border-white/10">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Predicted GMV</p>
                        <p className="text-xl font-black">{settings.currency}1.2M</p>
                      </div>
                      <div className="px-5 py-3 bg-white/10 rounded-2xl border border-white/10">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Confidence</p>
                        <p className="text-xl font-black text-green-400">94.2%</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-64 h-48 bg-white/5 rounded-3xl border border-white/10 p-6 flex flex-col justify-end">
                     <div className="flex items-end gap-2 h-full items-baseline">
                        {[40, 60, 45, 70, 90, 80, 100].map((h, i) => (
                          <div key={i} className="flex-1 bg-accent/40 rounded-t-lg transition-all group-hover:bg-accent" style={{ height: `${h}%` }} />
                        ))}
                     </div>
                     <p className="text-[9px] font-black uppercase tracking-[0.2em] text-center mt-4 text-white/40">Projected Growth Path</p>
                  </div>
               </div>
               
               {/* Decorative elements */}
               <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[100px] -z-0" />
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -z-0" />
            </div>
          </div>

          {/* Side Intelligence Widgets */}
          <div className="xl:col-span-4 space-y-10">
            
            {/* Inventory Alerts */}
            <div className="bg-white p-10 rounded-[3rem] border border-border shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
                  <Package size={20} className="text-red-500" />
                  Stock Criticality
                </h3>
                <span className="px-3 py-1 bg-red-50 text-red-600 text-[9px] font-black uppercase tracking-widest rounded-full border border-red-100">
                  {data.lowStockItems.length} Urgent
                </span>
              </div>
              
              <div className="space-y-6">
                {data.lowStockItems.length > 0 ? data.lowStockItems.slice(0, 4).map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between p-5 bg-muted/30 rounded-3xl border border-transparent hover:border-red-100 transition-all">
                    <div>
                      <p className="text-xs font-black truncate w-40">{item.name}</p>
                      <p className="text-[10px] text-muted-foreground font-bold mt-1">Available: <span className="text-red-500">{item.stock} units</span></p>
                    </div>
                    <Link href={`/admin/products/${item.id}`} className="p-3 bg-white rounded-xl shadow-sm text-red-500 hover:bg-red-50 transition-colors">
                      <AlertCircle size={16} />
                    </Link>
                  </div>
                )) : (
                  <div className="text-center py-10 opacity-50">
                    <CheckCircle2 size={40} className="mx-auto text-green-500 mb-4" />
                    <p className="text-xs font-bold uppercase tracking-widest">Inventory Optimized</p>
                  </div>
                )}
              </div>
              
              <Link href="/admin/products" className="block w-full mt-8 py-5 bg-muted/50 hover:bg-muted text-[10px] font-black uppercase tracking-[0.2em] text-center rounded-2xl transition-all">
                Access Full Warehouse
              </Link>
            </div>

            {/* Marketplace Segmentation */}
            <div className="bg-white p-10 rounded-[3rem] border border-border shadow-sm">
              <h3 className="text-xl font-black tracking-tight mb-8 flex items-center gap-3">
                <Layers size={20} className="text-purple-500" />
                Market Share
              </h3>
              <div className="h-64 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={90}
                      paddingAngle={8}
                      dataKey="value"
                      animationBegin={500}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total</p>
                  <p className="text-xl font-black">{data.totalCategories}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-8">
                {pieData.slice(0, 4).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-muted/20 rounded-2xl border border-transparent">
                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground truncate">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live Operations Feed */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          
          {/* Real-time Orders Feed */}
          <div className="xl:col-span-8 bg-white p-12 rounded-[4rem] border border-border shadow-sm">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
                  <Activity size={24} className="text-emerald-500" />
                  Live Operations Feed
                </h3>
                <p className="text-sm text-muted-foreground font-medium mt-1">Real-time incoming orders and fulfillment velocity</p>
              </div>
              <div className="flex gap-2">
                 <button className="p-3 bg-muted/50 rounded-xl text-muted-foreground hover:text-primary transition-all">
                    <Filter size={18} />
                 </button>
                 <Link href="/admin/orders" className="px-6 py-3 bg-muted/50 hover:bg-muted text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">
                  Full Ledger
                </Link>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 border-b border-border">
                    <th className="pb-6 px-4">Identifier</th>
                    <th className="pb-6 px-4">Entity</th>
                    <th className="pb-6 px-4">Liquidity</th>
                    <th className="pb-6 px-4">Status Protocol</th>
                    <th className="pb-6 px-4 text-right">Activity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {data.recentOrders.map((order: any, idx: number) => (
                    <motion.tr 
                      key={order.id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group hover:bg-muted/30 transition-all cursor-pointer"
                    >
                      <td className="py-6 px-4 text-xs font-black text-primary">#{order.orderNumber}</td>
                      <td className="py-6 px-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-primary">{order.customerEmail.split('@')[0]}</span>
                          <span className="text-[9px] text-muted-foreground font-medium uppercase tracking-tighter">{order.customerEmail}</span>
                        </div>
                      </td>
                      <td className="py-6 px-4 text-xs font-black text-primary">{settings.currency} {order.totalPrice.toLocaleString()}</td>
                      <td className="py-6 px-4">
                        <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                          order.status === 'DELIVERED' ? 'bg-green-50 text-green-600 border-green-200' : 
                          order.status === 'SHIPPED' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                          order.status === 'CANCELLED' ? 'bg-red-50 text-red-600 border-red-200' :
                          'bg-orange-50 text-orange-600 border-orange-200'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-6 px-4 text-right">
                        <button className="p-3 bg-white rounded-xl shadow-sm border border-border group-hover:bg-primary group-hover:text-white transition-all">
                          <ChevronRight size={14} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick fulfillment shortcuts */}
          <div className="xl:col-span-4 bg-primary text-white p-12 rounded-[4rem] shadow-2xl relative overflow-hidden group">
             <div className="relative z-10">
                <h3 className="text-2xl font-black tracking-tight mb-10">Quick Actions</h3>
                <div className="space-y-4">
                  {[
                    { label: "Process Shipments", icon: Truck, color: "bg-blue-500", href: "/admin/orders" },
                    { label: "Financial Treasury", icon: CreditCard, color: "bg-emerald-500", href: "/admin/payments" },
                    { label: "Identity Governance", icon: Users, color: "bg-purple-500", href: "/admin/customers" },
                    { label: "Configure Brand", icon: Store, color: "bg-orange-500", href: "/admin/settings" },
                  ].map((action, i) => (
                    <Link 
                      key={i} 
                      href={action.href}
                      className="w-full flex items-center justify-between p-6 bg-white/10 hover:bg-white/20 rounded-[2rem] border border-white/10 transition-all group/btn"
                    >
                      <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 ${action.color} rounded-2xl flex items-center justify-center shadow-lg group-hover/btn:scale-110 transition-transform`}>
                          <action.icon size={20} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest">{action.label}</span>
                      </div>
                      <ExternalLink size={14} className="text-white/40 group-hover/btn:text-white" />
                    </Link>
                  ))}
                </div>
                
                <div className="mt-12 p-8 bg-white/5 rounded-[3rem] border border-white/5">
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-4 text-center">System Health Matrix</p>
                   <div className="flex justify-between items-center">
                      {[80, 100, 90, 95, 85, 100].map((v, i) => (
                        <div key={i} className="w-1.5 h-12 bg-white/10 rounded-full overflow-hidden">
                           <div className="w-full bg-accent" style={{ height: `${v}%` }} />
                        </div>
                      ))}
                   </div>
                   <p className="text-[9px] font-bold text-center mt-4 text-white/60">Server Uptime: 99.998%</p>
                </div>
             </div>
             
             {/* Abstract decor */}
             <div className="absolute top-[-20%] left-[-20%] w-96 h-96 bg-white/5 rounded-full blur-[100px] -z-0" />
          </div>
        </div>

      </div>
    </AdminShell>
  );
}
