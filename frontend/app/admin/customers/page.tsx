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

  const filteredCustomers = customers.filter(c => 
    (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminShell>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-accent">
              <Users size={14} />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Client Intelligence</span>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tighter">Customer CRM</h1>
            <p className="text-muted-foreground">Manage your exclusive member base and monitor account activity.</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white p-4 rounded-[2rem] border border-border shadow-sm">
          <Search size={18} className="text-muted-foreground ml-4" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm font-medium"
          />
        </div>

        <div className="bg-white rounded-[3rem] border border-border shadow-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Profile</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Contact</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Status</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Joined</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Management</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Syncing Database...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-muted-foreground">
                    No customers found in your database.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b border-border hover:bg-muted/30 transition-colors group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                          {customer.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-sm tracking-tight">{customer.name || 'Anonymous User'}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Shield size={10} className="text-accent" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{customer.role}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-bold">
                          <Mail size={12} className="text-muted-foreground" />
                          {customer.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Phone size={12} />
                          {customer.phone || 'No phone recorded'}
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-center">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                        customer.isActive ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
                      }`}>
                        {customer.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-center">
                      <div className="flex flex-col items-center">
                        <Calendar size={12} className="text-muted-foreground mb-1" />
                        <span className="text-[10px] font-bold">
                          {format(new Date(customer.createdAt), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-3 rounded-xl bg-muted hover:bg-primary hover:text-white transition-luxury">
                          <Edit3 size={16} />
                        </button>
                        <button className="p-3 rounded-xl bg-muted hover:bg-red-600 hover:text-white transition-luxury">
                          <Trash2 size={16} />
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
    </AdminShell>
  );
}
