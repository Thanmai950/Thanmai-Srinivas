import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, ShieldCheck, MapPin, Calendar, Users, ArrowLeft, CheckCircle2, Plane, Hotel, Bus, Car } from 'lucide-react';
import { useVoyager } from '../VoyagerContext';

export default function Checkout() {
  const { clients, clientCarts, setCurrentView, finalizeBooking, selectedClientId } = useVoyager();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);

  const cart = clientCarts.find(c => c.clientId === selectedClientId);
  const client = clients.find(c => c.id === selectedClientId);

  if (!client || !cart) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Checkout Unavailable</h2>
        <p className="text-on-surface-variant mb-8">Please ensure a client is selected and their cart is approved.</p>
        <button onClick={() => setCurrentView('cart')} className="px-8 py-3 bg-primary text-on-primary rounded-xl font-bold">Return to Cart</button>
      </div>
    );
  }

  const subtotal = cart.items.reduce((acc, i) => acc + i.price, 0);
  const taxes = subtotal * 0.12;
  const total = subtotal + taxes;

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        finalizeBooking(client.id, cart.tripName, 'individual', isScheduled ? scheduledDate : undefined);
      }, 2000);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center mb-8"
        >
          <CheckCircle2 className="w-12 h-12" />
        </motion.div>
        <h2 className="text-4xl font-extrabold text-primary mb-4 tracking-tight">
          {isScheduled ? 'Booking Scheduled!' : 'Booking Confirmed!'}
        </h2>
        <p className="text-on-surface-variant text-lg max-w-md">
          {isScheduled 
            ? `Your global expedition is scheduled for ${new Date(scheduledDate).toLocaleDateString()}. Redirecting...`
            : 'Your global expedition has been finalized. Redirecting to your bookings...'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <button 
        onClick={() => setCurrentView('cart')}
        className="flex items-center gap-2 text-on-surface-variant font-bold uppercase tracking-widest text-xs hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Cart
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Client & Itinerary */}
        <div className="lg:col-span-7 space-y-8">
          <section className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant/5">
            <h3 className="font-headline text-2xl font-bold text-primary mb-6">Client Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Full Name</p>
                <p className="font-bold text-primary">{client.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Membership ID</p>
                <p className="font-bold text-primary">{client.membershipId}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Email Address</p>
                <p className="font-bold text-primary">{client.email || 'client@voyager.com'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Phone Number</p>
                <p className="font-bold text-primary">{client.phone || '+1 (555) 000-0000'}</p>
              </div>
            </div>
          </section>

          <section className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant/5">
            <h3 className="font-headline text-2xl font-bold text-primary mb-6">Schedule Booking</h3>
            <div className="flex flex-col gap-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={isScheduled}
                  onChange={(e) => setIsScheduled(e.target.checked)}
                  className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary"
                />
                <span className="text-sm font-bold text-primary uppercase tracking-widest">Schedule for future date</span>
              </label>
              
              <AnimatePresence>
                {isScheduled && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/10">
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Select Activation Date</p>
                      <input 
                        type="date" 
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="w-full bg-transparent border-none p-0 font-bold text-primary focus:ring-0"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>

          <section className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant/5">
            <h3 className="font-headline text-2xl font-bold text-primary mb-6">Full Itinerary</h3>
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.id} className="flex items-center gap-6 p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/5">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-primary">
                    {item.category === 'flights' && <Plane className="w-5 h-5" />}
                    {item.category === 'hotels' && <Hotel className="w-5 h-5" />}
                    {item.category === 'buses' && <Bus className="w-5 h-5" />}
                    {item.category === 'private' && <Car className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-primary text-sm">{item.title}</h4>
                    <p className="text-xs text-on-surface-variant">{item.subtitle}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">${item.price.toLocaleString()}</p>
                    <p className="text-[10px] text-on-surface-variant font-bold">{item.passengerCount} Pax</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right: Payment & Summary */}
        <div className="lg:col-span-5 space-y-8">
          <section className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant/5">
            <h3 className="font-headline text-2xl font-bold text-primary mb-6">Payment Summary</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Itinerary Subtotal</span>
                <span className="font-bold text-primary">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Global Service Tax (12%)</span>
                <span className="font-bold text-primary">${taxes.toLocaleString()}</span>
              </div>
              <div className="pt-4 border-t border-outline-variant/10 flex justify-between items-center">
                <span className="font-black text-primary uppercase tracking-widest text-xs">Total Investment</span>
                <span className="text-3xl font-black text-primary">${total.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 flex items-center gap-4">
                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-primary uppercase tracking-widest">Payment Method</p>
                  <p className="text-sm font-medium text-on-surface-variant">Agency Credit Line · **** 9921</p>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={isProcessing || (isScheduled && !scheduledDate)}
                className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl transition-all flex items-center justify-center gap-3 ${
                  isProcessing || (isScheduled && !scheduledDate) ? 'bg-surface-container-highest text-outline cursor-not-allowed' : 'bg-primary text-on-primary hover:brightness-110 active:scale-95 shadow-primary/20'
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-outline border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    {isScheduled ? 'Schedule Booking' : 'Confirm & Book Now'}
                  </>
                )}
              </button>
            </div>

            <p className="text-[10px] text-center text-on-surface-variant mt-6 font-medium leading-relaxed">
              By confirming, you agree to the Voyager Global Terms of Service and the specific cancellation policies of each service provider.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
