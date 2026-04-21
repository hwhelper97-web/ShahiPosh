'use client';

import { FormEvent, useState } from 'react';
import { useCart } from '@/components/cart-context';
import { createOrder } from '@/lib/api';
import Image from 'next/image';
import { ShieldCheck, Truck, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const [form, setForm] = useState({ customerName: '', phone: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const subtotal = cart.reduce((s: number, i: any) => s + i.price * i.quantity, 0);
  const shipping = subtotal > 5000 ? 0 : 250;
  const total = subtotal + shipping;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Transforming cart to match backend expected format if needed
      const orderItems = cart.map((item: any) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
        size: item.size
      }));

      await createOrder({ ...form, items: orderItems, totalPrice: total });
      clearCart();
      setDone(true);
    } catch (err) {
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (done) return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-8 p-12 bg-white rounded-3xl shadow-xl border border-border">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 size={40} className="text-green-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-4">Order Confirmed!</h1>
          <p className="text-muted-foreground leading-relaxed">
            Thank you for shopping with ShahiPosh. Your order has been placed successfully and will be delivered within 3-5 business days.
          </p>
        </div>
        <div className="pt-4">
          <Link href="/shop" className="btn-premium inline-block w-full">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );

  if (cart.length === 0) return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center space-y-6">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <Link href="/shop" className="btn-outline inline-block">Go to Shop</Link>
      </div>
    </div>
  );

  return (
    <div className="bg-background min-h-screen pt-32 pb-20">
      <div className="container">
        <Link href="/cart" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-luxury mb-12 uppercase tracking-widest font-bold">
          <ArrowLeft size={16} />
          Back to Cart
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Checkout Form */}
          <div className="lg:col-span-7">
            <h1 className="text-4xl font-bold tracking-tighter mb-10">Checkout</h1>
            
            <form onSubmit={onSubmit} className="space-y-10">
              <div className="space-y-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-accent border-b border-border pb-4">Shipping Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-4">Full Name</label>
                    <input 
                      required 
                      placeholder="Enter your name" 
                      className="w-full bg-muted border-none rounded-2xl px-6 py-4 text-sm focus:ring-1 focus:ring-accent transition-luxury"
                      onChange={(e) => setForm({ ...form, customerName: e.target.value })} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-4">Phone Number</label>
                    <input 
                      required 
                      type="tel"
                      placeholder="+92 3XX XXXXXXX" 
                      className="w-full bg-muted border-none rounded-2xl px-6 py-4 text-sm focus:ring-1 focus:ring-accent transition-luxury"
                      onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-4">Shipping Address</label>
                  <textarea 
                    required 
                    placeholder="Enter your full street address, city, and province" 
                    rows={4}
                    className="w-full bg-muted border-none rounded-2xl px-6 py-4 text-sm focus:ring-1 focus:ring-accent transition-luxury"
                    onChange={(e) => setForm({ ...form, address: e.target.value })} 
                  />
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-accent border-b border-border pb-4">Payment Method</h2>
                <div className="p-6 bg-muted rounded-2xl border-2 border-accent/20 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                      <Truck size={20} className="text-accent" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Cash on Delivery</p>
                      <p className="text-xs text-muted-foreground">Pay when you receive your order</p>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                </div>
              </div>

              <button 
                disabled={loading}
                className="btn-premium w-full py-5 text-lg font-bold shadow-2xl disabled:opacity-70"
              >
                {loading ? "Processing..." : `Place Order • Rs ${total.toLocaleString()}`}
              </button>

              <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest flex items-center justify-center gap-2">
                <ShieldCheck size={14} />
                Your data is protected by ShahiPosh end-to-end security
              </p>
            </form>
          </div>

          {/* Side Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-border p-10 rounded-[2.5rem] sticky top-32">
              <h2 className="text-xl font-bold uppercase tracking-widest mb-8">Summary</h2>
              
              <div className="space-y-6 mb-10 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item: any, i: number) => (
                  <div key={i} className="flex gap-4">
                    <div className="relative w-16 aspect-[3/4] rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <Image src={item.image || "/placeholder.jpg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="text-sm font-bold truncate max-w-[200px]">{item.name}</h3>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Size: {item.size} • Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold">Rs {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-8 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-bold">Rs {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-bold">{shipping === 0 ? "FREE" : `Rs ${shipping}`}</span>
                </div>
                <div className="flex justify-between text-xl pt-6 border-t border-border">
                  <span className="font-bold tracking-tighter">Total</span>
                  <span className="font-extrabold text-accent">Rs {total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
