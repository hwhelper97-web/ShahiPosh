import { ProductCard } from "@/components/product-card";
import Hero from "@/components/hero";
import Collections from "@/components/collections";
import Link from "next/link";
import prisma from "@/lib/prisma";

export const revalidate = 0;

export default async function HomePage() {
  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: { category: true }
    });
  } catch (err) {
    console.error("Home direct fetch failed:", err);
    products = [];
  }

  return (
    <main>
      <Hero />
      
      <div id="collections">
        <Collections />
      </div>

      {/* Featured Products */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container px-5 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12 md:mb-16">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-[1px] bg-accent" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">Trending</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">Featured Pieces</h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-sm font-medium">Our handpicked selection of the season's must-haves, curated for the modern aristocrat.</p>
            </div>
            <Link href="/shop" className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-widest hover:text-accent transition-luxury">
              View All Shop
              <span className="group-hover:translate-x-2 transition-transform">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-10 gap-y-12 md:gap-y-20">
            {products.length === 0 ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse space-y-4">
                  <div className="aspect-[3/4] bg-muted rounded-[2.5rem]" />
                  <div className="h-4 bg-muted rounded-full w-3/4 mx-1" />
                  <div className="h-3 bg-muted rounded-full w-1/2 mx-1" />
                </div>
              ))
            ) : (
              products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}