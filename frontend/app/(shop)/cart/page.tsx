'use client';

import { useCart } from "@/components/cart-context";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, ShieldCheck } from "lucide-react";
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
          <div className="text-center py-24 bg-muted/30 rounded-[3rem] border-2 border-dashed border-border/50 mx-4">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
              <ShoppingBag size={40} className="text-accent" />
            </div>
            <h2 className="text-3xl font-black tracking-tighter mb-4">Your archives are empty</h2>
            <p className="text-sm text-muted-foreground mb-10 max-w-xs mx-auto font-medium">Discover our meticulously handcrafted collections and begin your luxury journey.</p>
            <Link href="/shop" className="btn-premium px-12">
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 px-4 md:px-0">
            {/* Cart Items */}
            <div className="lg:col-span-8 space-y-6">
              {cart.map((item: any, i: number) => (
                <div key={i} className="flex flex-col sm:flex-row gap-6 p-6 md:p-8 bg-white border border-border rounded-[2.5rem] shadow-sm hover:shadow-md transition-all group">
                  <div className="relative w-full sm:w-32 aspect-[3/4] rounded-2xl overflow-hidden bg-muted flex-shrink-0 shadow-lg">
                    {(() => {
                      const src = item.image || "/placeholder.jpg";
                      const finalSrc = (src.startsWith("/") || src.startsWith("http")) ? src : `/products/${src}`;
                      return (
                        <Image 
                          src={finalSrc} 
                          alt={item.name} 
                          fill 
                          className="object-cover transition-transform duration-700 md:group-hover:scale-110"
                        />
                      );
                    })()}
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between py-2">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <h3 className="text-lg md:text-xl font-black tracking-tighter hover:text-accent transition-luxury">
                          <Link href={`/product/${item.id}`}>{item.name}</Link>
                        </h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">
                          Size: {item.size}
                        </p>
                      </div>
                      <p className="text-lg font-black text-primary">{settings.currency} {(item.price || item.salePrice || item.regularPrice || 0).toLocaleString()}</p>
                    </div>

                    <div className="flex justify-between items-center mt-8 md:mt-4">
                      <div className="flex items-center gap-6 bg-[#faf9f6] border border-border px-5 py-3 rounded-2xl">
                        <button className="text-muted-foreground hover:text-primary active:scale-125 transition-transform"><Minus size={16} /></button>
                        <span className="text-sm font-black w-6 text-center">{item.quantity}</span>
                        <button className="text-muted-foreground hover:text-primary active:scale-125 transition-transform"><Plus size={16} /></button>
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(i)}
                        className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-90"
                        aria-label="Remove item"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4 mt-8 lg:mt-0">
              <div className="bg-primary text-white p-10 rounded-[3rem] space-y-8 sticky top-32 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-bl-full translate-x-10 -translate-y-10" />
                
                <h2 className="text-xl font-black uppercase tracking-[0.3em]">Vault Summary</h2>
                
                <div className="space-y-5 pt-8 border-t border-white/10">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-white/60">
                    <span>Subtotal</span>
                    <span className="text-white">{settings.currency} {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-white/60">
                    <span>Luxury Shipping</span>
                    <span className="text-accent">{shipping === 0 ? "Complimentary" : `${settings.currency} ${shipping}`}</span>
                  </div>
                  <div className="flex justify-between text-4xl pt-8 border-t border-white/10 items-end">
                    <span className="font-bold tracking-tighter">Total</span>
                    <div className="text-right">
                      <span className="font-black text-accent block">{settings.currency} {total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <Link href="/checkout" className="btn-premium w-full flex items-center justify-center gap-4 bg-accent hover:bg-white hover:text-primary">
                  Begin Settlement
                  <ArrowRight size={18} />
                </Link>
                
                <div className="flex items-center justify-center gap-3 pt-4 opacity-40">
                  <ShieldCheck size={14} />
                  <p className="text-[9px] font-black uppercase tracking-[0.2em]">
                    SSL Secured Gateway
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}