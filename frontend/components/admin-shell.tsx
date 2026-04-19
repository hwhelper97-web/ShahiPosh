'use client';

import Link from 'next/link';

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="container grid min-h-[70vh] gap-6 py-8 md:grid-cols-[220px,1fr]">
      <aside className="card p-4">
        <h2 className="mb-4 text-lg font-semibold">Admin</h2>
        <nav className="space-y-2 text-white/70">
          <Link href="/admin" className="block">Dashboard</Link>
          <Link href="/admin/login" className="block">Login</Link>
        </nav>
      </aside>
      <section className="card p-6">{children}</section>
    </div>
  );
}
