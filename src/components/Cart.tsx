import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Trash2, Share2, ArrowRight, User, Users, Heart, Home, Plane, Hotel, Bus, Car, CheckCircle2, XCircle, Clock, RotateCcw, FileText } from 'lucide-react';
import { useVoyager } from '../VoyagerContext';
import { ClientCart, CartStatus } from '../types';

export default function Cart() {
  const { clients, clientCarts, updateCartStatus, setCurrentView } = useVoyager();
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || '');

  const cart = clientCarts.find(c => c.clientId === selectedClientId);
  const client = clients.find(c => c.id === selectedClientId);

  const [isAgreed, setIsAgreed] = useState(false);

  const handleShare = () => {
    if (!selectedClientId) return;
    updateCartStatus(selectedClientId, 'pending-approval');
    alert('Cart link generated and shared with client!');
  };

  const handleDownloadPDF = () => {
    setCurrentView('brochure');
  };

  const handleBookNow = () => {
    if (!isAgreed) {
      alert('Please review and agree to the terms before booking.');
      return;
    }
    setCurrentView('checkout');
  };

  const getStatusColor = (status: CartStatus) => {
    switch (status) {
      case 'draft': return 'bg-surface-container-highest text-on-surface-variant';
      case 'pending-approval': return 'bg-secondary-container text-on-secondary-container';
      case 'approved': return 'bg-success/10 text-success';
      case 'changes-requested': return 'bg-warning/10 text-warning';
      case 'on-hold': return 'bg-outline-variant/20 text-on-surface-variant';
      case 'rejected': return 'bg-error/10 text-error';
      default: return 'bg-surface-container';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Sidebar: Client Selector */}
      <aside className="lg:col-span-3 flex flex-col gap-6">
        <div className="p-6 rounded-3xl bg-surface-container-low border border-outline-variant/5">
          <h3 className="font-headline font-bold text-primary mb-6 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Client Carts
          </h3>
          <div className="space-y-2">
            {clients.map((c) => {
              const clientCart = clientCarts.find(cart => cart.clientId === c.id);
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedClientId(c.id)}
                  className={`w-full text-left p-4 rounded-2xl transition-all flex flex-col gap-1 ${
                    selectedClientId === c.id 
                      ? 'bg-primary text-on-primary shadow-lg' 
                      : 'hover:bg-surface-container-high'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">{c.name}</span>
                    {clientCart && (
                      <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                        selectedClientId === c.id ? 'bg-white/20' : 'bg-primary/10 text-primary'
                      }`}>
                        {clientCart.items.length}
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] font-medium uppercase tracking-widest opacity-60`}>
                    {c.category.replace('_', ' ')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {cart && (
          <div className="p-6 rounded-3xl bg-surface-container-low border border-outline-variant/5 flex flex-col gap-4">
            <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Cart Sharing</h4>
            <button 
              onClick={handleDownloadPDF}
              className="flex items-center gap-3 w-full p-3 bg-surface-container-lowest rounded-xl text-sm font-bold text-primary hover:bg-surface-container-high transition-all"
            >
              <FileText className="w-4 h-4" />
              Download PDF Brochure
            </button>
            <button 
              onClick={handleShare}
              className="flex items-center gap-3 w-full p-3 bg-surface-container-lowest rounded-xl text-sm font-bold text-primary hover:bg-surface-container-high transition-all"
            >
              <Share2 className="w-4 h-4" />
              Share via Link
            </button>
          </div>
        )}

        {cart && cart.status !== 'draft' && (
          <div className="p-6 rounded-3xl bg-surface-container-low border border-outline-variant/5">
            <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">Last Shared</h4>
            <div className="flex items-center gap-3 text-sm font-medium text-primary">
              <Clock className="w-4 h-4" />
              {cart.lastSharedAt || 'Never'}
            </div>
          </div>
        )}
      </aside>

      {/* Main Cart Content */}
      <main className="lg:col-span-9 space-y-8">
        {client && cart ? (
          <>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(cart.status)}`}>
                    {cart.status.replace('-', ' ')}
                  </span>
                  <span className="text-on-surface-variant text-xs font-bold uppercase tracking-widest">Cart ID: #CRT-{cart.clientId}</span>
                </div>
                <h2 className="font-headline text-4xl font-extrabold text-primary tracking-tight">{cart.tripName}</h2>
                <p className="text-on-surface-variant font-medium mt-1">Curated selections for {client.name}</p>
              </div>
              <div className="flex gap-3">
                {cart.status === 'approved' && (
                  <button 
                    onClick={handleBookNow}
                    className="flex items-center gap-2 px-8 py-4 bg-primary text-on-primary rounded-2xl font-bold shadow-xl shadow-primary/20 active:scale-95 transition-all"
                  >
                    Proceed to Book
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-8 space-y-4">
                <div className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/5 mb-6">
                  <h3 className="font-bold text-primary uppercase tracking-widest text-xs mb-4">Review & Agree</h3>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="mt-1 relative">
                      <input 
                        type="checkbox" 
                        checked={isAgreed}
                        onChange={(e) => setIsAgreed(e.target.checked)}
                        className="peer sr-only"
                      />
                      <div className="w-5 h-5 border-2 border-outline-variant rounded group-hover:border-primary transition-all peer-checked:bg-primary peer-checked:border-primary flex items-center justify-center">
                        <CheckCircle2 className={`w-3.5 h-3.5 text-white transition-opacity ${isAgreed ? 'opacity-100' : 'opacity-0'}`} />
                      </div>
                    </div>
                    <span className="text-sm text-on-surface-variant leading-relaxed">
                      I have reviewed the itinerary, pricing, and terms. I agree to proceed with the booking as outlined above.
                    </span>
                  </label>
                </div>
                {cart.items.map((item) => (
                  <div key={item.id} className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 flex items-center justify-between group hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary">
                        {item.category === 'flights' && <Plane className="w-6 h-6" />}
                        {item.category === 'hotels' && <Hotel className="w-6 h-6" />}
                        {item.category === 'buses' && <Bus className="w-6 h-6" />}
                        {item.category === 'private' && <Car className="w-6 h-6" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-primary">{item.title}</h4>
                        <p className="text-sm text-on-surface-variant">{item.subtitle}</p>
                        <p className="text-[10px] text-secondary font-bold uppercase tracking-widest mt-1">
                          {item.passengerCount} Pax · ${item.perPersonPrice}/ea
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-primary">${item.price.toLocaleString()}</p>
                      <button className="text-error opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="md:col-span-4 space-y-6">
                <div className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/5">
                  <h3 className="font-bold text-primary uppercase tracking-widest text-xs mb-6">Pricing Breakdown</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-on-surface-variant">Subtotal</span>
                      <span className="font-bold text-primary">${cart.items.reduce((acc, i) => acc + i.price, 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-on-surface-variant">Taxes & Fees</span>
                      <span className="font-bold text-primary">${(cart.items.reduce((acc, i) => acc + i.price, 0) * 0.12).toLocaleString()}</span>
                    </div>
                    <div className="pt-4 border-t border-outline-variant/10 flex justify-between items-center">
                      <span className="font-black text-primary uppercase tracking-widest text-xs">Total</span>
                      <span className="text-2xl font-black text-primary">${(cart.items.reduce((acc, i) => acc + i.price, 0) * 1.12).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10">
                  <h3 className="font-bold text-primary uppercase tracking-widest text-xs mb-4">Client Interaction</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-on-surface-variant">
                      <div className={`w-2 h-2 rounded-full ${cart.status === 'approved' ? 'bg-success' : 'bg-outline-variant'}`} />
                      {cart.status === 'approved' ? 'Client Approved' : 'Waiting for Approval'}
                    </div>
                    <button 
                      onClick={() => setCurrentView('client-review')}
                      className="w-full py-3 bg-surface-container-high text-primary rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-surface-container-highest transition-all"
                    >
                      Preview Client View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center mb-6">
              <ShoppingCart className="w-10 h-10 text-outline" />
            </div>
            <h2 className="text-2xl font-bold text-primary mb-2">No Active Cart</h2>
            <p className="text-on-surface-variant max-w-md">Select a client and add items from the Planner to build a custom travel cart.</p>
            <button 
              onClick={() => setCurrentView('planner')}
              className="mt-8 flex items-center gap-2 px-8 py-3 bg-primary text-on-primary rounded-xl font-bold shadow-lg"
            >
              Go to Planner
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
