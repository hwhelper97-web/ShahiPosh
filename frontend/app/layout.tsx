import "./globals.css";
import { CartProvider } from "@/components/cart-context";
import { SettingsProvider } from "@/components/settings-context";
import { Metadata } from "next";
import LayoutShell from "@/components/layout-shell";

export const metadata: Metadata = {
  title: "SHAHIPOSH | Timeless Elegance & Handcrafted Luxury",
  description: "Explore SHAHIPOSH for curated luxury, featuring exquisite handcrafted shawls, artisanal dupattas, and bespoke jewelry pieces.",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="flex flex-col min-h-screen">
        <CartProvider>
          <SettingsProvider>
            <LayoutShell>{children}</LayoutShell>
          </SettingsProvider>
        </CartProvider>
      </body>
    </html>
  );
}