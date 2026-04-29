'use client';

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Heart, Share2, Truck, RotateCcw, ShieldCheck, ChevronRight, X } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { useCart } from "@/components/cart-context";
import { useSettings } from "@/components/settings-context";
import { useRouter } from "next/navigation";

export default function ProductClient({ product }: any) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { settings } = useSettings();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [adding, setAdding] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  let images: any[] = [];
  let sizes: any[] = [];

  try {
    const rawImages = typeof product.images === "string" ? JSON.parse(product.images) : product.images;
    images = Array.isArray(rawImages) ? rawImages : [];
    
    const rawSizes = typeof product.sizes === "string" ? JSON.parse(product.sizes) : product.sizes;
    sizes = Array.isArray(rawSizes) ? rawSizes : (product.sizes ? [product.sizes] : []);
  } catch (err) {
    console.error("Parse error in ProductClient:", err);
  }

  // Final fallbacks and sanitization
  if (images.length === 0) images = ["/placeholder.jpg"];
  if (sizes.length === 0) sizes = ["S", "M", "L", "XL"];

  const sanitizedImages = images.map(img => {
    const src = typeof img === 'string' ? img : (img?.url || "/placeholder.jpg");
    if (src.startsWith("/") || src.startsWith("http")) return src;
    return `/products/${src}`;
  });

  const isJewelry = product.category?.name?.toLowerCase().includes('jewelry') || 
                    (typeof product.category === 'string' && product.category.toLowerCase().includes('jewelry'));

  const handleAddToCart = () => {
    if (!isJewelry && !selectedSize) {
      alert("Please select a size first");
      return;
    }
    setAdding(true);
    const effectivePrice = product.salePrice || product.regularPrice;
    addToCart({ 
      ...product, 
      price: effectivePrice,
      image: sanitizedImages[0] 
    }, isJewelry ? "Standard" : selectedSize!, 1);
    setTimeout(() => setAdding(false), 1000);
  };

  const handleOrderNow = () => {
    if (!isJewelry && !selectedSize) {
      alert("Please select a size first");
      return;
    }
    const effectivePrice = product.salePrice || product.regularPrice;
    addToCart({ 
      ...product, 
      price: effectivePrice,
      image: sanitizedImages[0] 
    }, isJewelry ? "Standard" : selectedSize!, 1);
    router.push('/checkout');
  };

  return (
    <>
    <div className="bg-background pt-32 pb-20">
      <div className="container">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest mb-12">
          <a href="/" className="hover:text-primary transition-luxury">Home</a>
          <ChevronRight size={12} />
          <a href="/shop" className="hover:text-primary transition-luxury">Shop</a>
          <ChevronRight size={12} />
          <span className="text-primary font-bold">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse lg:flex-row gap-6">
            {/* Thumbnails */}
            <div className="flex lg:flex-col gap-4">
              {sanitizedImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-20 aspect-[3/4] rounded-xl overflow-hidden border-2 transition-luxury ${
                    selectedImage === idx ? 'border-accent' : 'border-transparent'
                  }`}
                >
                  <Image src={img} alt={product.name} fill className="object-cover" />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 relative aspect-[3/4] bg-muted rounded-3xl overflow-hidden group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full"
                >
                  <Image
                    src={sanitizedImages[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
              
              <button className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-accent hover:text-white transition-luxury opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0">
                <Heart size={20} />
              </button>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="lg:col-span-5 space-y-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent mb-4">{product.category?.name || product.category}</p>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">{product.name}</h1>
              <div className="flex items-center gap-4">
                {product.salePrice ? (
                  <>
                    <p className="text-3xl font-black text-accent">{settings.currency} {product.salePrice?.toLocaleString() || "0"}</p>
                    <p className="text-lg text-muted-foreground line-through font-medium">{settings.currency} {product.regularPrice?.toLocaleString() || "0"}</p>
                  </>
                ) : (
                  <p className="text-3xl font-black">{settings.currency} {(product.regularPrice || 0).toLocaleString() || "0"}</p>
                )}
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              {product.description || "Elevate your wardrobe with this premium piece from ShahiPosh. Meticulously crafted for those who appreciate the finer details."}
            </p>

            {/* Size Selector */}
            {!isJewelry && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold uppercase tracking-widest">Select Size</h3>
                  <button 
                    onClick={() => setShowSizeGuide(true)}
                    className="text-xs font-medium underline underline-offset-4 hover:text-accent transition-luxury"
                  >
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-sm font-medium transition-luxury border-2 ${
                        selectedSize === s
                          ? "border-primary bg-primary text-white"
                          : "border-border hover:border-accent"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-5">
              <button 
                onClick={handleAddToCart}
                disabled={adding}
                className="w-full py-5 bg-black text-white rounded-2xl flex items-center justify-center gap-4 hover:bg-neutral-800 transition-all duration-500 shadow-xl group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <ShoppingBag size={20} className="relative z-10" />
                <span className="relative z-10 font-bold uppercase tracking-widest text-[11px]">
                  {adding ? "Added to Collection" : "Add to Cart"}
                </span>
              </button>
              
              <button 
                onClick={handleOrderNow}
                className="btn-premium w-full py-5 flex items-center justify-center gap-4 shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <ChevronRight size={20} />
                <span className="font-black uppercase tracking-[0.2em] text-[11px]">Order Now</span>
              </button>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-border">
              <div className="flex flex-col items-center text-center gap-3">
                <Truck size={24} strokeWidth={1} className="text-accent" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <RotateCcw size={24} strokeWidth={1} className="text-accent" />
                <span className="text-[10px] font-bold uppercase tracking-widest">14 Day Return</span>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <ShieldCheck size={24} strokeWidth={1} className="text-accent" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Secure Payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* Size Guide Modal */}
      <AnimatePresence>
        {showSizeGuide && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSizeGuide(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] p-10 shadow-2xl overflow-hidden"
            >
              <button 
                onClick={() => setShowSizeGuide(false)}
                className="absolute top-8 right-8 p-2 hover:bg-muted rounded-full transition-luxury"
              >
                <X size={20} />
              </button>

              <h2 className="text-3xl font-bold tracking-tighter mb-8">Size Guide</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Size</th>
                      <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Chest (in)</th>
                      <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Waist (in)</th>
                      <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Hips (in)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[
                      { s: 'S', c: '34-36', w: '28-30', h: '35-37' },
                      { s: 'M', c: '38-40', w: '32-34', h: '39-41' },
                      { s: 'L', c: '42-44', w: '36-38', h: '43-45' },
                      { s: 'XL', c: '46-48', w: '40-42', h: '47-49' },
                    ].map((row) => (
                      <tr key={row.s} className="hover:bg-muted/30 transition-luxury">
                        <td className="py-4 text-sm font-bold">{row.s}</td>
                        <td className="py-4 text-sm text-muted-foreground">{row.c}</td>
                        <td className="py-4 text-sm text-muted-foreground">{row.w}</td>
                        <td className="py-4 text-sm text-muted-foreground">{row.h}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-10 p-6 bg-muted rounded-3xl">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong>Measurement Tip:</strong> For the most accurate fit, measure your body while wearing lightweight clothing. Keep the tape measure horizontal and snug, but not tight.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}