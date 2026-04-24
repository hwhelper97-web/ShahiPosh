import "./globals.css";
import { CartProvider } from "@/components/cart-context";
import { SettingsProvider } from "@/components/settings-context";
import { Metadata } from "next";
import LayoutShell from "@/components/layout-shell";

export const metadata: Metadata = {
  title: "SHAHIPOSH | Premium Minimalist Fashion",
  description: "Discover the ShahiPosh experience. High-quality, minimalist clothing for the modern individual.",
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