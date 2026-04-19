'use client';

import { FormEvent, useState } from 'react';
import { adminLogin } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const { token } = await adminLogin(email, password);
      localStorage.setItem('admin_token', token);
      router.push('/admin');
    } catch {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="container max-w-lg py-12">
      <form onSubmit={onSubmit} className="card space-y-4 p-6">
        <h1 className="text-2xl font-semibold">Admin Login</h1>
        <input type="email" placeholder="Email" required className="w-full rounded-xl border border-white/20 bg-transparent px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" required className="w-full rounded-xl border border-white/20 bg-transparent px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-red-400">{error}</p>}
        <button className="rounded-full bg-accent px-6 py-3 text-black">Login</button>
      </form>
    </div>
  );
}
