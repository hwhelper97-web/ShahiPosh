'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Github, Chrome } from 'lucide-react';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate login
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
            <h1 className="text-4xl font-bold tracking-tighter mb-4">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your SHAHIPOSH account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
              <div className="flex justify-between items-center px-4">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Password</label>
                <Link href="/forgot-password" size="sm" className="text-xs font-medium text-accent hover:underline underline-offset-4">Forgot?</Link>
              </div>
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

            <button 
              disabled={loading}
              className="btn-premium w-full py-4 flex items-center justify-center gap-3"
            >
              {loading ? "Signing in..." : "Sign In"}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-[0.2em]">
              <span className="bg-white px-4 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 p-4 border border-border rounded-2xl hover:bg-muted transition-luxury">
              <Chrome size={18} />
              <span className="text-sm font-medium">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 p-4 border border-border rounded-2xl hover:bg-muted transition-luxury">
              <Github size={18} />
              <span className="text-sm font-medium">GitHub</span>
            </button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-10">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary font-bold hover:text-accent transition-luxury">
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
