'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate registration
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center pt-20 pb-20 px-4">
      <div className="w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-12 rounded-[3rem] shadow-xl border border-border"
        >
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold tracking-tighter mb-4">Join ShahiPosh</h1>
            <p className="text-muted-foreground">Create your account for a better experience</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-4">Full Name</label>
              <div className="relative">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                  required
                  placeholder="John Doe" 
                  className="w-full bg-muted border-none rounded-2xl px-14 py-4 text-sm focus:ring-1 focus:ring-accent transition-luxury" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-4">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                  required
                  type="email"
                  placeholder="name@example.com" 
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
                  placeholder="••••••••" 
                  className="w-full bg-muted border-none rounded-2xl px-14 py-4 text-sm focus:ring-1 focus:ring-accent transition-luxury" 
                />
              </div>
            </div>

            <div className="flex items-center gap-3 px-4">
              <input type="checkbox" id="terms" className="w-4 h-4 accent-accent rounded" required />
              <label htmlFor="terms" className="text-xs text-muted-foreground">
                I agree to the <Link href="/policies/terms" className="text-primary hover:underline underline-offset-4">Terms of Service</Link> and <Link href="/policies/privacy" className="text-primary hover:underline underline-offset-4">Privacy Policy</Link>
              </label>
            </div>

            <button 
              disabled={loading}
              className="btn-premium w-full py-4 flex items-center justify-center gap-3"
            >
              {loading ? "Creating account..." : "Create Account"}
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-10">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-bold hover:text-accent transition-luxury">
              Sign In
            </Link>
          </p>

          <div className="mt-10 pt-8 border-t border-border flex items-center justify-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest">
            <ShieldCheck size={14} className="text-accent" />
            100% Secure registration process
          </div>
        </motion.div>
      </div>
    </div>
  );
}
