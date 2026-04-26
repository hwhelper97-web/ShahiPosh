'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { useSettings } from '@/components/settings-context';
import { ShieldAlert, Mail, Phone, Instagram } from 'lucide-react';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { settings } = useSettings();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    // Admin pages get NO storefront navbar/footer and bypass maintenance
    return <>{children}</>;
  }

  if (settings.maintenanceMode === 'true') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10 text-center animate-in fade-in duration-1000">
        <div className="w-24 h-24 bg-primary text-white rounded-[2rem] flex items-center justify-center shadow-2xl mb-12 animate-bounce">
          <ShieldAlert size={40} />
        </div>
        
        <div className="space-y-4 mb-12 max-w-xl">
          <h1 className="text-6xl font-black tracking-tighter uppercase">Curating Perfection</h1>
          <p className="text-xl text-muted-foreground font-medium leading-relaxed">
            Our digital boutique is currently undergoing a scheduled transformation. We are refining our collection to bring you the ultimate in minimalist luxury.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-3xl border-t border-border pt-12">
          <div className="flex flex-col items-center gap-2">
            <Mail className="text-accent" size={20} />
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Contact Support</p>
            <p className="text-xs font-bold">{settings.storeEmail}</p>
          </div>
          <div className="flex flex-col items-center gap-2 border-x border-border">
            <Phone className="text-accent" size={20} />
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Phone Hotline</p>
            <p className="text-xs font-bold">{settings.storePhone}</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Instagram className="text-accent" size={20} />
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Follow Journey</p>
            <p className="text-xs font-bold">@shahiposh</p>
          </div>
        </div>

        <p className="mt-20 text-[9px] font-black uppercase tracking-[0.5em] text-muted-foreground/40 italic">
          ShahiPosh | Elevating The Ordinary
        </p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}
