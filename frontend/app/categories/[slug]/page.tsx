'use client';

import { useEffect, useState, use } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Loader2, ChevronRight, LayoutGrid, ArrowLeft } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  children?: Category[];
}

interface Product {
  id: string;
  name: string;
  regularPrice: number;
  salePrice: number | null;
  images: any;
  category: { name: string };
}

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const resolveImagePath = (path: any, fallback: string, folder: string = 'products') => {
    if (!path || typeof path !== 'string') return fallback;
    if (path.startsWith('http') || path.startsWith('/')) return path;
    return `/${folder}/${path}`;
  };

  useEffect(() => {
    async function load() {
      try {
        const catRes = await fetch('/api/categories');
        const categories: Category[] = await catRes.json();
        
        const mainCat = categories.find(c => c.slug === slug);
        if (mainCat) {
          const children = categories.filter(c => (c as any).parentId === mainCat.id);
          setCategory({ ...mainCat, children });

          // Fetch products for this category using ID for better accuracy
          const prodRes = await fetch(`/api/products?categoryId=${mainCat.id}`);
          if (prodRes.ok) setProducts(await prodRes.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-accent" size={40} />
    </div>
  );

  if (!category) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
      <h1 className="text-2xl font-bold">Category Not Found</h1>
      <Link href="/" className="text-accent underline">Return Home</Link>
    </div>
  );

  const hasSubcategories = category.children && category.children.length > 0;

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Header */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <Image 
          src={resolveImagePath(category.image, '/products/traditional_shawl_hero_4k.png', 'categories')}
          alt={category.name}
          fill
          className="object-cover brightness-[0.4]"
          priority
        />
        <div className="container relative z-10 text-center text-white space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 text-accent"
          >
            <Link href="/" className="text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">Home</Link>
            <ChevronRight size={10} />
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Collections</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-6xl md:text-7xl font-black tracking-tighter uppercase"
          >
            {category.name}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm md:text-lg max-w-2xl mx-auto opacity-70 font-medium"
          >
            {category.description || 'Experience the pinnacle of traditional luxury and artisanal craftsmanship.'}
          </motion.p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24">
        <div className="container">
          {/* Subcategories Discovery (if any) */}
          {hasSubcategories && (
            <div className="mb-24">
              <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                  <h2 className="text-xs font-black uppercase tracking-[0.4em] text-accent mb-2">Refine your choice</h2>
                  <h3 className="text-3xl font-bold tracking-tight">Explore Sub-collections</h3>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {category.children?.map((sub, idx) => (
                  <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-muted shadow-sm hover:shadow-xl transition-all duration-700"
                  >
                    <Link href={`/categories/${sub.slug}`} className="block h-full">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-60 group-hover:opacity-80 transition-opacity" />
                      <Image 
                        src={resolveImagePath(sub.image, '/products/traditional_shawl_hero.png', 'categories')}
                        alt={sub.name}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 z-20 flex flex-col justify-end p-8">
                        <h4 className="text-white text-xl font-bold tracking-tight mb-2 uppercase">{sub.name}</h4>
                        <span className="text-accent text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                          View Items →
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Main Products Grid */}
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6 border-b border-muted pb-8">
              <div>
                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-accent mb-2">Curated Masterpieces</h2>
                <h3 className="text-3xl font-bold tracking-tight">
                  {hasSubcategories ? `All ${category.name} Collection` : `Available in ${category.name}`}
                </h3>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  {products.length} Designs Found
                </span>
                <Link href="/shop" className="text-xs font-black uppercase tracking-widest hover:text-accent transition-all">
                  Shop All →
                </Link>
              </div>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                {products.map((product, idx) => {
                  let images: any = [];
                  try {
                    images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
                  } catch (e) {
                    images = [];
                  }
                  
                  const firstImg = (Array.isArray(images) && images.length > 0) ? images[0] : null;
                  const mainImg = (typeof firstImg === 'object' && firstImg !== null) ? firstImg.url : firstImg;
                  
                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group"
                    >
                      <Link href={`/product/${product.id}`}>
                        <div className="aspect-[3/4] relative overflow-hidden rounded-[2.5rem] bg-muted mb-8 shadow-sm group-hover:shadow-2xl transition-all duration-700">
                          <Image
                            src={resolveImagePath(mainImg, '/products/traditional_shawl_hero.png', 'products')}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                          />
                          {product.salePrice && (
                            <div className="absolute top-6 left-6 bg-accent text-white px-4 py-1 rounded-full text-[10px] font-black tracking-widest shadow-lg">SALE</div>
                          )}
                          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="space-y-2 px-2">
                          <p className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">{product.category.name}</p>
                          <h4 className="font-bold text-lg tracking-tight group-hover:text-accent transition-colors line-clamp-1">{product.name}</h4>
                          <div className="flex items-center gap-4">
                            <span className="font-black text-xl tracking-tighter">Rs. {product.regularPrice.toLocaleString()}</span>
                            {product.salePrice && (
                              <span className="text-sm text-muted-foreground line-through font-medium opacity-50">Rs. {product.salePrice.toLocaleString()}</span>
                            )}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="py-32 text-center bg-muted/20 rounded-[4rem] border-2 border-dashed border-muted">
                 <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <LayoutGrid size={32} className="text-muted-foreground" strokeWidth={1} />
                 </div>
                 <h4 className="text-xl font-bold mb-2">No masterpieces found</h4>
                 <p className="text-muted-foreground text-sm max-w-xs mx-auto">This collection is currently being curated. Please check back soon for our latest arrivals.</p>
              </div>
            )}
          </div>

          {/* Back Navigation */}
          <div className="mt-24 text-center">
            <Link href="/" className="inline-flex items-center gap-3 text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft size={16} />
              Back to main collections
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
