'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LayoutDashboard, ShoppingCart, Package, Users, Settings, LogOut, ExternalLink, Shield, FolderTree, TrendingUp, Truck, Store, Database, Megaphone, History, Mail, CreditCard } from 'lucide-react';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Basic JWT check (client-side)
    const token = localStorage.getItem('admin_token');
    if (!token && pathname !== '/admin/login') {
      router.push('/admin/login');
    } else {
      setIsAuthorized(true);
    }
  }, [pathname, router]);

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Categories', href: '/admin/categories', icon: FolderTree },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { label: 'Payments', href: '/admin/payments', icon: CreditCard },
    { label: 'Inventory', href: '/admin/inventory', icon: Database },
    { label: 'Messages', href: '/admin/messages', icon: Mail },
    { label: 'Customers', href: '/admin/customers', icon: Users },
    { label: 'Analytics', href: '/admin/analytics', icon: TrendingUp },
    { label: 'Audit Logs', href: '/admin/audit-logs', icon: History },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleSignOut = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin/login');
  };

  // If on login page, don't show the shell
  if (pathname === '/admin/login') return <>{children}</>;
  
  if (!isAuthorized) return (
    <div className="h-screen w-full flex items-center justify-center bg-muted/30">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Authenticating Protocol...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex">
      {/* Sidebar */}
      <aside className="w-72 border-r border-border bg-white hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-10">
          <Link href="/" className="group flex items-center gap-3">
            <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
              <Shield size={20} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter">SHAHIPOSH</h1>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] bg-accent/10 text-accent px-2 py-0.5 rounded-full">Systems</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-6 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                pathname === item.href 
                  ? 'bg-primary text-white shadow-2xl shadow-primary/20 -translate-y-0.5' 
                  : 'text-muted-foreground hover:bg-muted hover:text-primary'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-border space-y-2">
          <Link 
            href="/" 
            target="_blank"
            className="flex items-center gap-4 px-5 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest text-muted-foreground hover:bg-muted hover:text-primary transition-all duration-300"
          >
            <ExternalLink size={18} />
            Visit Storefront
          </Link>
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all duration-300"
          >
            <LogOut size={18} />
            Terminate Session
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 border-b border-border bg-white/80 backdrop-blur-md flex items-center justify-between px-10 sticky top-0 z-30">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60">
            {navItems.find(i => i.href === pathname)?.label || 'System Core'}
          </h2>
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black uppercase">System Admin</p>
              <p className="text-[9px] text-muted-foreground font-bold tracking-widest uppercase">Root Access</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-accent/10 flex items-center justify-center text-accent text-xs font-black border border-accent/20 shadow-inner">
              AD
            </div>
          </div>
        </header>

        <div className="p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
