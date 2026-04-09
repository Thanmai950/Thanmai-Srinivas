import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Edit3, Clock, XCircle, Plane, Hotel, Bus, Car, ArrowLeft, Globe, MapPin, Calendar, Users } from 'lucide-react';
import { useVoyager } from '../VoyagerContext';

export default function ClientReview() {
  const { clients, clientCarts, updateCartStatus, setCurrentView, selectedClientId } = useVoyager();
  const [feedback, setFeedback] = useState('');

  const cart = clientCarts.find(c => c.clientId === selectedClientId);
  const client = clients.find(c => c.id === selectedClientId);

  if (!client || !cart) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Review Link Expired</h2>
        <p className="text-on-surface-variant mb-8">This travel plan is no longer available for review.</p>
        <button onClick={() => setCurrentView('cart')} className="px-8 py-3 bg-primary text-on-primary rounded-xl font-bold">Return to Dashboard</button>
      </div>
    );
  }

  const handleAction = (status: 'approved' | 'changes-requested' | 'on-hold' | 'rejected') => {
    updateCartStatus(client.id, status);
    setCurrentView('cart');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="bg-primary text-on-primary p-4 rounded-2xl flex items-center justify-between no-print">
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-secondary" />
          <span className="text-xs font-bold uppercase tracking-widest">Client Review Mode</span>
        </div>
        <button 
          onClick={() => setCurrentView('cart')}
          className="text-xs font-bold uppercase tracking-widest hover:text-secondary transition-colors"
        >
          Exit Preview
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Itinerary Details */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-surface-container-low p-10 rounded-[2.5rem] border border-outline-variant/5">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-secondary-container text-on-secondary-container px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                Proposed Itinerary
              </span>
              <span className="text-on-surface-variant text-xs font-bold uppercase tracking-widest">Sept 14 - 26, 2024</span>
            </div>
            <h1 className="text-5xl font-black text-primary tracking-tighter mb-6 leading-none">{cart.tripName}</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/5 rounded-lg text-primary">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Destination</p>
                  <p className="font-bold text-primary">Global Tour</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/5 rounded-lg text-primary">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Duration</p>
                  <p className="font-bold text-primary">12 Days</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/5 rounded-lg text-primary">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Group Size</p>
                  <p className="font-bold text-primary">{client.members.length} Travelers</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-black text-primary uppercase tracking-widest mb-4">Selected Services</h3>
              {cart.items.map((item) => (
                <div key={item.id} className="flex items-center gap-6 p-6 bg-surface-container-lowest rounded-3xl border border-outline-variant/10">
                  <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center text-primary">
                    {item.category === 'flights' && <Plane className="w-7 h-7" />}
                    {item.category === 'hotels' && <Hotel className="w-7 h-7" />}
                    {item.category === 'buses' && <Bus className="w-7 h-7" />}
                    {item.category === 'private' && <Car className="w-7 h-7" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-primary text-lg">{item.title}</h4>
                    <p className="text-on-surface-variant font-medium">{item.subtitle}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-primary">${item.price.toLocaleString()}</p>
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Total</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="lg:col-span-4 space-y-8">
          <section className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/5 sticky top-8">
            <h3 className="text-xl font-black text-primary uppercase tracking-widest mb-6">Your Decision</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant font-medium">Itinerary Total</span>
                <span className="text-3xl font-black text-primary">${cart.items.reduce((acc, i) => acc + i.price, 0).toLocaleString()}</span>
              </div>
              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest leading-relaxed">
                Price includes all taxes, fees, and Voyager Global concierge support.
              </p>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => handleAction('approved')}
                className="w-full py-4 bg-primary text-on-primary rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 flex items-center justify-center gap-3 hover:brightness-110 active:scale-95 transition-all"
              >
                <CheckCircle2 className="w-5 h-5 text-secondary" />
                Approve & Proceed
              </button>
              
              <button 
                onClick={() => handleAction('changes-requested')}
                className="w-full py-4 bg-surface-container-high text-primary rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-surface-container-highest active:scale-95 transition-all"
              >
                <Edit3 className="w-5 h-5" />
                Request Changes
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => handleAction('on-hold')}
                  className="py-4 bg-surface-container-high text-primary rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-surface-container-highest active:scale-95 transition-all"
                >
                  <Clock className="w-4 h-4" />
                  Hold
                </button>
                <button 
                  onClick={() => handleAction('rejected')}
                  className="py-4 bg-error/10 text-error rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-error/20 active:scale-95 transition-all"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-3">Add Note (Optional)</p>
              <textarea 
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Any specific requests or changes?"
                className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20 min-h-[100px]"
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
