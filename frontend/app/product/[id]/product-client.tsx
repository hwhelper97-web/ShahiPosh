'use client';

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Heart, Share2, Truck, RotateCcw, ShieldCheck, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { useCart } from "@/components/cart-context";

export default function ProductClient({ product }: any) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [adding, setAdding] = useState(false);

  let images: string[] = [];
  let sizes: string[] = [];

  try {
    images = typeof product.images === "string" ? JSON.parse(product.images) : product.images;
    sizes = typeof product.sizes === "string" ? JSON.parse(product.sizes) : product.sizes;
  } catch {
    images = ["/placeholder.jpg"];
    sizes = ["S", "M", "L", "XL"];
  }

  if (!images || images.length === 0) images = ["/placeholder.jpg"];

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size first");
      return;
    }
    setAdding(true);
    addToCart(product, selectedSize, 1);
    setTimeout(() => setAdding(false), 1000);
  };

  return (
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
              {images.map((img, idx) => (
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
                    src={images[selectedImage]}
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
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent mb-4">{product.category}</p>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">{product.name}</h1>
              <p className="text-2xl font-bold">Rs {product.price.toLocaleString()}</p>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              {product.description || "Elevate your wardrobe with this premium piece from ShahiPosh. Meticulously crafted for those who appreciate the finer details."}
            </p>

            {/* Size Selector */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold uppercase tracking-widest">Select Size</h3>
                <button className="text-xs font-medium underline underline-offset-4 hover:text-accent transition-luxury">Size Guide</button>
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

            {/* Actions */}
            <div className="flex flex-col gap-4">
              <button 
                onClick={handleAddToCart}
                disabled={adding}
                className="btn-premium w-full py-5 flex items-center justify-center gap-3"
              >
                <ShoppingBag size={20} />
                {adding ? "Added to Cart!" : "Add to Cart"}
              </button>
              <a
                href={`https://wa.me/923XXXXXXXXX?text=Hello, I'm interested in: ${product.name}`}
                target="_blank"
                className="btn-outline w-full py-5 text-center"
              >
                Order via WhatsApp
              </a>
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
  );
}