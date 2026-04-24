'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Database, Search, Save, AlertTriangle, Plus, ArrowUpDown, RefreshCcw, Package, Box, Edit3 } from 'lucide-react';

export default function AdminInventoryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      // Fetch all products with their variants
      const res = await fetch('/api/products');
      if (res.ok) {
        const products = await res.json();
        // Flatten variants for easier management if they exist, or just show products
        const inventoryList: any[] = [];
        
        products.forEach((p: any) => {
          if (p.variants && p.variants.length > 0) {
            p.variants.forEach((v: any) => {
              inventoryList.push({
                id: v.id,
                productId: p.id,
                name: p.name,
                sku: v.sku || p.sku,
                stock: v.inventory,
                attributes: v.attributes,
                type: 'VARIANT',
                parentName: p.name
              });
            });
          } else {
            inventoryList.push({
              id: p.id,
              productId: p.id,
              name: p.name,
              sku: p.sku,
              stock: p.inventory,
              attributes: {},
              type: 'PRODUCT',
              parentName: p.name
            });
          }
        });
        
        setItems(inventoryList);
      }
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (id: string, type: string, newStock: number) => {
    setUpdatingId(id);
    try {
      const endpoint = type === 'VARIANT' ? `/api/inventory/variant/${id}` : `/api/inventory/product/${id}`;
      const res = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inventory: newStock })
      });
      
      if (res.ok) {
        setItems(items.map(item => item.id === id ? { ...item, stock: newStock } : item));
      }
    } catch (err) {
      console.error('Failed to update stock:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleBulkUpdate = async () => {
    setLoading(true);
    try {
      // Logic for bulk stock sync or reset
      const res = await fetch('/api/admin/inventory/bulk-sync', { method: 'POST' });
      if (res.ok) {
        alert('Bulk inventory synchronization successful.');
        fetchInventory();
      }
    } catch (err) {
      alert('Failed to perform bulk update.');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => 
    (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.sku || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminShell>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-accent">
              <Database size={14} />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Stock Ledger</span>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tighter">Inventory Control</h1>
            <p className="text-muted-foreground">Monitor real-time stock levels and manage SKU variants across your catalog.</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <button 
              onClick={fetchInventory}
              className="p-4 rounded-2xl bg-white border border-border hover:shadow-lg transition-luxury"
            >
              <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
            <button 
              onClick={handleBulkUpdate}
              disabled={loading}
              className="btn-premium flex-1 md:flex-none flex items-center justify-center gap-3 px-8"
            >
              <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
              <span className="text-xs font-bold uppercase tracking-widest">Bulk Sync Stock</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white p-4 rounded-[2rem] border border-border shadow-sm">
          <Search size={18} className="text-muted-foreground ml-4" />
          <input 
            type="text" 
            placeholder="Search by product name or SKU..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm font-medium"
          />
        </div>

        <div className="bg-white rounded-[3rem] border border-border shadow-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Product Detail</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">SKU</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Status</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">In Stock</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Syncing Catalog...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <Package size={48} className="mx-auto text-muted-foreground/20 mb-4" />
                    <p className="text-muted-foreground font-medium">No inventory items found.</p>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="border-b border-border hover:bg-muted/30 transition-colors group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.type === 'VARIANT' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'}`}>
                          {item.type === 'VARIANT' ? <Box size={18} /> : <Package size={18} />}
                        </div>
                        <div>
                          <p className="font-bold text-sm tracking-tight">{item.name}</p>
                          {item.type === 'VARIANT' && (
                            <div className="flex gap-2 mt-1">
                              {Object.entries(item.attributes).map(([key, val]: any) => (
                                <span key={key} className="text-[9px] font-black uppercase bg-muted px-2 py-0.5 rounded text-muted-foreground">
                                  {key}: {val}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <code className="text-xs font-bold bg-muted px-3 py-1 rounded-lg text-primary">{item.sku}</code>
                    </td>
                    <td className="px-10 py-6 text-center">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                        item.stock > 10 ? 'bg-green-50 text-green-600 border-green-100' :
                        item.stock > 0 ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        'bg-red-50 text-red-600 border-red-100'
                      }`}>
                        {item.stock > 10 ? 'Healthy' : item.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-center">
                      <div className="flex items-center justify-center gap-4">
                        <input 
                          type="number" 
                          value={item.stock}
                          onChange={(e) => updateStock(item.id, item.type, parseInt(e.target.value))}
                          disabled={updatingId === item.id}
                          className="w-20 bg-muted border-none rounded-xl px-3 py-2 text-center text-sm font-bold focus:ring-1 focus:ring-accent outline-none disabled:opacity-50"
                        />
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <button className="p-3 rounded-xl bg-muted hover:bg-accent hover:text-white transition-luxury">
                        <Edit3 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {filteredItems.some(item => item.stock <= 5) && (
          <div className="bg-amber-50 border border-amber-100 p-6 rounded-[2.5rem] flex items-start gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-amber-600 shadow-sm">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-amber-900">Replenishment Alert</h3>
              <p className="text-sm text-amber-800/80">Some items are running critically low on stock. Consider placing purchase orders with your vendors soon.</p>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
