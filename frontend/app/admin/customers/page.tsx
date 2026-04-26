'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Users, Search, Mail, Phone, Trash2, Edit3, Shield, Calendar, UserCheck } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const [filterRole, setFilterRole] = useState('All');

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/admin/customers');
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(c => {
    const matchesRole = filterRole === 'All' || c.role === filterRole;
    const matchesSearch = 
      (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone || '').includes(searchTerm);
    return matchesRole && matchesSearch;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'bg-purple-50 text-purple-600 border-purple-100 shadow-sm';
      case 'ADMIN': return 'bg-accent/10 text-accent border-accent/20 shadow-sm';
      case 'STAFF': return 'bg-blue-50 text-blue-600 border-blue-100 shadow-sm';
      default: return 'bg-muted/50 text-muted-foreground border-border';
    }
  };

  return (
    <AdminShell>
      <div className="space-y-10 pb-20">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 border-b border-border pb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-accent">
              <Shield size={14} />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Identity Governance</span>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tighter">Admin/Customer Control</h1>
            <p className="text-muted-foreground max-w-md">Manage system privileges and customer relationships from a unified command center.</p>
          </div>
          
          <div className="flex gap-4 w-full lg:w-auto">
            {['All', 'ADMIN', 'CUSTOMER'].map((role) => (
              <button
                key={role}
                onClick={() => setFilterRole(role)}
                className={`flex-1 lg:flex-none px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filterRole === role 
                    ? 'bg-primary text-white shadow-xl shadow-primary/20 -translate-y-1' 
                    : 'bg-white text-muted-foreground border-2 border-border hover:border-accent hover:text-primary'
                }`}
              >
                {role === 'ADMIN' ? 'Staff/Admins' : role === 'CUSTOMER' ? 'Retail Clients' : 'Unified View'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10">
          <div className="flex items-center gap-4 bg-white px-8 py-6 rounded-[2.5rem] border border-border shadow-2xl focus-within:ring-2 focus-within:ring-accent/20 transition-all">
            <Search size={22} className="text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Query by Name, Email, or Telephone Number..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-sm font-bold placeholder:text-muted-foreground/40"
            />
          </div>

          <div className="bg-white rounded-[3.5rem] border border-border shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/30">
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Identity Profile</th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Communication</th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center">Protocol Status</th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center">Enlisted On</th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-32 text-center">
                        <div className="flex flex-col items-center gap-6">
                          <div className="w-14 h-14 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Syncing User Directory...</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-32 text-center text-muted-foreground italic font-medium">
                        No identities found matching your current query.
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <tr key={customer.id} className="group hover:bg-muted/20 transition-all duration-300">
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-primary/5 text-primary flex items-center justify-center font-black text-xl border border-primary/10 group-hover:scale-110 transition-transform shadow-inner">
                              {customer.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <p className="font-black text-base tracking-tighter text-primary">{customer.name || 'Anonymous Protocol'}</p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border ${getRoleBadge(customer.role)}`}>
                                  {customer.role}
                                </span>
                                {customer.role === 'SUPER_ADMIN' && <Shield size={12} className="text-accent fill-accent/10" />}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3 text-xs font-black text-primary/80">
                              <Mail size={14} className="text-accent" />
                              {customer.email}
                            </div>
                            <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground">
                              <Phone size={14} />
                              {customer.phone || 'N/A'}
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-8 text-center">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border ${
                            customer.isActive 
                              ? 'bg-green-50 text-green-600 border-green-100 shadow-sm' 
                              : 'bg-red-50 text-red-600 border-red-100'
                          }`}>
                            {customer.isActive ? 'OPERATIONAL' : 'DEACTIVATED'}
                          </span>
                        </td>
                        <td className="px-10 py-8 text-center">
                          <div className="inline-flex flex-col items-center p-3 bg-muted/30 rounded-2xl border border-border/50">
                            <Calendar size={14} className="text-accent mb-1.5" />
                            <span className="text-[10px] font-black tracking-tighter uppercase">
                              {format(new Date(customer.createdAt), 'dd MMM yyyy')}
                            </span>
                          </div>
                        </td>
                        <td className="px-10 py-8 text-right">
                          <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="w-12 h-12 rounded-2xl bg-white border-2 border-border flex items-center justify-center hover:text-accent hover:border-accent hover:shadow-xl transition-all hover:-translate-y-1">
                              <Edit3 size={18} />
                            </button>
                            <button className="w-12 h-12 rounded-2xl bg-white border-2 border-border flex items-center justify-center hover:text-red-600 hover:border-red-600 hover:shadow-xl transition-all hover:-translate-y-1">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
