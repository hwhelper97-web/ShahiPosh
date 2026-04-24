'use client';
import { AdminShell } from '@/components/admin-shell';
import { Construction, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PlaceholderPage({ title, module }: { title: string, module: string }) {
  const router = useRouter();
  
  return (
    <AdminShell>
      <div className="max-w-7xl mx-auto h-[70vh] flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in duration-700">
        <div className="relative">
          <div className="w-32 h-32 bg-accent/10 rounded-[3rem] flex items-center justify-center animate-pulse">
            <Construction size={64} className="text-accent" />
          </div>
          <div className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-black px-4 py-2 rounded-full shadow-lg">
            IN DEVELOPMENT
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-5xl font-black tracking-tighter">{title}</h1>
          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
            The <span className="text-primary font-bold">{module}</span> module is currently being optimized for high-performance enterprise operations. 
            Full neural-link integration will be active soon.
          </p>
        </div>

        <button 
          onClick={() => router.back()}
          className="btn-premium flex items-center gap-3 py-4 px-10 shadow-xl group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold uppercase tracking-widest text-xs">Return to Dashboard</span>
        </button>

        <div className="grid grid-cols-3 gap-8 pt-12 border-t border-border w-full max-w-2xl">
           <div className="text-center">
             <p className="text-2xl font-black">98%</p>
             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Logic Ready</p>
           </div>
           <div className="text-center">
             <p className="text-2xl font-black">Ready</p>
             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Database Sync</p>
           </div>
           <div className="text-center">
             <p className="text-2xl font-black">AI</p>
             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Optimizing</p>
           </div>
        </div>
      </div>
    </AdminShell>
  );
}
