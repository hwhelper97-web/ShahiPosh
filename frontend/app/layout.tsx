import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { CartProvider } from "@/components/cart-context";
import { Metadata } from "next";

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
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}