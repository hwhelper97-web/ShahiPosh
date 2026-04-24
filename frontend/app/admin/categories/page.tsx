'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Image as ImageIcon,
  ChevronLeft,
  Loader2,
  FolderTree,
  Upload,
  Save,
  X
} from 'lucide-react';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  _count?: {
    products: number;
  };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ 
    name: '', 
    description: '', 
    image: '' 
  });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/categories');
      if (res.ok) setCategories(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const saveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/categories/${editingId}` : '/api/categories';
    const method = editingId ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      if (res.ok) {
        setIsAdding(false);
        setEditingId(null);
        setForm({ name: '', description: '', image: '' });
        await load();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'categories');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setForm({ ...form, image: data.filename });
      }
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const startEdit = (c: Category) => {
    setForm({
      name: c.name,
      description: c.description || '',
      image: c.image || ''
    });
    setEditingId(c.id);
    setIsAdding(true);
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    await load();
  };

  return (
    <AdminShell>
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 text-accent mb-2">
              <FolderTree size={14} />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Taxonomy Management</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tighter">Categories</h1>
            <p className="text-muted-foreground text-sm mt-1">Organize your catalog with logical groupings.</p>
          </div>
          
          <button 
            onClick={() => {
              if (isAdding) {
                setIsAdding(false);
                setEditingId(null);
              } else {
                setIsAdding(true);
                setEditingId(null);
                setForm({ name: '', description: '', image: '' });
              }
            }}
            className="btn-premium flex items-center gap-3 py-4 px-8 shadow-xl hover:shadow-accent/20 transition-all duration-500 group"
          >
            {isAdding ? <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> : <Plus size={20} className="group-hover:rotate-90 transition-transform" />}
            <span className="font-bold uppercase tracking-widest text-xs">
              {isAdding ? 'Back to List' : 'Create Category'}
            </span>
          </button>
        </div>

        {isAdding ? (
          <div className="bg-white rounded-[3rem] border border-border p-12 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <form onSubmit={saveCategory} className="space-y-8 max-w-2xl mx-auto">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-6">Category Name</label>
                <input 
                  required 
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Traditional Wear" 
                  className="w-full bg-muted/50 border-2 border-transparent rounded-2xl px-8 py-4 text-sm focus:border-accent focus:bg-white transition-all outline-none" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-6">Description</label>
                <textarea 
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the aesthetic of this category..." 
                  className="w-full bg-muted/50 border-2 border-transparent rounded-2xl px-8 py-4 text-sm focus:border-accent focus:bg-white transition-all outline-none resize-none" 
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-6">Category Visual (Image)</label>
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <ImageIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input 
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      placeholder="Image filename or URL..." 
                      className="w-full bg-muted/50 border-2 border-transparent rounded-2xl px-14 py-4 text-sm focus:border-accent focus:bg-white transition-all outline-none" 
                    />
                  </div>
                  <label className="cursor-pointer bg-primary text-white px-8 rounded-2xl flex items-center justify-center transition-all hover:bg-accent shadow-lg shadow-primary/20">
                    {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                  </label>
                </div>
                
                {form.image && (
                  <div className="relative w-40 h-40 bg-muted rounded-2xl overflow-hidden border-2 border-border shadow-md mx-auto mt-6">
                    <Image 
                      src={form.image.startsWith('http') || form.image.startsWith('/') ? form.image : `/categories/${form.image}`} 
                      alt="Preview" 
                      fill 
                      className="object-cover"
                    />
                    <button 
                      type="button"
                      onClick={() => setForm({ ...form, image: '' })}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              <button className="btn-premium w-full py-6 text-lg font-black shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex items-center justify-center gap-3">
                 <Save size={24} />
                 {editingId ? 'UPDATE CATEGORY' : 'PUBLISH CATEGORY'}
              </button>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <div key={category.id} className="bg-white rounded-[2.5rem] border border-border overflow-hidden group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className="h-48 bg-muted relative overflow-hidden">
                  {category.image ? (
                    <Image 
                      src={category.image.startsWith('http') || category.image.startsWith('/') ? category.image : `/categories/${category.image}`} 
                      alt={category.name} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                      <ImageIcon size={48} strokeWidth={1} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <div className="flex gap-2 w-full">
                      <button 
                        onClick={() => startEdit(category)}
                        className="flex-1 bg-white text-black py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:text-white transition-all"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => deleteCategory(category.id)}
                        className="w-12 bg-red-600 text-white py-2 rounded-xl flex items-center justify-center hover:bg-red-700 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-8 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold tracking-tight">{category.name}</h3>
                    <span className="text-[10px] font-black bg-primary/5 text-primary px-3 py-1 rounded-full border border-primary/10">
                      {category._count?.products || 0} ITEMS
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {category.description || 'No description provided for this collection.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
