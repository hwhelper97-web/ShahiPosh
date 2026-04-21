'use client';

import { FormEvent, useState } from 'react';
import { adminLogin } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { token } = await adminLogin(email, password);
      localStorage.setItem('admin_token', token);
      router.push('/admin');
    } catch {
      setError('Invalid admin credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-12 md:p-16 rounded-[3rem] shadow-2xl border border-border"
        >
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mx-auto mb-6 border border-accent/20">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-3xl font-bold tracking-tighter mb-2">Admin Gateway</h1>
            <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium">SHAHIPOSH Secure Login</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-4">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@shahiposh.com" 
                  className="w-full bg-muted border-none rounded-2xl px-14 py-4 text-sm focus:ring-1 focus:ring-accent transition-luxury" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-4">Password</label>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full bg-muted border-none rounded-2xl px-14 py-4 text-sm focus:ring-1 focus:ring-accent transition-luxury" 
                />
              </div>
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-red-500 text-xs font-bold uppercase tracking-widest text-center"
              >
                {error}
              </motion.p>
            )}

            <button 
              disabled={loading}
              className="btn-premium w-full py-5 flex items-center justify-center gap-3 shadow-xl disabled:opacity-70"
            >
              {loading ? "Verifying..." : "Access Dashboard"}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-12 text-center">
            <Link href="/" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-luxury">
              ← Return to Storefront
            </Link>
          </div>
        </motion.div>

        <p className="text-center mt-12 text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-bold">
          © 2026 SHAHIPOSH SYSTEM ADMINISTRATION
        </p>
      </div>
    </div>
  );
}
