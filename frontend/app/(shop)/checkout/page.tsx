'use client';

import { FormEvent, useState, useEffect } from 'react';
import { useCart } from '@/components/cart-context';
import { createOrder } from '@/lib/api';
import Image from 'next/image';
import { ShieldCheck, Truck, ArrowLeft, CheckCircle2, User, MapPin, CreditCard, ShoppingBag, ChevronRight, Lock } from 'lucide-react';
import Link from 'next/link';
import { useSettings } from '@/components/settings-context';
import { motion, AnimatePresence } from 'framer-motion';

export default function CheckoutPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const { settings } = useSettings();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ 
    customerName: '', 
    customerEmail: '',
    phone: '', 
    address: '',
    city: '',
    area: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [paymentDetails, setPaymentDetails] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    mobileAccount: ''
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [orderInfo, setOrderInfo] = useState<any>(null);

  const subtotal = cart.reduce((s: number, i: any) => s + (i.price || i.salePrice || i.regularPrice || 0) * i.quantity, 0);
  const shippingThreshold = Number(settings.freeShippingThreshold);
  const shippingFee = Number(settings.shippingFee);
  const shipping = subtotal > shippingThreshold ? 0 : shippingFee;
  const total = subtotal + shipping;

  const steps = [
    { title: 'Identity', icon: User },
    { title: 'Shipping', icon: MapPin },
    { title: 'Payment', icon: CreditCard },
    { title: 'Review', icon: ShoppingBag },
  ];

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    try {
      const orderItems = cart.map((item: any) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price || item.salePrice || item.regularPrice || 0,
        size: item.size,
        name: item.name,
        image: item.image // Add image to order item
      }));

      const res = await createOrder({ 
        ...form, 
        items: orderItems, 
        totalPrice: total, 
        paymentMethod,
        paymentDetails // Send card or mobile account details
      });
      setOrderInfo(res);
      
      if (res.requiresRedirect && res.paymentUrl) {
        // In a real app, this would be: window.location.href = res.paymentUrl;
        // For demonstration, we'll simulate the redirect delay
        setTimeout(() => {
          window.location.href = res.paymentUrl;
        }, 1500);
      } else {
        clearCart();
        setDone(true);
      }
    } catch (err) {
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (done) return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-8 p-12 bg-white rounded-3xl shadow-xl border border-border animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 size={40} className="text-green-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-4">Order Received!</h1>
          <p className="text-muted-foreground leading-relaxed text-sm">
            Thank you, <span className="font-bold text-primary">{form.customerName}</span>. 
            Your order <span className="font-mono font-bold text-accent">#{orderInfo?.orderNumber}</span> has been created.
            {['BANK_TRANSFER', 'EASYPAISA', 'JAZZCASH'].includes(paymentMethod) 
              ? ` Please complete your payment via ${paymentMethod.replace('_', ' ')} using the details provided.` 
              : ' Our team will now begin processing your luxury selection.'}
          </p>
        </div>
        <div className="pt-4">
          <Link href="/shop" className="btn-premium inline-block w-full">
            Return to Collection
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
      <div className="container px-5 md:px-8">
        {/* Step Progress - Optimized for 320px+ */}
        <div className="max-w-4xl mx-auto mb-16 md:mb-24">
          <div className="flex justify-between relative px-2">
            <div className="absolute top-[22px] md:top-6 left-0 w-full h-[2px] bg-border z-0" />
            <div 
              className="absolute top-[22px] md:top-6 left-0 h-[2px] bg-accent z-0 transition-all duration-1000 ease-out" 
              style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
            />
            {steps.map((s, i) => {
              const Icon = s.icon;
              const active = i <= step;
              const current = i === step;
              return (
                <div key={i} className="relative z-10 flex flex-col items-center gap-3">
                  <div className={`w-10 h-10 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 md:border-4 ${
                    active ? 'bg-primary border-primary text-white' : 'bg-white border-border text-muted-foreground'
                  } ${current ? 'scale-110 md:scale-125 shadow-xl ring-4 md:ring-8 ring-accent/10' : ''}`}>
                    <Icon size={current ? 20 : 16} className={current ? 'animate-pulse' : ''} />
                  </div>
                  <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] hidden sm:block ${active ? 'text-primary' : 'text-muted-foreground'}`}>
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Checkout Form */}
          <div className="lg:col-span-7">
            <form onSubmit={onSubmit} className="space-y-12">
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-10"
                  >
                    <div className="space-y-2">
                      <h2 className="text-4xl font-bold tracking-tighter">Personal Identity</h2>
                      <p className="text-muted-foreground text-sm">Provide your contact details for order tracking and security.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-4">Full Name</label>
                        <input 
                          required 
                          value={form.customerName}
                          placeholder="Syed Saif" 
                          className="w-full bg-muted/50 border-none rounded-2xl px-8 py-5 text-sm focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                          onChange={(e) => setForm({ ...form, customerName: e.target.value })} 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-4">Email Address</label>
                        <input 
                          required 
                          type="email"
                          value={form.customerEmail}
                          placeholder="saif@example.com" 
                          className="w-full bg-muted/50 border-none rounded-2xl px-8 py-5 text-sm focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                          onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} 
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-4">Phone Number</label>
                        <input 
                          required 
                          type="tel"
                          value={form.phone}
                          placeholder="+92 3XX XXXXXXX" 
                          className="w-full bg-muted/50 border-none rounded-2xl px-8 py-5 text-sm focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                          onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-10"
                  >
                    <div className="space-y-2">
                      <h2 className="text-4xl font-bold tracking-tighter">Shipping Destination</h2>
                      <p className="text-muted-foreground text-sm">Where should we deliver your luxury selection?</p>
                    </div>
                    <div className="space-y-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-4">Full Address</label>
                        <textarea 
                          required 
                          value={form.address}
                          placeholder="Street Address, Apartment, Suite, etc." 
                          rows={4}
                          className="w-full bg-muted/50 border-none rounded-3xl px-8 py-5 text-sm focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                          onChange={(e) => setForm({ ...form, address: e.target.value })} 
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-4">City</label>
                          <input 
                            required 
                            value={form.city}
                            placeholder="Lahore" 
                            className="w-full bg-muted/50 border-none rounded-2xl px-8 py-5 text-sm focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                            onChange={(e) => setForm({ ...form, city: e.target.value })} 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-4">Area / Neighborhood</label>
                          <input 
                            required 
                            value={form.area}
                            placeholder="Gulberg III" 
                            className="w-full bg-muted/50 border-none rounded-2xl px-8 py-5 text-sm focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                            onChange={(e) => setForm({ ...form, area: e.target.value })} 
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-10"
                  >
                    <div className="space-y-2">
                      <h2 className="text-4xl font-bold tracking-tighter">Payment Selection</h2>
                      <p className="text-muted-foreground text-sm">Choose your preferred secure payment gateway.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-5">
                      {[
                        { id: 'BANK_TRANSFER', title: 'Bank Transfer', desc: 'Manual Verification Flow', icon: ShieldCheck, color: 'primary' },
                        { id: 'COD', title: 'Cash on Delivery', desc: 'Pay upon Receiving', icon: Truck, color: 'muted-foreground' },
                      ].map((m) => (
                        <div key={m.id} className="space-y-4">
                          <div 
                            onClick={() => setPaymentMethod(m.id)}
                            className={`p-8 rounded-[2rem] border-2 transition-all cursor-pointer flex items-center justify-between group ${
                              paymentMethod === m.id ? 'bg-white border-accent shadow-2xl scale-[1.02]' : 'bg-muted/30 border-transparent hover:border-border'
                            }`}
                          >
                            <div className="flex items-center gap-6">
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                                paymentMethod === m.id ? 'bg-accent/10 shadow-inner' : 'bg-white'
                              }`}>
                                {typeof m.icon === 'string' ? (
                                  <span className={`font-black text-2xl italic ${paymentMethod === m.id ? `text-${m.color}` : 'text-muted-foreground'}`}>{m.icon}</span>
                                ) : (
                                  <m.icon size={28} className={paymentMethod === m.id ? `text-${m.color}` : 'text-muted-foreground'} />
                                )}
                              </div>
                              <div>
                                <p className="font-black text-sm tracking-tight">{m.title}</p>
                                <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60">{m.desc}</p>
                              </div>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === m.id ? 'border-accent bg-accent' : 'border-muted-foreground/20'}`}>
                              {paymentMethod === m.id && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                          </div>

                          {/* Conditional Input Fields */}
                          {paymentMethod === m.id && m.id === 'CARD' && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="px-8 pb-4 space-y-6 animate-in slide-in-from-top-2">
                              <div className="p-10 bg-accent/[0.02] border border-accent/10 rounded-[2.5rem] space-y-8 shadow-inner">
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-accent/60 ml-4">Cardholder Name</label>
                                  <input 
                                    placeholder="SYED SAIF" 
                                    className="w-full bg-white border border-border/50 rounded-2xl px-8 py-5 text-sm focus:ring-2 focus:ring-accent/20 outline-none transition-all uppercase"
                                    onChange={(e) => setPaymentDetails({ ...paymentDetails, cardName: e.target.value })}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-accent/60 ml-4">Card Number</label>
                                  <div className="relative">
                                    <input 
                                      placeholder="0000 0000 0000 0000" 
                                      className="w-full bg-white border border-border/50 rounded-2xl px-8 py-5 text-sm focus:ring-2 focus:ring-accent/20 outline-none transition-all font-mono"
                                      onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
                                    />
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-2">
                                      <div className="w-8 h-5 bg-muted rounded shadow-sm" />
                                      <div className="w-8 h-5 bg-muted rounded shadow-sm" />
                                    </div>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-accent/60 ml-4">Expiry Date</label>
                                    <input 
                                      placeholder="MM / YY" 
                                      className="w-full bg-white border border-border/50 rounded-2xl px-8 py-5 text-sm focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                                      onChange={(e) => setPaymentDetails({ ...paymentDetails, expiry: e.target.value })}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-accent/60 ml-4">CVV / CVC</label>
                                    <input 
                                      type="password"
                                      placeholder="•••" 
                                      className="w-full bg-white border border-border/50 rounded-2xl px-8 py-5 text-sm focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                                      onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
                                    />
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {paymentMethod === m.id && (m.id === 'EASYPAISA' || m.id === 'JAZZCASH') && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="px-8 pb-4 animate-in slide-in-from-top-2">
                               <div className="p-10 bg-muted/20 border border-border rounded-[2.5rem] space-y-6 shadow-inner">
                                  <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-4">Mobile Account Number</label>
                                    <div className="relative">
                                      <input 
                                        placeholder="03XX XXXXXXX" 
                                        className="w-full bg-white border border-border/50 rounded-2xl px-8 py-5 text-sm focus:ring-2 focus:ring-accent/20 outline-none transition-all font-bold"
                                        onChange={(e) => setPaymentDetails({ ...paymentDetails, mobileAccount: e.target.value })}
                                      />
                                      <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Linked Account</span>
                                    </div>
                                  </div>
                                  <p className="text-[9px] font-bold text-muted-foreground/60 leading-relaxed italic ml-4">
                                    * An automated authorization request will be sent to your {m.title.split(' ')[0]} account for immediate processing.
                                  </p>
                               </div>
                            </motion.div>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-10"
                  >
                    <div className="space-y-2">
                      <h2 className="text-4xl font-bold tracking-tighter">Final Review</h2>
                      <p className="text-muted-foreground text-sm">Please verify your details before we finalize your order.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="p-10 bg-white border border-border rounded-[2.5rem] space-y-6 shadow-sm">
                        <div className="flex items-center gap-3 text-accent mb-2">
                          <User size={18} />
                          <h3 className="text-xs font-black uppercase tracking-widest">Customer Details</h3>
                        </div>
                        <div>
                          <p className="text-sm font-bold">{form.customerName}</p>
                          <p className="text-xs text-muted-foreground">{form.customerEmail}</p>
                          <p className="text-xs text-muted-foreground">{form.phone}</p>
                        </div>
                      </div>
                      <div className="p-10 bg-white border border-border rounded-[2.5rem] space-y-6 shadow-sm">
                        <div className="flex items-center gap-3 text-accent mb-2">
                          <MapPin size={18} />
                          <h3 className="text-xs font-black uppercase tracking-widest">Shipping To</h3>
                        </div>
                        <p className="text-xs font-bold leading-relaxed">{form.address}</p>
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{form.city}, {form.area}</p>
                      </div>
                    </div>

                    <div className="p-10 bg-accent/[0.03] border border-accent/10 rounded-[2.5rem] space-y-6">
                       <div className="flex items-center justify-between">
                         <div className="flex items-center gap-6">
                           <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md">
                             <CreditCard className="text-accent" />
                           </div>
                           <div>
                             <h3 className="text-xs font-black uppercase tracking-widest text-accent mb-1">Selected Payment</h3>
                             <p className="text-sm font-bold">{paymentMethod?.replace('_', ' ') || 'Select Method'}</p>
                           </div>
                         </div>
                         <button type="button" onClick={() => setStep(2)} className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline underline-offset-4">Change Method</button>
                       </div>

                       {(paymentMethod === 'CARD' && paymentDetails.cardNumber) && (
                         <div className="pt-6 border-t border-accent/10 grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Card Number</p>
                              <p className="text-xs font-mono font-bold tracking-widest">•••• •••• •••• {paymentDetails.cardNumber.slice(-4)}</p>
                            </div>
                            <div>
                              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Cardholder</p>
                              <p className="text-xs font-bold uppercase">{paymentDetails.cardName}</p>
                            </div>
                         </div>
                       )}

                       {((paymentMethod === 'EASYPAISA' || paymentMethod === 'JAZZCASH') && paymentDetails.mobileAccount) && (
                         <div className="pt-6 border-t border-accent/10">
                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Mobile Account</p>
                            <p className="text-sm font-black text-primary">{paymentDetails.mobileAccount}</p>
                            <p className="text-[8px] font-bold text-accent uppercase tracking-widest mt-1">Automated Settlement Link Active</p>
                         </div>
                       )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center justify-between pt-12 border-t border-border">
                {step > 0 ? (
                  <button 
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:text-accent transition-all"
                  >
                    <ArrowLeft size={16} />
                    Back
                  </button>
                ) : <div />}

                <button 
                  disabled={loading}
                  className="btn-premium px-12 py-5 flex items-center justify-center gap-4 group disabled:opacity-50"
                >
                  <span className="font-black uppercase tracking-[0.2em] text-[11px]">
                    {loading ? 'Processing...' : (step === 3 ? 'Finalize Order' : 'Continue')}
                  </span>
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>
          </div>

          {/* Side Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-border p-12 rounded-[3rem] sticky top-32 shadow-2xl overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full translate-x-10 -translate-y-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-700" />
              
              <h2 className="text-2xl font-bold tracking-tighter mb-10 flex items-center gap-4">
                <ShoppingBag className="text-accent" />
                Order Summary
              </h2>
              
              <div className="space-y-8 mb-12 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                {cart.map((item: any, i: number) => (
                  <div key={i} className="flex gap-6 items-center">
                    <div className="relative w-20 aspect-[3/4] rounded-2xl overflow-hidden bg-muted flex-shrink-0 shadow-lg">
                      <Image src={item.image || "/placeholder.jpg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-black truncate tracking-tight">{item.name}</h3>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 font-bold">
                        {item.size} <span className="mx-2 opacity-30">•</span> {item.quantity} Unit{item.quantity > 1 ? 's' : ''}
                      </p>
                    </div>
                    <p className="text-sm font-black text-accent">{settings.currency} {((item.price || item.salePrice || item.regularPrice || 0) * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-10 border-t border-border">
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-primary">{settings.currency} {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                  <span>Luxury Shipping</span>
                  <span className="text-green-600">{shipping === 0 ? "Complimentary" : `${settings.currency} ${shipping}`}</span>
                </div>
                <div className="flex justify-between text-3xl pt-10 border-t border-border">
                  <span className="font-bold tracking-tighter">Total</span>
                  <div className="text-right">
                    <span className="font-black text-accent block">{settings.currency} {total.toLocaleString()}</span>
                    <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mt-1">VAT & Duties Included</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 p-6 bg-muted/50 rounded-2xl flex items-center gap-4 border border-dashed border-border">
                <Lock size={20} className="text-muted-foreground" />
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                  Enterprise SSL Secured <br /> 256-bit Payment Encryption
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
