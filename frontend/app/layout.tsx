import './globals.css';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Providers } from '@/components/providers';

export const metadata = {
  title: 'ShahiPosh | Wear Royalty',
  description: 'Premium modern clothing brand e-commerce store.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main className="min-h-[80vh]">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
