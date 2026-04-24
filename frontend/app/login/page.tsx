'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Github, Chrome, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('user_token', data.token);
        
        // Also check if this user is the admin
        if (email === 'abidtanha1@gmail.com') {
           // We'll let the user login to admin specifically if they want, 
           // but for now we'll just send them to dashboard.
           // They can jump to admin from there.
        }
        
        router.push('/dashboard');
        router.refresh();
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setLoading(true);
    setError('');
    
    // Simulate social login for now since we don't have OAuth keys
    const mockData = {
      provider,
      email: provider === 'google' ? 'google_user@example.com' : 'github_user@example.com',
      name: provider === 'google' ? 'Google Explorer' : 'GitHub Dev',
    };

    try {
      const res = await fetch('/api/auth/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('user_token', data.token);
        router.push('/dashboard');
        router.refresh();
      } else {
        setError(data.message || 'Social login failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
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
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-bold animate-shake">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-4">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com" 
                  className="w-full bg-muted border-none rounded-2xl px-14 py-4 text-sm focus:ring-1 focus:ring-accent transition-luxury outline-none" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-4">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Password</label>
                <Link href="/forgot-password" className="text-xs font-medium text-accent hover:underline underline-offset-4">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full bg-muted border-none rounded-2xl px-14 py-4 text-sm focus:ring-1 focus:ring-accent transition-luxury outline-none" 
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className="btn-premium w-full py-4 flex items-center justify-center gap-3 shadow-xl shadow-primary/10"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Sign In"}
              {!loading && <ArrowRight size={18} />}
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
            <button 
              onClick={() => handleSocialLogin('google')}
              className="flex items-center justify-center gap-2 p-4 border border-border rounded-2xl hover:bg-muted transition-luxury"
            >
              <Chrome size={18} />
              <span className="text-sm font-medium">Google</span>
            </button>
            <button 
              onClick={() => handleSocialLogin('github')}
              className="flex items-center justify-center gap-2 p-4 border border-border rounded-2xl hover:bg-muted transition-luxury"
            >
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
