'use client';

import { motion } from 'framer-motion';
import { User, ShoppingBag, MapPin, Heart, LogOut, Settings, ChevronRight, Package, Clock } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const user = {
    name: "John Doe",
    email: "john@example.com",
    memberSince: "March 2024"
  };

  const recentOrders = [
    { id: "ORD-9283", date: "22 Oct 2024", status: "Delivered", total: "Rs 12,500" },
    { id: "ORD-9102", date: "15 Oct 2024", status: "Shipped", total: "Rs 8,200" }
  ];

  return (
    <div className="bg-background min-h-screen pt-32 pb-20">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Sidebar */}
          <aside className="lg:col-span-3 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-border shadow-sm">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-xl">
                  <User size={40} className="text-accent" />
                </div>
                <h2 className="text-xl font-bold tracking-tight">{user.name}</h2>
                <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] mt-1">Premium Member</p>
              </div>

              <nav className="space-y-2">
                {[
                  { icon: User, label: "Profile Info", active: true },
                  { icon: ShoppingBag, label: "My Orders", active: false },
                  { icon: Heart, label: "Wishlist", active: false },
                  { icon: MapPin, label: "Addresses", active: false },
                  { icon: Settings, label: "Settings", active: false },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-medium transition-luxury ${
                      item.active ? 'bg-primary text-white' : 'hover:bg-muted text-muted-foreground hover:text-primary'
                    }`}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </button>
                ))}
                
                <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-medium text-red-500 hover:bg-red-50 transition-luxury mt-10">
                  <LogOut size={18} />
                  Sign Out
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9 space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Total Orders", value: "12", icon: Package },
                { label: "Wishlist Items", value: "05", icon: Heart },
                { label: "Active Orders", value: "01", icon: Clock },
              ].map((stat, idx) => (
                <div key={idx} className="bg-white p-8 rounded-[2rem] border border-border flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold tracking-tighter">{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center text-accent">
                    <stat.icon size={24} strokeWidth={1.5} />
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-white p-10 rounded-[2.5rem] border border-border">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold uppercase tracking-widest">Recent Orders</h3>
                <Link href="/orders" className="text-xs font-bold uppercase tracking-widest text-accent hover:underline underline-offset-4">View All</Link>
              </div>

              <div className="space-y-6">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-muted rounded-3xl group hover:bg-white hover:shadow-lg transition-luxury border border-transparent hover:border-border">
                    <div className="flex gap-6 items-center">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                        <ShoppingBag size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{order.id}</p>
                        <p className="text-xs text-muted-foreground">{order.date}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between md:gap-12 mt-4 md:mt-0">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {order.status}
                      </span>
                      <p className="font-bold text-sm">{order.total}</p>
                      <button className="p-2 hover:bg-primary hover:text-white rounded-full transition-luxury">
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Account Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-10 rounded-[2.5rem] border border-border">
                <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Default Address</h3>
                <div className="space-y-2">
                  <p className="font-bold">{user.name}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    House #123, Street 5, Gulberg III,<br />
                    Lahore, Pakistan<br />
                    +92 300 1234567
                  </p>
                </div>
                <button className="mt-8 text-xs font-bold uppercase tracking-widest text-accent hover:underline underline-offset-4">Edit Address</button>
              </div>

              <div className="bg-accent p-10 rounded-[2.5rem] text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-white/80">Support Status</h3>
                  <p className="text-2xl font-bold tracking-tighter mb-4">Need help with an order?</p>
                  <p className="text-sm text-white/70 mb-8 max-w-[200px]">Our customer concierge is available to assist you 24/7.</p>
                  <Link href="/contact" className="inline-block bg-white text-accent px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-luxury">
                    Contact Us
                  </Link>
                </div>
                <div className="absolute right-[-20%] bottom-[-20%] w-64 h-64 bg-white/10 rounded-full blur-3xl -z-0" />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
