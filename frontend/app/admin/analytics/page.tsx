'use client';

import { useEffect, useState } from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Package, 
  Layers, 
  Activity, 
  Download,
  Calendar,
  Filter,
  RefreshCw,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  TrendingUp as TrendingUpIcon
} from 'lucide-react';
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
import { useSettings } from '@/components/settings-context';
import { motion } from 'framer-motion';

export default function AnalyticsPage() {
  const { settings } = useSettings();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [timeframe, setTimeframe] = useState('7D');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/analytics');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) return (
    <AdminShell>
      <div className="h-[70vh] flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent animate-pulse">Aggregating Intelligence...</p>
      </div>
    </AdminShell>
  );

  const stats = [
    { label: "Net Revenue", value: `${settings.currency} ${(data.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, trend: "+14.2%", color: "bg-blue-600" },
    { label: "Total Orders", value: String(data.totalOrders || 0), icon: ShoppingBag, trend: "+8.4%", color: "bg-purple-600" },
    { label: "Average Value", value: `${settings.currency} ${(data.averageOrderValue || 0).toFixed(0)}`, icon: Activity, trend: "-2.1%", color: "bg-orange-600" },
    { label: "Customer Base", value: String(data.totalCustomers || 0), icon: Users, trend: "+12.5%", color: "bg-emerald-600" },
  ];

  const pieData = Object.entries(data.salesByCategory || {}).map(([name, value]) => ({ name, value }));
  const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#6366f1'];

  return (
    <AdminShell>
      <div className="space-y-12 max-w-[1600px] mx-auto pb-20">
        
        {/* Header */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 border-b border-border pb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-accent/10 text-accent text-[9px] font-black uppercase tracking-widest rounded-full border border-accent/20">Neural Engine</span>
              <span className="text-[10px] font-bold text-muted-foreground">Real-time Synchronization</span>
            </div>
            <h1 className="text-5xl font-black tracking-tight text-primary">Neural Analytics</h1>
            <p className="text-sm text-muted-foreground mt-2 font-medium">Sophisticated business intelligence and market forecasting suite.</p>
          </div>
          
          <div className="flex items-center gap-4">
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
            <button onClick={fetchAnalytics} className="p-4 bg-white border border-border rounded-2xl text-muted-foreground hover:text-primary transition-all shadow-sm">
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
            <button className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:-translate-y-0.5 transition-all">
              <Download size={14} />
              Export Dataset
            </button>
          </div>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-10 rounded-[3rem] border border-border shadow-sm hover:shadow-2xl transition-all duration-500"
            >
              <div className="flex justify-between items-start mb-8">
                <div className={`w-14 h-14 ${stat.color} text-white rounded-2xl flex items-center justify-center shadow-lg`}>
                  <stat.icon size={28} />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-black px-3 py-1.5 rounded-full ${stat.trend.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {stat.trend.startsWith('+') ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {stat.trend}
                </div>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-3xl font-black tracking-tighter text-primary">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          
          {/* Revenue Velocity */}
          <div className="xl:col-span-8 bg-white p-12 rounded-[4rem] border border-border shadow-sm">
             <div className="flex justify-between items-center mb-12">
                <div>
                  <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
                    <TrendingUpIcon size={24} className="text-blue-500" />
                    Revenue Velocity
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium mt-1">Growth progression over the current cycle</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground">
                  <Calendar size={14} />
                  Last 7 Days
                </div>
             </div>
             
             <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.dailyRevenue}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                    <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Market Segmentation */}
          <div className="xl:col-span-4 bg-white p-12 rounded-[4rem] border border-border shadow-sm">
             <h3 className="text-2xl font-black tracking-tight mb-12 flex items-center gap-3">
                <PieChartIcon size={24} className="text-purple-500" />
                Market Share
             </h3>
             <div className="h-[300px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Volume</p>
                  <p className="text-2xl font-black">100%</p>
                </div>
             </div>
             <div className="space-y-4 mt-12">
                {pieData.slice(0, 4).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="text-xs font-black">{settings.currency}{(item.value as number || 0).toLocaleString()}</span>

                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Hot Items Section */}
        <div className="bg-white p-12 rounded-[4rem] border border-border shadow-sm">
           <div className="flex justify-between items-center mb-12">
              <div>
                <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
                  <TrendingUp size={24} className="text-orange-500" />
                  Demand Velocity
                </h3>
                <p className="text-sm text-muted-foreground font-medium mt-1">Highest performing assets by transaction volume</p>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {data.hotItems.map((item: any, idx: number) => (
                <div key={idx} className="group cursor-pointer">
                  <div className="aspect-square rounded-[2rem] bg-muted mb-4 overflow-hidden relative border border-border">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-xl flex items-center justify-center font-black text-xs shadow-lg">
                      #{idx + 1}
                    </div>
                  </div>
                  <p className="text-xs font-black truncate">{item.name}</p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">{item.count} Sold</p>
                    <p className="text-xs font-black text-accent">{settings.currency}{item.revenue.toLocaleString()}</p>
                  </div>
                  <div className="w-full bg-muted/30 h-1.5 rounded-full mt-4 overflow-hidden">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.count / data.hotItems[0].count) * 100}%` }}
                        className="bg-accent h-full rounded-full" 
                      />
                  </div>
                </div>
              ))}
           </div>
        </div>

      </div>
    </AdminShell>
  );
}
