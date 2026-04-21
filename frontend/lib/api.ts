import { OrderPayload, Product } from './types';

const API = '/api';

export async function getProducts(params?: URLSearchParams): Promise<Product[]> {
  const suffix = params ? `?${params.toString()}` : '';
  const res = await fetch(`${API}/products${suffix}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function getProduct(id: string): Promise<Product> {
  const res = await fetch(`${API}/products/${id}`, { cache: 'no-store' });
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
