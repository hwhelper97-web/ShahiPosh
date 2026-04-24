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
      className="group"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-muted rounded-2xl mb-4">
        <Link href={`/product/${product.id}`}>
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-cover transition-luxury group-hover:scale-105"
          />
        </Link>

        {/* Hover Actions */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-0 translate-y-4 transition-luxury group-hover:opacity-100 group-hover:translate-y-0">
          <button className="w-10 h-10 rounded-full bg-white text-primary flex items-center justify-center shadow-lg hover:bg-accent hover:text-white transition-luxury">
            <ShoppingCart size={18} />
          </button>
          <Link href={`/product/${product.id}`} className="w-10 h-10 rounded-full bg-white text-primary flex items-center justify-center shadow-lg hover:bg-accent hover:text-white transition-luxury">
            <Eye size={18} />
          </Link>
          <button className="w-10 h-10 rounded-full bg-white text-primary flex items-center justify-center shadow-lg hover:bg-accent hover:text-white transition-luxury">
            <Heart size={18} />
          </button>
        </div>

        {/* Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-black/5">
            New
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Link href={`/product/${product.id}`} className="hover:text-accent transition-luxury">
          <h3 className="text-sm font-medium tracking-tight">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground uppercase tracking-widest">
          {product.category?.name || product.category}
        </p>
        <p className="text-sm font-bold mt-1">
          {product.salePrice ? (
            <span className="flex items-center gap-2">
              <span className="text-accent">{settings.currency} {product.salePrice.toLocaleString()}</span>
              <span className="text-[10px] text-muted-foreground line-through decoration-muted-foreground/30">{settings.currency} {product.regularPrice.toLocaleString()}</span>
            </span>
          ) : (
            <span>{settings.currency} {(product.regularPrice || 0).toLocaleString()}</span>
          )}
        </p>
      </div>
    </motion.div>
  );
}