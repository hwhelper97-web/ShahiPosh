import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types';

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.id}`} className="group card overflow-hidden">
      <div className="relative h-72 w-full overflow-hidden">
        <Image src={product.images[0] || 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200'} alt={product.name} fill className="object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
      </div>
      <div className="p-4">
        <p className="text-white/60">{product.category}</p>
        <h3 className="text-lg font-medium">{product.name}</h3>
        <p className="text-accent">${product.price}</p>
      </div>
    </Link>
  );
}
