'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingCart, Package, Users, Settings, LogOut, ExternalLink } from 'lucide-react';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { label: 'Customers', href: '/admin/customers', icon: Users },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-white hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <Link href="/" className="group flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tighter">SHAHIPOSH</h1>
            <span className="text-[10px] font-bold uppercase tracking-widest bg-accent/10 text-accent px-2 py-0.5 rounded-full">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-luxury ${
                pathname === item.href 
                  ? 'bg-primary text-white shadow-lg' 
                  : 'text-muted-foreground hover:bg-muted hover:text-primary'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border space-y-1">
          <Link 
            href="/" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-primary transition-luxury"
          >
            <ExternalLink size={18} />
            View Store
          </Link>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-luxury">
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-white flex items-center justify-between px-8 sticky top-0 z-30">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
            {navItems.find(i => i.href === pathname)?.label || 'Admin Panel'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-bold border border-accent/20">
              AD
            </div>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
