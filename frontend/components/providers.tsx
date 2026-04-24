'use client';

import { CartProvider } from './cart-context';
import { SettingsProvider } from './settings-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
      <CartProvider>{children}</CartProvider>
    </SettingsProvider>
  );
}
