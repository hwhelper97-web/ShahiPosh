'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { 
  Save, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Mail, 
  Shield, 
  Bell, 
  Globe, 
  Share2, 
  CreditCard, 
  Eye,
  FileText,
  Search,
  Check,
  AlertTriangle,
  Settings as SettingsIcon,
  Layout,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Plus,
  Trash2,
  Building2,
  Truck,
  Key,
  ShieldCheck,
  History
} from 'lucide-react';
import { useSettings } from '@/components/settings-context';

const API = '/api';

export default function AdminSettingsPage() {
  const { refreshSettings } = useSettings();
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<any>({
    storeName: 'SHAHIPOSH',
    storeEmail: 'info@shahiposh.com',
    storePhone: '+92 300 1234567',
    storeAddress: '123 Luxury Avenue, Fashion District, Lahore, Pakistan',
    whatsappNumber: '923001234567',
    currency: 'Rs',
    shippingFee: '0',
    freeShippingThreshold: '0',
    facebookUrl: '',
    instagramUrl: '',
    twitterUrl: '',
    youtubeUrl: '',
    metaTitle: 'ShahiPosh | Premium Pakistani Fashion',
    metaDescription: 'Discover the finest Pakistani luxury wear at ShahiPosh.',
    taxRate: '0',
    topBarMessage: 'FREE SHIPPING ON ALL ORDERS NATIONWIDE!',
    footerAboutText: 'Elevating your style with premium, minimalist fashion.',
    maintenanceMode: 'false',
    locations: '[]',
    postExApiKey: '',
    postExMerchantId: '',
    postExPickupAddress: 'Main Warehouse',
    heroBannerImage: '/products/vintage_necklace_1.png',
    bankAccountName: '',
    bankAccountHolder: '',
    bankAccountNumber: ''
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [locations, setLocations] = useState<any[]>([]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API}/settings`);
        if (res.ok) {
          const data = await res.json();
          if (Object.keys(data).length > 0) {
            setSettings((prev: any) => ({ ...prev, ...data }));
            if (data.locations) {
              try { setLocations(JSON.parse(data.locations)); } catch (e) {}
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const finalSettings = { ...settings, locations: JSON.stringify(locations) };
    try {
      const res = await fetch(`${API}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalSettings),
      });
      if (res.ok) {
        await refreshSettings();
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (err) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'products');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setSettings({ ...settings, heroBannerImage: data.url });
      }
    } catch (err) {
      alert('Failed to upload banner');
    } finally {
      setUploading(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'Store Identity', icon: Globe },
    { id: 'contact', label: 'Communication', icon: MessageSquare },
    { id: 'locations', label: 'Business Locations', icon: Building2 },
    { id: 'courier', label: 'Logistics (PostEx)', icon: Truck },
    { id: 'appearance', label: 'Interface', icon: Layout },
    { id: 'financials', label: 'Fulfillment', icon: CreditCard },
    { id: 'seo', label: 'Discovery & SEO', icon: Search },
    { id: 'advanced', label: 'Operations', icon: SettingsIcon },
  ];

  if (loading) return (
    <AdminShell>
      <div className="h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground font-bold tracking-[0.2em] uppercase text-[10px]">Synchronizing Preferences...</p>
        </div>
      </div>
    </AdminShell>
  );

  const renderSaveButton = () => (
    <div className="flex justify-end pt-10 border-t border-border mt-10">
      <button 
        onClick={handleSave}
        disabled={saving}
        className="btn-premium flex items-center justify-center gap-3 py-4 px-12 shadow-xl hover:shadow-accent/20 transition-all duration-500"
      >
        <Save size={18} />
        <span className="font-bold uppercase tracking-widest text-[10px]">
          {saving ? 'Synchronizing...' : 'Save Configuration'}
        </span>
      </button>
    </div>
  );

  return (
    <AdminShell>
      <div className="max-w-6xl mx-auto space-y-12 pb-20">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 pb-8 border-b border-border">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-accent">
              <SettingsIcon size={14} />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]">System Preferences</span>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tighter">Command Center</h1>
            <p className="text-muted-foreground max-w-md">Configure your global business rules, communication channels, and storefront appearance.</p>
          </div>
          
          <div className="flex items-center gap-4 w-full lg:w-auto">
            {showSuccess && (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 px-5 py-2.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest border border-green-100 animate-in fade-in">
                <Check size={14} />
                Synchronized
              </div>
            )}
            <button 
              onClick={handleSave}
              disabled={saving}
              className="btn-premium flex-1 lg:flex-none flex items-center justify-center gap-3 py-4 px-10 shadow-2xl hover:shadow-accent/30 transition-all duration-500 group"
            >
              <Save size={20} />
              <span className="font-bold uppercase tracking-widest text-xs">
                {saving ? 'Synchronizing...' : 'Save Configuration'}
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-3 flex flex-col gap-2 sticky top-32">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-4 px-6 py-4 rounded-[1.5rem] text-sm font-bold transition-all duration-500 group ${
                  activeTab === tab.id 
                    ? 'bg-primary text-white shadow-xl shadow-primary/20 -translate-y-0.5' 
                    : 'text-muted-foreground hover:bg-white hover:text-primary hover:shadow-md'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  activeTab === tab.id ? 'bg-white/20' : 'bg-muted'
                }`}>
                  <tab.icon size={16} />
                </div>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="lg:col-span-9">
            <div className="bg-white rounded-[3rem] border border-border shadow-2xl overflow-hidden">
              <div className="p-12 space-y-12">
                
                {activeTab === 'general' && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="space-y-2">
                      <h2 className="text-3xl font-bold">Brand Identity</h2>
                      <p className="text-sm text-muted-foreground">This information is used across the storefront and in customer notifications.</p>
                    </div>
                    <div className="grid grid-cols-1 gap-10">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-6">Global Store Name</label>
                        <input value={settings.storeName} onChange={(e) => setSettings({ ...settings, storeName: e.target.value })} className="w-full bg-muted/50 border-none rounded-[1.5rem] px-8 py-5 text-sm font-bold focus:ring-1 focus:ring-accent outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-6">Primary Business Address</label>
                        <textarea rows={4} value={settings.storeAddress} onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })} className="w-full bg-muted/50 border-none rounded-[1.5rem] px-8 py-5 text-sm focus:ring-1 focus:ring-accent outline-none resize-none" />
                      </div>
                    </div>
                    {renderSaveButton()}
                  </div>
                )}

                {activeTab === 'courier' && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="space-y-2">
                      <h2 className="text-3xl font-bold">Courier Integration</h2>
                      <p className="text-sm text-muted-foreground">Configure automated shipping and tracking via PostEx Pakistan.</p>
                    </div>

                    <div className="p-10 bg-blue-50 border border-blue-100 rounded-[2.5rem] space-y-8">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white rounded-3xl flex items-center justify-center shadow-md">
                          <Truck className="text-blue-600" size={28} />
                        </div>
                        <div>
                          <h3 className="text-xl font-black tracking-tighter text-blue-900">PostEx Pakistan API</h3>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Enterprise Logistics Gateway</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-900/60 ml-4 flex items-center gap-2">
                            <Key size={12} />
                            API Authentication Key
                          </label>
                          <input 
                            type="password"
                            value={settings.postExApiKey}
                            onChange={(e) => setSettings({ ...settings, postExApiKey: e.target.value })}
                            placeholder="Enter your PostEx API Key"
                            className="w-full bg-white border-none rounded-2xl px-8 py-5 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none shadow-sm" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-900/60 ml-4 flex items-center gap-2">
                            <Building2 size={12} />
                            Merchant Identifier
                          </label>
                          <input 
                            value={settings.postExMerchantId}
                            onChange={(e) => setSettings({ ...settings, postExMerchantId: e.target.value })}
                            placeholder="e.g. SHAHI_923"
                            className="w-full bg-white border-none rounded-2xl px-8 py-5 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none shadow-sm" 
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-900/60 ml-4 flex items-center gap-2">
                            <MapPin size={12} />
                            Default Pickup Point
                          </label>
                          <input 
                            value={settings.postExPickupAddress}
                            onChange={(e) => setSettings({ ...settings, postExPickupAddress: e.target.value })}
                            placeholder="e.g. 123 Industrial Area, Block A, Lahore"
                            className="w-full bg-white border-none rounded-2xl px-8 py-5 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none shadow-sm"
                          />
                        </div>
                      </div>

                      <div className="pt-6 border-t border-blue-200/50 flex items-center gap-3">
                         <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm">
                           <ShieldCheck size={16} />
                         </div>
                         <p className="text-[10px] font-bold uppercase tracking-widest text-blue-700/70">Secure TLS Encryption Active</p>
                      </div>
                    </div>
                    {renderSaveButton()}
                  </div>
                )}

                {activeTab === 'locations' && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="flex justify-between items-center">
                      <div className="space-y-2">
                        <h2 className="text-3xl font-bold">Business Outlets</h2>
                        <p className="text-sm text-muted-foreground">Manage your physical showrooms and regional distribution hubs.</p>
                      </div>
                      <button 
                        onClick={() => setLocations([...locations, { id: Date.now(), name: '', address: '', phone: '', mapUrl: '' }])}
                        className="btn-premium flex items-center gap-2 py-3 px-6 rounded-2xl text-[10px]"
                      >
                        <Plus size={14} />
                        Add New Branch
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      {locations.length === 0 ? (
                        <div className="p-20 border-2 border-dashed border-muted rounded-[3rem] text-center space-y-4">
                          <MapPin size={48} className="text-muted-foreground/20 mx-auto" />
                          <p className="text-sm text-muted-foreground font-medium">No physical locations registered in the system.</p>
                        </div>
                      ) : (
                        locations.map((loc, index) => (
                          <div key={loc.id} className="bg-muted/30 border border-border rounded-[2.5rem] p-8 space-y-6 relative group">
                            <button 
                              onClick={() => setLocations(locations.filter(l => l.id !== loc.id))}
                              className="absolute top-6 right-6 p-2 text-red-500 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={18} />
                            </button>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                              <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Branch Name</label>
                                <input 
                                  value={loc.name} 
                                  onChange={(e) => {
                                    const newLocs = [...locations];
                                    newLocs[index].name = e.target.value;
                                    setLocations(newLocs);
                                  }}
                                  placeholder="e.g. Lahore Flagship Store"
                                  className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-accent outline-none" 
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Contact Number</label>
                                <input 
                                  value={loc.phone} 
                                  onChange={(e) => {
                                    const newLocs = [...locations];
                                    newLocs[index].phone = e.target.value;
                                    setLocations(newLocs);
                                  }}
                                  placeholder="+92 300 0000000"
                                  className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-accent outline-none" 
                                />
                              </div>
                              <div className="space-y-2 md:col-span-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Physical Address</label>
                                <input 
                                  value={loc.address} 
                                  onChange={(e) => {
                                    const newLocs = [...locations];
                                    newLocs[index].address = e.target.value;
                                    setLocations(newLocs);
                                  }}
                                  placeholder="Building #, Street Name, City"
                                  className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-accent outline-none" 
                                />
                              </div>
                              <div className="space-y-2 md:col-span-4">
                                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Google Maps URL</label>
                                <input 
                                  value={loc.mapUrl} 
                                  onChange={(e) => {
                                    const newLocs = [...locations];
                                    newLocs[index].mapUrl = e.target.value;
                                    setLocations(newLocs);
                                  }}
                                  placeholder="https://goo.gl/maps/..."
                                  className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-accent outline-none" 
                                />
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    {renderSaveButton()}
                  </div>
                )}
                
                {activeTab === 'contact' && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="space-y-2">
                      <h2 className="text-3xl font-bold">Connectivity Hub</h2>
                      <p className="text-sm text-muted-foreground">Manage your official communication channels and social presence.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-6">Official Support Email</label>
                        <input value={settings.storeEmail} onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })} className="w-full bg-muted/50 border-none rounded-[1.5rem] px-8 py-5 text-sm focus:ring-1 focus:ring-accent outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-6">Customer Hotline</label>
                        <input value={settings.storePhone} onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })} className="w-full bg-muted/50 border-none rounded-[1.5rem] px-8 py-5 text-sm focus:ring-1 focus:ring-accent outline-none" />
                      </div>
                    </div>

                    <div className="pt-10 border-t border-border">
                      <div className="space-y-2 mb-8">
                        <h3 className="text-xl font-bold flex items-center gap-3">
                          <Share2 size={20} className="text-accent" />
                          Social Media & Journey
                        </h3>
                        <p className="text-xs text-muted-foreground">Configure the links that appear in the 'Follow Our Journey' section.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-6 flex items-center gap-2">
                            <Instagram size={12} />
                            Instagram Profile URL
                          </label>
                          <input value={settings.instagramUrl} onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })} placeholder="https://instagram.com/..." className="w-full bg-muted/50 border-none rounded-[1.5rem] px-8 py-5 text-sm focus:ring-1 focus:ring-accent outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-6 flex items-center gap-2">
                            <Facebook size={12} />
                            Facebook Page URL
                          </label>
                          <input value={settings.facebookUrl} onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })} placeholder="https://facebook.com/..." className="w-full bg-muted/50 border-none rounded-[1.5rem] px-8 py-5 text-sm focus:ring-1 focus:ring-accent outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-6 flex items-center gap-2">
                            <Twitter size={12} />
                            Twitter / X URL
                          </label>
                          <input value={settings.twitterUrl} onChange={(e) => setSettings({ ...settings, twitterUrl: e.target.value })} placeholder="https://twitter.com/..." className="w-full bg-muted/50 border-none rounded-[1.5rem] px-8 py-5 text-sm focus:ring-1 focus:ring-accent outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-6 flex items-center gap-2">
                            <Youtube size={12} />
                            YouTube Channel URL
                          </label>
                          <input value={settings.youtubeUrl} onChange={(e) => setSettings({ ...settings, youtubeUrl: e.target.value })} placeholder="https://youtube.com/..." className="w-full bg-muted/50 border-none rounded-[1.5rem] px-8 py-5 text-sm focus:ring-1 focus:ring-accent outline-none" />
                        </div>
                      </div>
                    </div>
                    {renderSaveButton()}
                  </div>
                )}

                {activeTab === 'appearance' && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="space-y-2">
                      <h2 className="text-3xl font-bold">Storefront Appearance</h2>
                      <p className="text-sm text-muted-foreground">Manage the visual entrance and primary branding elements of your store.</p>
                    </div>

                    <div className="space-y-6">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-6">Hero Section Banner Image</label>
                      
                      <div className="relative group overflow-hidden rounded-[2.5rem] border-2 border-dashed border-muted hover:border-accent transition-all duration-500">
                        <div className="aspect-[21/9] w-full bg-muted relative overflow-hidden">
                          {settings.heroBannerImage ? (
                            <img 
                              src={settings.heroBannerImage} 
                              alt="Hero Preview" 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Layout size={48} className="text-muted-foreground/20" />
                            </div>
                          )}
                          
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                            <label className="cursor-pointer btn-premium bg-white text-black border-none px-8 py-3 flex items-center gap-2 hover:scale-110">
                              <Plus size={18} />
                              <span>{uploading ? 'Uploading...' : 'Replace Image'}</span>
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={handleBannerUpload} 
                                disabled={uploading}
                              />
                            </label>
                            {settings.heroBannerImage && (
                              <button 
                                onClick={() => setSettings({ ...settings, heroBannerImage: '' })}
                                className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition-all"
                              >
                                <Trash2 size={20} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4 p-6 bg-accent/5 rounded-2xl border border-accent/10">
                        <AlertTriangle className="text-accent shrink-0" size={18} />
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-accent">Optimization Tip</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            For the best cinematic experience, use high-resolution landscape images (e.g., 3840x1600). Keep the focal point in the upper-center of the frame to avoid button overlap.
                          </p>
                        </div>
                      </div>
                    </div>
                    {renderSaveButton()}
                  </div>
                )}

                {activeTab === 'financials' && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="space-y-2">
                      <h2 className="text-3xl font-bold">Financial Fulfillment</h2>
                      <p className="text-sm text-muted-foreground">Configure payment methods and bank details for order processing.</p>
                    </div>

                    <div className="p-10 bg-emerald-50 border border-emerald-100 rounded-[2.5rem] space-y-8">
                       <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white rounded-3xl flex items-center justify-center shadow-md">
                          <CreditCard className="text-emerald-600" size={28} />
                        </div>
                        <div>
                          <h3 className="text-xl font-black tracking-tighter text-emerald-900">Official Treasury Details</h3>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Secure Settlement Configuration</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/60 ml-4">Financial Institution (Bank Name)</label>
                          <input 
                            value={settings.bankAccountName}
                            onChange={(e) => setSettings({ ...settings, bankAccountName: e.target.value })}
                            placeholder="e.g. Meezan Bank, Bank Alfalah"
                            className="w-full bg-white border-none rounded-2xl px-8 py-5 text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none shadow-sm" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/60 ml-4">Official Account Holder</label>
                          <input 
                            value={settings.bankAccountHolder}
                            onChange={(e) => setSettings({ ...settings, bankAccountHolder: e.target.value })}
                            placeholder="Full Name as per Bank Records"
                            className="w-full bg-white border-none rounded-2xl px-8 py-5 text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none shadow-sm" 
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/60 ml-4">IBAN / Account Number</label>
                          <input 
                            value={settings.bankAccountNumber}
                            onChange={(e) => setSettings({ ...settings, bankAccountNumber: e.target.value })}
                            placeholder="PK00 0000 0000 0000 0000 0000"
                            className="w-full bg-white border-none rounded-2xl px-8 py-5 text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none shadow-sm font-mono tracking-wider" 
                          />
                        </div>
                      </div>

                      <div className="pt-6 border-t border-emerald-200/50 flex items-center gap-3">
                         <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-emerald-600 shadow-sm">
                           <ShieldCheck size={16} />
                         </div>
                         <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700/70">Payment Gateway Compliance Active</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Easypaisa */}
                      <div className="p-10 bg-green-50 border border-green-100 rounded-[2.5rem] space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md">
                            <span className="text-green-600 font-black text-xl italic">e</span>
                          </div>
                          <div>
                            <h3 className="text-lg font-black tracking-tighter text-green-900">Easypaisa Wallet</h3>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-green-600">Mobile Commerce Gateway</p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-green-900/60 ml-4">Account Number</label>
                            <input 
                              value={settings.easypaisaNumber}
                              onChange={(e) => setSettings({ ...settings, easypaisaNumber: e.target.value })}
                              placeholder="03XX XXXXXXX"
                              className="w-full bg-white border-none rounded-xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-green-500/20 transition-all outline-none" 
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-green-900/60 ml-4">Account Title</label>
                            <input 
                              value={settings.easypaisaName}
                              onChange={(e) => setSettings({ ...settings, easypaisaName: e.target.value })}
                              placeholder="Registered Name"
                              className="w-full bg-white border-none rounded-xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-green-500/20 transition-all outline-none" 
                            />
                          </div>
                        </div>
                      </div>

                      {/* JazzCash */}
                      <div className="p-10 bg-orange-50 border border-orange-100 rounded-[2.5rem] space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md">
                            <span className="text-orange-600 font-black text-xl italic">J</span>
                          </div>
                          <div>
                            <h3 className="text-lg font-black tracking-tighter text-orange-900">JazzCash Wallet</h3>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-orange-600">Secure Mobile Payment</p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-900/60 ml-4">Account Number</label>
                            <input 
                              value={settings.jazzcashNumber}
                              onChange={(e) => setSettings({ ...settings, jazzcashNumber: e.target.value })}
                              placeholder="03XX XXXXXXX"
                              className="w-full bg-white border-none rounded-xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-orange-500/20 transition-all outline-none" 
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-900/60 ml-4">Account Title</label>
                            <input 
                              value={settings.jazzcashName}
                              onChange={(e) => setSettings({ ...settings, jazzcashName: e.target.value })}
                              placeholder="Registered Name"
                              className="w-full bg-white border-none rounded-xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-orange-500/20 transition-all outline-none" 
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-6">Standard Shipping Fee</label>
                        <input value={settings.shippingFee} onChange={(e) => setSettings({ ...settings, shippingFee: e.target.value })} className="w-full bg-muted/50 border-none rounded-[1.5rem] px-8 py-5 text-sm font-bold focus:ring-1 focus:ring-accent outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-6">Free Shipping Threshold</label>
                        <input value={settings.freeShippingThreshold} onChange={(e) => setSettings({ ...settings, freeShippingThreshold: e.target.value })} className="w-full bg-muted/50 border-none rounded-[1.5rem] px-8 py-5 text-sm font-bold focus:ring-1 focus:ring-accent outline-none" />
                      </div>
                    </div>
                    {renderSaveButton()}
                  </div>
                )}
                
                {activeTab === 'seo' && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="space-y-2">
                      <h2 className="text-3xl font-bold">Search Visibility</h2>
                      <p className="text-sm text-muted-foreground">Control how your store appears on Google and social media platforms.</p>
                    </div>

                    {/* Google Preview */}
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-6">Live Search Engine Preview</label>
                      <div className="bg-[#f8f9fa] border border-[#dadce0] rounded-[2rem] p-10 max-w-2xl">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-4 h-4 bg-white rounded-full border border-gray-200 flex items-center justify-center text-[8px] font-bold">S</div>
                          <p className="text-[12px] text-[#202124]">https://shahiposh.com</p>
                        </div>
                        <h3 className="text-[#1a0dab] text-xl font-medium hover:underline cursor-pointer mb-1 leading-tight">
                          {settings.metaTitle || 'ShahiPosh | Premium Pakistani Fashion'}
                        </h3>
                        <p className="text-[#4d5156] text-sm leading-relaxed line-clamp-2">
                          {settings.metaDescription || 'Discover the finest Pakistani luxury wear at ShahiPosh. Shop our exclusive collection of embroidered shawls and jewelry.'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-6">Primary Meta Title</label>
                        <input 
                          value={settings.metaTitle} 
                          onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })} 
                          placeholder="Recommended: 50-60 characters"
                          className="w-full bg-muted/50 border-none rounded-[1.5rem] px-8 py-5 text-sm font-bold focus:ring-1 focus:ring-accent outline-none" 
                        />
                        <div className="flex justify-between px-6">
                           <p className="text-[9px] font-medium text-muted-foreground uppercase">Target Keywords: Brand Name, Niche, Location</p>
                           <p className={`text-[9px] font-bold ${settings.metaTitle.length > 60 ? 'text-red-500' : 'text-green-600'}`}>{settings.metaTitle.length} / 60</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-6">Global Meta Description</label>
                        <textarea 
                          rows={4}
                          value={settings.metaDescription} 
                          onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })} 
                          placeholder="Recommended: 150-160 characters"
                          className="w-full bg-muted/50 border-none rounded-[1.5rem] px-8 py-5 text-sm focus:ring-1 focus:ring-accent outline-none resize-none" 
                        />
                        <div className="flex justify-between px-6">
                           <p className="text-[9px] font-medium text-muted-foreground uppercase">Briefly summarize your value proposition</p>
                           <p className={`text-[9px] font-bold ${settings.metaDescription.length > 160 ? 'text-red-500' : 'text-green-600'}`}>{settings.metaDescription.length} / 160</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-8 bg-blue-50/50 border border-blue-100 rounded-[2.5rem] flex items-start gap-4">
                       <Globe className="text-blue-500 shrink-0" size={20} />
                       <div className="space-y-1">
                         <p className="text-[10px] font-bold uppercase tracking-widest text-blue-700">SEO Automation Active</p>
                         <p className="text-xs text-blue-900/60 leading-relaxed">
                           Our system automatically generates sitemaps and manages canonical URLs for all your products and categories based on these global settings.
                         </p>
                       </div>
                    </div>
                    {renderSaveButton()}
                  </div>
                )}
                
                {activeTab === 'advanced' && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="space-y-2">
                      <h2 className="text-3xl font-bold">System Operations</h2>
                      <p className="text-sm text-muted-foreground">Manage critical system states, global messaging, and platform health.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Maintenance Mode */}
                      <div className={`p-10 rounded-[2.5rem] border-2 transition-all duration-500 ${
                        settings.maintenanceMode === 'true' 
                          ? 'bg-red-50 border-red-200 shadow-lg shadow-red-500/10' 
                          : 'bg-muted/30 border-border shadow-inner'
                      }`}>
                        <div className="flex justify-between items-start mb-6">
                           <div className="space-y-2">
                             <h3 className={`text-xl font-black tracking-tighter ${settings.maintenanceMode === 'true' ? 'text-red-900' : 'text-primary'}`}>Maintenance Mode</h3>
                             <p className="text-xs text-muted-foreground">Lock the storefront for public access.</p>
                           </div>
                           <button 
                             onClick={() => setSettings({ ...settings, maintenanceMode: settings.maintenanceMode === 'true' ? 'false' : 'true' })}
                             className={`w-16 h-8 rounded-full relative transition-colors duration-500 ${
                               settings.maintenanceMode === 'true' ? 'bg-red-500' : 'bg-muted-foreground/20'
                             }`}
                           >
                             <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-500 shadow-md ${
                               settings.maintenanceMode === 'true' ? 'left-9' : 'left-1'
                             }`} />
                           </button>
                        </div>
                        {settings.maintenanceMode === 'true' && (
                          <div className="flex items-center gap-3 text-red-600 bg-white/50 p-4 rounded-2xl border border-red-100">
                             <AlertTriangle size={16} />
                             <p className="text-[10px] font-black uppercase tracking-widest">Public Access Restricted</p>
                          </div>
                        )}
                      </div>

                      {/* Announcement Bar */}
                      <div className="p-10 bg-muted/30 border border-border rounded-[2.5rem] space-y-6 shadow-inner">
                         <div className="space-y-2">
                           <h3 className="text-xl font-black tracking-tighter">Announcement Bar</h3>
                           <p className="text-xs text-muted-foreground">The message displayed at the very top of the page.</p>
                         </div>
                         <input 
                           value={settings.topBarMessage} 
                           onChange={(e) => setSettings({ ...settings, topBarMessage: e.target.value })}
                           className="w-full bg-white border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-1 focus:ring-accent outline-none shadow-sm" 
                         />
                      </div>
                    </div>

                    {/* Footer Narrative */}
                    <div className="p-10 bg-muted/30 border border-border rounded-[3rem] space-y-6 shadow-inner">
                      <div className="space-y-2">
                         <h3 className="text-xl font-black tracking-tighter">Brand Narrative (Footer)</h3>
                         <p className="text-xs text-muted-foreground">The "About" text that appears in your website footer.</p>
                       </div>
                       <textarea 
                         rows={4}
                         value={settings.footerAboutText} 
                         onChange={(e) => setSettings({ ...settings, footerAboutText: e.target.value })}
                         className="w-full bg-white border-none rounded-[2rem] px-8 py-6 text-sm leading-relaxed focus:ring-1 focus:ring-accent outline-none shadow-sm resize-none" 
                       />
                    </div>

                    {/* System Info */}
                    <div className="p-8 bg-blue-50 border border-blue-100 rounded-[2.5rem] flex items-center justify-between">
                       <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-50">
                           <History size={20} />
                         </div>
                         <div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-blue-900/60">Platform Integrity</p>
                           <p className="text-sm font-bold text-blue-900">System v4.2.1 Stable</p>
                         </div>
                       </div>
                       <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <p className="text-[10px] font-black uppercase tracking-widest text-green-600">All Engines Nominal</p>
                       </div>
                    </div>
                    {renderSaveButton()}
                  </div>
                )}
                
                {/* ... existing tabs ... */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
