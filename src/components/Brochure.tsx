import React from 'react';
import { motion } from 'motion/react';
import { Download, Printer, Share2, MapPin, Calendar, Users, Plane, Hotel, Bus, Car, ArrowLeft, Award, Globe } from 'lucide-react';
import { useVoyager } from '../VoyagerContext';

export default function Brochure() {
  const { clients, clientCarts, setCurrentView, selectedClientId } = useVoyager();

  const cart = clientCarts.find(c => c.clientId === selectedClientId);
  const client = clients.find(c => c.id === selectedClientId);

  if (!client || !cart) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Brochure Unavailable</h2>
        <p className="text-on-surface-variant mb-8">Please build a cart for a client first.</p>
        <button onClick={() => setCurrentView('cart')} className="px-8 py-3 bg-primary text-on-primary rounded-xl font-bold">Return to Cart</button>
      </div>
    );
  }

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between no-print">
        <button 
          onClick={() => setCurrentView('cart')}
          className="flex items-center gap-2 text-on-surface-variant font-bold uppercase tracking-widest text-xs hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </button>
        <div className="flex gap-4">
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-on-primary rounded-xl font-bold shadow-lg active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
          <button className="p-2 bg-surface-container-high rounded-xl text-primary hover:bg-surface-container-highest transition-all">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Brochure Content */}
      <div id="brochure-content" className="bg-white text-primary shadow-2xl rounded-[2rem] overflow-hidden print:shadow-none print:rounded-none">
        {/* Cover Page */}
        <div className="relative h-[600px] overflow-hidden">
          <img 
            src="https://picsum.photos/seed/travel/1920/1080" 
            alt="Cover" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-16 w-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <span className="text-white font-black uppercase tracking-[0.3em] text-sm">Voyager Global Expedition</span>
            </div>
            <h1 className="text-7xl font-black text-white tracking-tighter mb-4 leading-none">{cart.tripName}</h1>
            <div className="flex flex-wrap gap-8 text-white/90">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-secondary" />
                <span className="font-bold text-lg">Global Destinations</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-secondary" />
                <span className="font-bold text-lg">Sept 14 - 26, 2024</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-secondary" />
                <span className="font-bold text-lg">Prepared for {client.name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Itinerary Section */}
        <div className="p-16 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-8 space-y-12">
              <div>
                <h2 className="text-4xl font-black mb-8 border-b-4 border-secondary inline-block pb-2">Your Bespoke Journey</h2>
                <div className="space-y-8">
                  {cart.items.map((item, index) => (
                    <div key={item.id} className="relative pl-12">
                      <div className="absolute left-0 top-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-black text-sm">
                        {index + 1}
                      </div>
                      <div className="flex gap-8">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                          <p className="text-on-surface-variant text-lg mb-4">{item.subtitle}</p>
                          <div className="flex gap-4">
                            <span className="px-3 py-1 bg-surface-container-high rounded-full text-xs font-bold uppercase tracking-widest">
                              {item.category}
                            </span>
                            <span className="px-3 py-1 bg-surface-container-high rounded-full text-xs font-bold uppercase tracking-widest">
                              Confirmed
                            </span>
                          </div>
                        </div>
                        <div className="w-32 h-32 rounded-2xl overflow-hidden bg-surface-container-high flex-shrink-0">
                          <img 
                            src={`https://picsum.photos/seed/${item.id}/200/200`} 
                            alt={item.title} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-12">
              <div className="bg-surface-container-low p-8 rounded-[2rem] border border-outline-variant/10">
                <h3 className="text-xl font-black mb-6 uppercase tracking-widest">Investment</h3>
                <div className="space-y-4 mb-8">
                  {cart.items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-on-surface-variant font-medium">{item.title}</span>
                      <span className="font-bold">${item.price.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-outline-variant/20 flex justify-between items-center">
                    <span className="font-black uppercase text-xs tracking-widest">Total Value</span>
                    <span className="text-3xl font-black">${cart.items.reduce((acc, i) => acc + i.price, 0).toLocaleString()}</span>
                  </div>
                </div>
                <div className="p-4 bg-primary text-white rounded-2xl flex items-center gap-4">
                  <Award className="w-6 h-6 text-secondary" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Elite Status</p>
                    <p className="text-xs font-bold">All-inclusive VIP Package</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-black mb-4 uppercase tracking-widest">Contact Us</h3>
                <div className="space-y-2">
                  <p className="font-bold">Voyager Global Concierge</p>
                  <p className="text-on-surface-variant">1200 Avenue of the Americas</p>
                  <p className="text-on-surface-variant">New York, NY 10036</p>
                  <p className="text-primary font-bold mt-4">+1 (800) VOYAGER</p>
                  <p className="text-on-surface-variant">concierge@voyager.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-16 border-t border-outline-variant/10 text-center">
            <p className="text-sm text-on-surface-variant font-medium italic">
              "The world is a book and those who do not travel read only one page."
            </p>
            <div className="mt-8 flex justify-center gap-12 opacity-30 grayscale">
              <Globe className="w-12 h-12" />
              <Award className="w-12 h-12" />
              <Globe className="w-12 h-12" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
