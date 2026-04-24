'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Mail, Lock, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      router.push('/admin');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('admin_token', data.token);
        setSuccess(true);
        setTimeout(() => {
          router.push('/admin');
        }, 1500);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px] -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -ml-48 -mb-48" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-primary text-white rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-primary/20 rotate-3">
            <Shield size={40} />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter">Admin Portal</h1>
            <p className="text-sm text-muted-foreground uppercase tracking-[0.2em] font-bold">Secure Authentication</p>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-border">
          {success ? (
            <div className="py-10 text-center space-y-6 animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto border border-green-100">
                <CheckCircle2 size={40} />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Access Granted</h2>
                <p className="text-sm text-muted-foreground">Synchronizing secure session...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-8">
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold text-center animate-shake">
                  {error}
                </div>
              )}

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-6">Admin Identifier</label>
                  <div className="relative">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input 
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@shahiposh.com"
                      className="w-full bg-muted/50 border-2 border-transparent rounded-[1.5rem] px-16 py-4 text-sm focus:border-accent focus:bg-white transition-all outline-none" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-6">Secure Key</label>
                  <div className="relative">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input 
                      required
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-muted/50 border-2 border-transparent rounded-[1.5rem] px-16 py-4 text-sm focus:border-accent focus:bg-white transition-all outline-none" 
                    />
                  </div>
                </div>
              </div>

              <button 
                disabled={loading}
                className="btn-premium w-full py-5 text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl group"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    Initialize Session
                    <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        <div className="text-center">
          <Link href="/" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
            Return to Public Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
