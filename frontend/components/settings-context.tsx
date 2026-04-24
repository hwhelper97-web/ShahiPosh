'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Settings = {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  whatsappNumber: string;
  currency: string;
  shippingFee: string;
  freeShippingThreshold: string;
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  youtubeUrl: string;
  metaTitle: string;
  metaDescription: string;
  taxRate: string;
  topBarMessage: string;
  footerAboutText: string;
  maintenanceMode: string;
  [key: string]: string;
};

const defaultSettings: Settings = {
  storeName: 'SHAHIPOSH',
  storeEmail: 'info@shahiposh.com',
  storePhone: '+92 300 1234567',
  storeAddress: '123 Luxury Avenue, Fashion District, Lahore, Pakistan',
  whatsappNumber: '923001234567',
  currency: 'Rs',
  shippingFee: '0',
  freeShippingThreshold: '0',
  facebookUrl: 'https://facebook.com/shahiposh',
  instagramUrl: 'https://instagram.com/shahiposh',
  twitterUrl: 'https://twitter.com/shahiposh',
  youtubeUrl: '',
  metaTitle: 'ShahiPosh | Premium Pakistani Fashion',
  metaDescription: 'Discover the finest Pakistani luxury wear at ShahiPosh.',
  taxRate: '0',
  topBarMessage: 'FREE SHIPPING ON ALL ORDERS NATIONWIDE!',
  footerAboutText: 'Elevating your style with premium, minimalist fashion. Designed for the modern individual who values quality and elegance.',
  maintenanceMode: 'false',
};

const SettingsContext = createContext<{
  settings: Settings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}>({
  settings: defaultSettings,
  loading: true,
  refreshSettings: async () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const refreshSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (Object.keys(data).length > 0) {
          // Merge defaults with DB values
          setSettings(prev => ({ ...prev, ...data }));
        }
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
