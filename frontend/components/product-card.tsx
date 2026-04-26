'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Eye, Heart } from "lucide-react";
import { useSettings } from "./settings-context";

type Product = {
  id: string;
  name: string;
  regularPrice: number;
  salePrice?: number | null;
  category: any;
  images: string | string[];
};

export function ProductCard({ product }: { product: Product }) {
  const { settings } = useSettings();
  let images: string[] = [];

  try {
    images =
      typeof product.images === "string"
        ? JSON.parse(product.images)
        : product.images;
  } catch {
    images = [];
  }

  let imageSrc = "/placeholder.jpg";
  if (images?.[0]) {
    const firstImg = typeof images[0] === 'string' ? images[0] : (images[0] as any).url;
    if (firstImg) {
      if (firstImg.startsWith("/") || firstImg.startsWith("http")) {
        imageSrc = firstImg;
      } else {
        imageSrc = `/products/${firstImg}`;
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-muted rounded-[2rem] mb-4 shadow-sm active:scale-[0.98] transition-transform">
        <Link href={`/product/${product.id}`} className="block h-full">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-cover transition-luxury md:group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        </Link>

        {/* Action Overlay - Optimized for Touch (Always visible or easy to tap on mobile) */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 md:opacity-0 md:translate-y-4 md:transition-luxury md:group-hover:opacity-100 md:group-hover:translate-y-0">
          <div className="flex gap-2">
            <button className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-white/90 backdrop-blur-md text-primary flex items-center justify-center shadow-lg active:bg-accent active:text-white transition-all">
              <Heart size={16} />
            </button>
          </div>
          <button className="flex-1 h-9 md:h-11 rounded-full bg-primary text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg active:bg-accent transition-all">
            <ShoppingCart size={14} />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>

        {/* Badge */}
        {product.salePrice && (
          <div className="absolute top-4 left-4">
            <span className="bg-accent text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
              Sale
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5 px-1">
        <p className="text-[9px] md:text-[10px] text-accent font-black uppercase tracking-[0.2em]">
          {product.category?.name || product.category || "Exquisite"}
        </p>
        <Link href={`/product/${product.id}`} className="hover:text-accent transition-luxury">
          <h3 className="text-sm md:text-lg font-extrabold tracking-tighter leading-tight line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mt-0.5">
          {product.salePrice ? (
            <>
              <span className="text-sm md:text-base font-black text-primary">{settings.currency} {product.salePrice.toLocaleString()}</span>
              <span className="text-[10px] md:text-xs text-muted-foreground line-through opacity-50">{settings.currency} {product.regularPrice.toLocaleString()}</span>
            </>
          ) : (
            <span className="text-sm md:text-base font-black text-primary">{settings.currency} {(product.regularPrice || 0).toLocaleString()}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}