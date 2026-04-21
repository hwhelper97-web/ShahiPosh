export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  category: string;
  sizes: string[];
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
  items: CartItem[];
  totalPrice: number;
};
