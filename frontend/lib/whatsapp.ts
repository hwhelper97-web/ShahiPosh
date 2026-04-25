import { CartItem, Product } from './types';

export const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923000000000';

export const buildProductMessage = (product: Product, size: string, quantity: number) =>
  `Hello, I want to order:\nProduct: ${product.name}\nSize: ${size}\nQuantity: ${quantity}\nPrice: ${product.salePrice || product.regularPrice}`;

export const buildCartMessage = (items: CartItem[]) => {
  const lines = items
    .map((item) => `${item.name} | Size: ${item.size} | Qty: ${item.quantity} | Price: ${item.salePrice || item.regularPrice}`)
    .join('\n');
  return `Hello, I want to order:\n${lines}`;
};

export const waLink = (message: string) =>
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
