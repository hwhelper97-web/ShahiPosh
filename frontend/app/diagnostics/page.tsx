'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, Database, Cloud, AlertCircle, CheckCircle2, Server } from 'lucide-react';

export default function DiagnosticsPage() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const runDiagnostics = async () => {
    setLoading(true);
    try {
      const tests = [
        { name: 'API Availability', url: '/api/settings' },
        { name: 'Products Database', url: '/api/products' },
        { name: 'Categories Database', url: '/api/categories' },
      ];

      const report: any[] = [];

      for (const test of tests) {
        const start = Date.now();
        try {
          const res = await fetch(test.url);
          const duration = Date.now() - start;
          if (res.ok) {
            report.push({ name: test.name, status: 'pass', msg: `Connected in ${duration}ms`, details: await res.json() });
          } else {
            const errData = await res.json().catch(() => ({}));
            report.push({ name: test.name, status: 'fail', msg: `Failed with status ${res.status}`, details: errData });
          }
        } catch (err: any) {
          report.push({ name: test.name, status: 'fail', msg: 'Network or Server Error', details: err.message });
        }
      }

      setResults(report);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  return (
    <div className="bg-neutral-900 min-h-screen text-white pt-32 pb-20 font-mono">
      <div className="container max-w-4xl">
        <div className="flex items-center gap-4 mb-12">
          <Server className="text-accent" size={32} />
          <h1 className="text-3xl font-bold tracking-tighter uppercase">System Diagnostics</h1>
        </div>

        {loading ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin mx-auto" />
            <p className="text-accent animate-pulse uppercase tracking-widest text-xs">Scanning Infrastructure...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {results?.map((res: any, idx: number) => (
              <div 
                key={idx} 
                className={`p-8 rounded-3xl border-2 transition-all ${
                  res.status === 'pass' ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-rose-500/20 bg-rose-500/5'
                }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    {res.status === 'pass' ? (
                      <CheckCircle2 className="text-emerald-500" size={24} />
                    ) : (
                      <AlertCircle className="text-rose-500" size={24} />
                    )}
                    <h3 className="text-lg font-bold uppercase">{res.name}</h3>
                  </div>
                  <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    res.status === 'pass' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'
                  }`}>
                    {res.status}
                  </span>
                </div>
                
                <p className="text-sm text-neutral-400 mb-4">{res.msg}</p>
                
                <div className="bg-black/40 rounded-xl p-4 overflow-auto max-h-40">
                  <pre className="text-[10px] leading-relaxed text-neutral-500">
                    {JSON.stringify(res.details, null, 2)}
                  </pre>
                </div>
              </div>
            ))}

            <button 
              onClick={runDiagnostics}
              className="w-full py-4 border-2 border-accent text-accent rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-accent hover:text-white transition-all"
            >
              Restart Global Scan
            </button>
          </div>
        )}

        <div className="mt-12 p-8 bg-black/20 rounded-3xl border border-white/5 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500">Troubleshooting Guide</h4>
          <p className="text-xs text-neutral-400 leading-relaxed">
            If <span className="text-rose-400">Products Database</span> fails, check your <code className="text-white">DATABASE_URL</code> in Vercel. 
            Ensure you are using the <strong className="text-white">Transaction Mode (Session)</strong> URL from Supabase.
          </p>
        </div>
      </div>
    </div>
  );
}
