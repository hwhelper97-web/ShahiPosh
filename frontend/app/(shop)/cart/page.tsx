'use client';

import { useCart } from "@/components/cart-context";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useSettings } from "@/components/settings-context";

export default function CartPage() {
  const { cart, removeFromCart } = useCart();
  const { settings } = useSettings();

  const subtotal = cart.reduce((s: number, i: any) => s + (i.price || i.salePrice || i.regularPrice || 0) * i.quantity, 0);
  const shippingThreshold = Number(settings.freeShippingThreshold);
  const shippingFee = Number(settings.shippingFee);
  const shipping = subtotal > shippingThreshold ? 0 : shippingFee;
  const total = subtotal + shipping;

  return (
    <div className="bg-background min-h-screen pt-32 pb-20">
      <div className="container">
        <h1 className="text-4xl font-bold tracking-tighter mb-12">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-muted rounded-3xl">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={32} className="text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Link href="/shop" className="btn-premium inline-block">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-8 space-y-6">
              {cart.map((item: any, i: number) => (
                <div key={i} className="flex gap-6 p-6 bg-white border border-border rounded-3xl group">
                  <div className="relative w-24 aspect-[3/4] rounded-xl overflow-hidden bg-muted flex-shrink-0">
                    {(() => {
                      const src = item.image || "/placeholder.jpg";
                      const finalSrc = (src.startsWith("/") || src.startsWith("http")) ? src : `/products/${src}`;
                      return (
                        <Image 
                          src={finalSrc} 
                          alt={item.name} 
                          fill 
                          className="object-cover"
                        />
                      );
                    })()}
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold hover:text-accent transition-luxury">
                          <Link href={`/product/${item.id}`}>{item.name}</Link>
                        </h3>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
                          Size: {item.size}
                        </p>
                      </div>
                      <p className="font-bold">{settings.currency} {(item.price || item.salePrice || item.regularPrice || 0).toLocaleString()}</p>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center gap-4 bg-muted px-4 py-2 rounded-full">
                        <button className="text-muted-foreground hover:text-primary"><Minus size={14} /></button>
                        <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                        <button className="text-muted-foreground hover:text-primary"><Plus size={14} /></button>
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(i)}
                        className="text-muted-foreground hover:text-red-500 transition-luxury flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-muted p-8 rounded-3xl space-y-6 sticky top-32">
                <h2 className="text-xl font-bold uppercase tracking-widest">Order Summary</h2>
                
                <div className="space-y-4 pt-4 border-t border-white/20">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-bold">{settings.currency} {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-bold">{shipping === 0 ? "FREE" : `${settings.currency} ${shipping}`}</span>
                  </div>
                  <div className="flex justify-between text-lg pt-4 border-t border-white/20">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-accent">{settings.currency} {total.toLocaleString()}</span>
                  </div>
                </div>

                <Link href="/checkout" className="btn-premium w-full flex items-center justify-center gap-3">
                  Checkout
                  <ArrowRight size={18} />
                </Link>
                
                <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest">
                  Secure checkout powered by ShahiPosh
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}