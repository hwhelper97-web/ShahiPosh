'use client';

import { useEffect, useState, Suspense, useCallback, Fragment } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AdminShell } from '@/components/admin-shell';
import { Product } from '@/lib/types';
import { 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  Upload,
  Loader2,
  Package,
  Eye,
  Save,
  X,
  AlertCircle,
  GripVertical
} from 'lucide-react';
import Image from 'next/image';
import { useSettings } from '@/components/settings-context';
import RichTextEditor from '@/components/rich-text-editor';
import { useDropzone } from 'react-dropzone';
import toast, { Toaster } from 'react-hot-toast';

const API = '/api';

function AdminProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { settings } = useSettings();
  
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  const [form, setForm] = useState({ 
    name: '', 
    price: '', 
    discountPrice: '',
    description: '', 
    category: 'Men', 
    categoryId: '',
    sizes: ['S', 'M', 'L', 'XL'], 
    images: [] as string[],
    sku: '',
    inventory: '0',
    status: 'Active'
  });

  const load = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch(`${API}/products?admin=true`),
        fetch(`${API}/categories`)
      ]);
      
      if (prodRes.ok) setProducts(await prodRes.json());
      if (catRes.ok) setCategories(await catRes.json());
    } catch (err) {
      console.error(err);
      toast.error("Failed to sync inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    const uploadedImages: string[] = [];

    for (const file of acceptedFiles) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (res.ok) {
          uploadedImages.push(data.url);
        } else {
          toast.error(data.message || "Upload failed. Check Vercel Token.");
        }
      } catch (err) {
        console.error('Upload error:', err);
        toast.error("Network error during upload.");
      }
    }

    setForm(prev => ({ ...prev, images: [...prev.images, ...uploadedImages] }));
    setUploading(false);
    if (uploadedImages.length > 0) toast.success(`Uploaded ${uploadedImages.length} images`);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    multiple: true 
  } as any);

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    
    const payload = { 
      ...form, 
      price: Number(form.price), 
      discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
      inventory: Number(form.inventory),
      sizes: form.sizes, 
      images: form.images 
    };

    const url = editingId ? `${API}/products/${editingId}` : `${API}/products`;
    const method = editingId ? 'PATCH' : 'POST';

    if (!form.categoryId) {
      toast.error("Please select a valid category");
      return;
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        toast.success(editingId ? "Product synchronized" : "Product deployed");
        setIsAdding(false);
        setEditingId(null);
        setForm({ 
          name: '', price: '', discountPrice: '', description: '', 
          category: 'Men', categoryId: '', sizes: ['S', 'M', 'L', 'XL'], 
          images: [], sku: '', inventory: '0', status: 'Active' 
        });
        await load();
      } else {
        toast.error("Failed to save product");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    }
  };

  const startEdit = (p: any) => {
    let imagesArr = [];
    let sizesArr = [];
    
    try {
      imagesArr = typeof p.images === 'string' ? JSON.parse(p.images) : (p.images || []);
      sizesArr = typeof p.sizes === 'string' ? JSON.parse(p.sizes) : (p.sizes || []);
    } catch (e) {
      imagesArr = Array.isArray(p.images) ? p.images : [];
      sizesArr = Array.isArray(p.sizes) ? p.sizes : [];
    }

    setForm({
      name: p.name,
      price: String(p.regularPrice || 0),
      discountPrice: p.salePrice ? String(p.salePrice) : '',
      description: p.description || '',
      category: p.category?.name || p.category,
      categoryId: p.categoryId || '',
      sizes: sizesArr,
      images: imagesArr,
      sku: p.sku || '',
      inventory: String(p.inventory || 0),
      status: p.status || 'Active'
    });
    setEditingId(p.id);
    setIsAdding(true);
  };

  const deleteProduct = async (id: string) => {
    const token = localStorage.getItem('admin_token');
    const res = await fetch(`${API}/products/${id}`, { 
      method: 'DELETE', 
      headers: { Authorization: `Bearer ${token}` } 
    });
    if (res.ok) {
      toast.success("Product purged from catalog");
      setShowDeleteConfirm(null);
      await load();
    } else {
      toast.error("Failed to delete product");
    }
  };

  const removeImage = (idx: number) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx)
    }));
  };

  const getImageUrl = (img: any) => {
    if (!img) return "/placeholder.jpg";
    
    // Safety for production: Detect and rescue broken local paths
    const isProduction = typeof window !== 'undefined' && (window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1'));
    
    let src = typeof img === 'string' ? img : (img?.url || "");
    
    if (typeof src === 'string' && src.startsWith('{')) {
      try {
        const parsed = JSON.parse(src);
        src = parsed.url || src;
      } catch (e) {}
    }

    if (!src || typeof src !== 'string') return "/placeholder.jpg";
    
    // RESCUE: If on production and path is /uploads/, it's a broken local test image
    if (isProduction && src.startsWith('/uploads/')) return "/placeholder.jpg";

    if (src.startsWith("/") || src.startsWith("http")) return src;
    return `/products/${src}`;
  };

  if (loading && products.length === 0) return (
    <AdminShell>
      <div className="h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-accent" size={40} />
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Synchronizing Inventory...</p>
        </div>
      </div>
    </AdminShell>
  );

  return (
    <AdminShell>
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto space-y-10 pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 text-accent mb-2">
              <Package size={14} />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Stock Management</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tighter">Inventory Console</h1>
            <p className="text-muted-foreground text-sm mt-1">Control your luxury catalog and availability.</p>
          </div>
          
          <button 
            onClick={() => {
              if (isAdding) {
                setIsAdding(false);
                setEditingId(null);
              } else {
                setIsAdding(true);
                setEditingId(null);
                setForm({ 
                  name: '', price: '', discountPrice: '', description: '', 
                  category: 'Men', categoryId: '', sizes: ['S', 'M', 'L', 'XL'], 
                  images: [], sku: '', inventory: '0', status: 'Active' 
                });
              }
            }}
            className="btn-premium flex items-center gap-3 py-4 px-8 shadow-xl hover:shadow-accent/20 transition-all duration-500 group"
          >
            {isAdding ? <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> : <Plus size={20} className="group-hover:rotate-90 transition-transform" />}
            <span className="font-bold uppercase tracking-widest text-xs">
              {isAdding ? 'Back to Inventory' : 'Add New Item'}
            </span>
          </button>
        </div>

        {isAdding ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Form Column */}
            <div className="lg:col-span-8 space-y-8">
              <div className="bg-white rounded-[3rem] border border-border p-10 shadow-2xl space-y-10">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">{editingId ? 'Refine Product' : 'Onboard New Product'}</h2>
                  <p className="text-sm text-muted-foreground">Enter the technical specifications and aesthetic details.</p>
                </div>

                <form onSubmit={saveProduct} className="space-y-10">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-6">Product Title</label>
                      <input 
                        required 
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Royal Velvet Sherwani" 
                        className="w-full bg-muted/50 border-2 border-transparent rounded-2xl px-8 py-4 text-sm focus:border-accent focus:bg-white transition-all outline-none" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-6">SKU (Stock Keeping Unit)</label>
                      <input 
                        value={form.sku}
                        onChange={(e) => setForm({ ...form, sku: e.target.value })}
                        placeholder="e.g. SP-MS-001" 
                        className="w-full bg-muted/50 border-2 border-transparent rounded-2xl px-8 py-4 text-sm focus:border-accent focus:bg-white transition-all outline-none" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-6">Base Price ({settings.currency})</label>
                      <input 
                        required 
                        type="number"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        placeholder="25000" 
                        className="w-full bg-muted/50 border-2 border-transparent rounded-2xl px-8 py-4 text-sm focus:border-accent focus:bg-white transition-all outline-none" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-6">Discount Price (Optional)</label>
                      <input 
                        type="number"
                        value={form.discountPrice}
                        onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
                        placeholder="22000" 
                        className="w-full bg-muted/50 border-2 border-transparent rounded-2xl px-8 py-4 text-sm focus:border-accent focus:bg-white transition-all outline-none" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-6">Current Stock</label>
                      <input 
                        type="number"
                        value={form.inventory}
                        onChange={(e) => setForm({ ...form, inventory: e.target.value })}
                        placeholder="50" 
                        className="w-full bg-muted/50 border-2 border-transparent rounded-2xl px-8 py-4 text-sm focus:border-accent focus:bg-white transition-all outline-none" 
                      />
                    </div>
                  </div>

                  {/* Taxonomy & Status */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-6">Category</label>
                      <select 
                        value={form.categoryId}
                        onChange={(e) => {
                          const cat = categories.find(c => c.id === e.target.value);
                          setForm({ ...form, categoryId: e.target.value, category: cat ? cat.name : 'Uncategorized' });
                        }}
                        className="w-full bg-muted/50 border-2 border-transparent rounded-2xl px-8 py-4 text-sm focus:border-accent focus:bg-white transition-all outline-none appearance-none cursor-pointer"
                      >
                        <option value="">Select Category</option>
                        {categories
                          .filter(c => !c.parentId) // Main categories
                          .map(parent => (
                            <Fragment key={parent.id}>
                              <option value={parent.id} className="font-bold">{parent.name}</option>
                              {categories
                                .filter(c => c.parentId === parent.id) // Subcategories
                                .map(sub => (
                                  <option key={sub.id} value={sub.id}>&nbsp;&nbsp;-- {sub.name}</option>
                                ))
                              }
                            </Fragment>
                          ))
                        }
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-6">Status</label>
                      <select 
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                        className="w-full bg-muted/50 border-2 border-transparent rounded-2xl px-8 py-4 text-sm focus:border-accent focus:bg-white transition-all outline-none appearance-none cursor-pointer"
                      >
                        <option value="Active">Active</option>
                        <option value="Draft">Draft</option>
                        <option value="Out of stock">Out of Stock</option>
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-6">Description & Story</label>
                    <RichTextEditor 
                      value={form.description} 
                      onChange={(val) => setForm({ ...form, description: val })}
                      placeholder="Describe the fabric, embroidery, and fit..."
                    />
                  </div>

                  {/* Images Dropzone */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-6">Visual Assets (Multi-Upload)</label>
                    <div 
                      {...getRootProps() as any} 
                      className={`border-4 border-dashed rounded-[2.5rem] p-12 flex flex-col items-center justify-center transition-all cursor-pointer ${
                        isDragActive ? 'border-accent bg-accent/5' : 'border-muted-foreground/10 hover:border-accent/40 hover:bg-muted/30'
                      }`}
                    >
                      <input {...getInputProps() as any} />
                      <div className="w-16 h-16 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mb-4">
                        <Upload size={32} />
                      </div>
                      <p className="text-sm font-bold">Drag & drop images here</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">or click to browse from device</p>
                    </div>

                    {/* Image Previews */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
                      {form.images.map((img, idx) => (
                        <div key={idx} className="relative aspect-[3/4] bg-muted rounded-2xl overflow-hidden group border border-border shadow-sm">
                          <Image src={getImageUrl(img)} alt="Preview" fill className="object-cover" sizes="100px" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button 
                              type="button" 
                              onClick={() => removeImage(idx)}
                              className="w-10 h-10 bg-red-600 text-white rounded-xl flex items-center justify-center hover:scale-110 transition-transform"
                            >
                              <Trash2 size={18} />
                            </button>
                            <div className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center cursor-move">
                              <GripVertical size={18} />
                            </div>
                          </div>
                          {idx === 0 && (
                            <div className="absolute top-2 left-2 bg-accent text-white text-[8px] font-black uppercase px-2 py-1 rounded-md">Main</div>
                          )}
                        </div>
                      ))}
                      {uploading && (
                        <div className="aspect-[3/4] bg-muted rounded-2xl flex items-center justify-center border border-accent/20 border-dashed animate-pulse">
                          <Loader2 className="animate-spin text-accent" size={24} />
                        </div>
                      )}
                    </div>
                  </div>

                  <button className="btn-premium w-full py-6 text-lg font-black shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex items-center justify-center gap-3">
                     <Save size={24} />
                     {editingId ? 'SYNCHRONIZE PRODUCT' : 'DEPLOY TO STORE'}
                  </button>
                </form>
              </div>
            </div>

            {/* Preview Column */}
            <div className="lg:col-span-4 space-y-8">
               <div className="bg-primary text-white rounded-[3rem] p-10 shadow-2xl relative overflow-hidden sticky top-32">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-bl-full blur-3xl" />
                  <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                    <Eye size={20} className="text-accent" />
                    Live Preview
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="aspect-[3/4] bg-white/10 rounded-[2.5rem] overflow-hidden relative border border-white/10 shadow-inner">
                      {form.images.length > 0 ? (
                        <Image src={getImageUrl(form.images[0])} alt="Preview" fill className="object-cover" sizes="(max-width: 768px) 100vw, 400px" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-white/30 italic">
                          <ImageIcon size={40} strokeWidth={1} />
                          <p className="text-[10px] uppercase tracking-widest">No Image Provided</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">{form.category || 'Collection'}</p>
                      <h4 className="text-2xl font-bold tracking-tight line-clamp-1">{form.name || 'Product Title'}</h4>
                      <div className="flex items-center gap-3">
                        <p className="text-xl font-black">
                          {settings.currency} {(Number(form.discountPrice) || Number(form.price) || 0).toLocaleString()}
                        </p>
                        {form.discountPrice && (
                          <p className="text-sm text-white/40 line-through font-medium">
                            {settings.currency} {(Number(form.price)).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {form.sizes.map((s, i) => (
                        <div key={i} className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[10px] font-bold border border-white/5 uppercase">
                          {s}
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                       <div>
                         <p className="text-[8px] text-white/50 uppercase font-bold tracking-widest">Availability</p>
                         <p className={`text-[10px] font-bold uppercase ${Number(form.inventory) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                           {Number(form.inventory) > 0 ? `${form.inventory} In Stock` : 'Out of Stock'}
                         </p>
                       </div>
                       <div className="text-right">
                         <p className="text-[8px] text-white/50 uppercase font-bold tracking-widest">Status</p>
                         <p className="text-[10px] font-bold uppercase text-accent">{form.status}</p>
                       </div>
                    </div>
                  </div>
               </div>

               <div className="bg-muted/50 rounded-[2.5rem] border border-border border-dashed p-8 space-y-4">
                  <div className="flex items-center gap-3 text-accent">
                    <AlertCircle size={18} />
                    <h4 className="text-sm font-bold uppercase tracking-widest">Performance Insight</h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Products with <strong>SKU</strong> and <strong>Price Comparisons</strong> tend to appear more professional to discerning customers.
                  </p>
               </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] border border-border shadow-sm overflow-hidden animate-in fade-in duration-700">
            {/* Filter & Search Bar */}
            <div className="p-10 border-b border-border flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input 
                  placeholder="Search catalog by name, SKU, or ID..." 
                  className="w-full bg-muted/50 border-none rounded-full px-16 py-4 text-sm focus:ring-2 focus:ring-accent/20 transition-all outline-none" 
                />
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none">
                  <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <select className="bg-muted/50 border-none rounded-full pl-10 pr-10 py-4 text-xs font-bold uppercase tracking-widest focus:ring-2 focus:ring-accent/20 appearance-none transition-all cursor-pointer">
                    <option>All Categories</option>
                    {categories.map(c => <option key={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <button className="p-4 bg-primary text-white rounded-full hover:bg-accent transition-all shadow-lg shadow-primary/20">
                  <Search size={20} />
                </button>
              </div>
            </div>

            {/* Premium Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/30">
                    <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Product Asset</th>
                    <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Inventory Status</th>
                    <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Valuation</th>
                    <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {products.map((p) => {
                    let images = [];
                    try { images = typeof p.images === 'string' ? JSON.parse(p.images) : p.images; } catch(e) { images = [p.images]; }
                    const firstImg = Array.isArray(images) ? images[0] : images;

                    return (
                      <tr key={p.id} className="group hover:bg-muted/20 transition-all duration-300">
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-6">
                            <div className="w-16 h-20 bg-muted rounded-[1.25rem] overflow-hidden relative border-2 border-transparent group-hover:border-accent transition-all shadow-sm">
                              <Image 
                                src={getImageUrl(firstImg)} 
                                alt={p.name} 
                                fill 
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                sizes="64px"
                              />
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-black group-hover:text-accent transition-colors">{p.name}</p>
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">SKU: {p.sku || 'N/A'}</span>
                                <div className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-accent">{p.category?.name || p.category || 'N/A'}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                           <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${(p.inventory || 0) > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                                <span className={`text-[10px] font-bold uppercase ${(p.inventory || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {(p.inventory || 0) > 0 ? `${p.inventory} In Stock` : 'Out of Stock'}
                                </span>
                              </div>
                              <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{p.status}</p>
                           </div>
                        </td>
                        <td className="px-10 py-8">
                          <div className="space-y-1">
                            <p className="text-base font-black tracking-tight">
                              {settings.currency} {(p.salePrice || p.regularPrice || 0).toLocaleString()}
                            </p>
                            {p.salePrice && (
                              <p className="text-[10px] text-muted-foreground line-through font-bold">
                                {settings.currency} {(p.regularPrice || 0).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <div className="flex justify-end gap-3">
                            <button 
                              onClick={() => startEdit(p)}
                              className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-white rounded-xl shadow-sm transition-all border border-transparent hover:border-border group/btn"
                            >
                              <Edit3 size={18} className="group-hover/btn:scale-110 transition-transform" />
                            </button>
                            <button 
                              onClick={() => setShowDeleteConfirm(p.id)}
                              className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-white rounded-xl shadow-sm transition-all border border-transparent hover:border-border group/btn"
                            >
                              <Trash2 size={18} className="group-hover/btn:scale-110 transition-transform" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-10 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Displaying {products.length} Masterpieces in Catalog</p>
              <div className="flex gap-4">
                <button className="w-12 h-12 rounded-2xl border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm">
                  <ChevronLeft size={20} />
                </button>
                <button className="w-12 h-12 rounded-2xl border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowDeleteConfirm(null)} />
          <div className="relative w-full max-w-md bg-white rounded-[3rem] p-10 shadow-2xl space-y-8">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
              <Trash2 size={40} className="text-red-500" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold">Destroy Record?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This action is irreversible. The product will be permanently purged from the ShahiPosh catalog and client storefront.
              </p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest border border-border hover:bg-muted transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => deleteProduct(showDeleteConfirm!)}
                className="flex-1 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest bg-red-600 text-white hover:bg-red-700 transition-all shadow-xl shadow-red-600/20"
              >
                Yes, Purge
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

export default function AdminProductsPage() { return ( <Suspense fallback={<div className="h-screen flex items-center justify-center"> <Loader2 className="animate-spin text-accent" size={40} /> </div>}> <AdminProductsContent /> </Suspense> ); }
