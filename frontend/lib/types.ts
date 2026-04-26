export type Product = {
  id: string;
  name: string;
  regularPrice: number;
  salePrice?: number | null;
  description: string;
  richDescription?: string | null;
  images: string[] | string;
  category: any;
  categoryId?: string | null;
  sizes: string[] | string;
  sku?: string | null;
  inventory?: number;
  status?: string;
  createdAt: string;
};

export type CartItem = Product & {
  size: string;
  quantity: number;
};

export type OrderPayload = {
  customerName: string;
  phone: string;
  address: string;
  city?: string;
  area?: string;
  items: CartItem[];
  totalPrice: number;
  paymentMethod: string;
};
