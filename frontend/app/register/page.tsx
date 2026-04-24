'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, ArrowRight, Loader2, AlertCircle, CheckCircle2, Chrome, Github } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSocialLogin = async (provider: string) => {
    setLoading(true);
    setError('');
    
    const mockData = {
      provider,
      email: provider === 'google' ? `google_${Date.now()}@example.com` : `github_${Date.now()}@example.com`,
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
        setError(data.message || 'Social authentication failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center pt-32 pb-20 px-4">
      <div className="w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-12 rounded-[3rem] shadow-xl border border-border"
        >
          {success ? (
            <div className="text-center py-10 space-y-6">
              <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto border border-green-100">
                <CheckCircle2 size={40} />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter">Account Created</h2>
                <p className="text-muted-foreground">Redirecting you to the login portal...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-10">
                <h1 className="text-4xl font-bold tracking-tighter mb-4">Create Account</h1>
                <p className="text-muted-foreground">Join the exclusive world of SHAHIPOSH</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-bold animate-shake">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-4">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe" 
                      className="w-full bg-muted border-none rounded-2xl px-14 py-4 text-sm focus:ring-1 focus:ring-accent transition-luxury outline-none" 
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com" 
                      className="w-full bg-muted border-none rounded-2xl px-14 py-4 text-sm focus:ring-1 focus:ring-accent transition-luxury outline-none" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-4">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input 
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+92 300 0000000" 
                      className="w-full bg-muted border-none rounded-2xl px-14 py-4 text-sm focus:ring-1 focus:ring-accent transition-luxury outline-none" 
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
                      className="w-full bg-muted border-none rounded-2xl px-14 py-4 text-sm focus:ring-1 focus:ring-accent transition-luxury outline-none" 
                    />
                  </div>
                </div>

                <button 
                  disabled={loading}
                  className="btn-premium w-full py-4 flex items-center justify-center gap-3 shadow-xl shadow-primary/10"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : "Create Account"}
                  {!loading && <ArrowRight size={18} />}
                </button>
              </form>

              <div className="relative my-10">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-[0.2em]">
                  <span className="bg-white px-4 text-muted-foreground">Or join with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => handleSocialLogin('google')}
                  className="flex items-center justify-center gap-2 p-4 border border-border rounded-2xl hover:bg-muted transition-luxury"
                >
                  <Chrome size={18} className="text-[#DB4437]" />
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
                Already have an account?{" "}
                <Link href="/login" className="text-primary font-bold hover:text-accent transition-luxury">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
