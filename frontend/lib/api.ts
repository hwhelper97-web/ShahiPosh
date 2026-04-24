import { OrderPayload, Product } from './types';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''; 
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  
  // Fallback for local development
  const port = process.env.PORT || 3000;
  return `http://localhost:${port}`;
};

const API = '/api';

export async function getProducts(params?: URLSearchParams): Promise<Product[]> {
  const suffix = params ? `?${params.toString()}` : '';
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${API}/products${suffix}`;
  
  if (typeof window === 'undefined') {
    console.log(`[Server Fetch] getProducts: ${url}`);
  }

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function getProduct(id: string): Promise<Product> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}${API}/products/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
}

export async function createOrder(payload: OrderPayload) {
  const res = await fetch(`${API}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to place order');
  return res.json();
}

export async function adminLogin(email: string, password: string): Promise<{ token: string }> {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error('Invalid login');
  return res.json();
}
