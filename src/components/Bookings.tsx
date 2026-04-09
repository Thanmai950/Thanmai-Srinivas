import React, { useState } from 'react';
import { Plane, Share2, MapPin, Headset, ChevronRight, QrCode, Hotel, Car, Info, ClipboardList, Bus, Coffee, Trash2, Calendar, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useVoyager } from '../VoyagerContext';
import { Booking } from '../types';

export default function Bookings() {
  const { bookings, deleteBooking, updateBooking } = useVoyager();
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(bookings[0]?.id || null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);
  const [bookingToSchedule, setBookingToSchedule] = useState<Booking | null>(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center mb-6">
          <ClipboardList className="w-10 h-10 text-outline" />
        </div>
        <h2 className="text-2xl font-bold text-primary mb-2">No Bookings Yet</h2>
        <p className="text-on-surface-variant max-w-md">Finalize an itinerary in the Planner to see your confirmed bookings here.</p>
      </div>
    );
  }

  const booking = bookings.find(b => b.id === selectedBookingId) || bookings[0];

  const handleDelete = () => {
    if (bookingToDelete) {
      deleteBooking(bookingToDelete.id);
      setIsDeleteModalOpen(false);
      setBookingToDelete(null);
      setSuccess('Booking deleted successfully.');
      setTimeout(() => setSuccess(''), 3000);
      if (selectedBookingId === bookingToDelete.id) {
        setSelectedBookingId(bookings.find(b => b.id !== bookingToDelete.id)?.id || null);
      }
    }
  };

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!scheduleDate || !scheduleTime) {
      setError('Please provide both date and time.');
      return;
    }

    const selectedDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
    const now = new Date();

    if (selectedDateTime < now) {
      setError('Cannot schedule a booking in the past.');
      return;
    }

    if (bookingToSchedule) {
      updateBooking(bookingToSchedule.id, { 
        scheduledAt: selectedDateTime.toLocaleString(),
        status: 'confirmed'
      });
      setIsScheduleModalOpen(false);
      setBookingToSchedule(null);
      setScheduleDate('');
      setScheduleTime('');
      setSuccess('Booking scheduled successfully.');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Feedback Messages */}
      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[110] bg-success text-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-bold">{success}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bookings Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 flex-1">
          {bookings.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBookingId(b.id)}
              className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all ${
                booking.id === b.id ? 'bg-primary text-on-primary shadow-lg' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {b.tripName}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => {
              setBookingToSchedule(booking);
              setIsScheduleModalOpen(true);
            }}
            className="p-3 bg-surface-container-high text-primary rounded-xl hover:bg-surface-container-highest transition-all"
            title="Schedule Booking"
          >
            <Calendar className="w-5 h-5" />
          </button>
          <button 
            onClick={() => {
              setBookingToDelete(booking);
              setIsDeleteModalOpen(true);
            }}
            className="p-3 bg-error/10 text-error rounded-xl hover:bg-error/20 transition-all"
            title="Delete Booking"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative bg-surface-container-lowest w-full max-w-md rounded-2xl p-8 shadow-2xl">
              <h3 className="font-headline text-2xl font-bold text-primary mb-2">Delete Booking?</h3>
              <p className="text-on-surface-variant mb-6">Are you sure you want to delete <span className="font-bold text-primary">"{bookingToDelete?.tripName}"</span>? This action cannot be undone.</p>
              <div className="flex gap-4">
                <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 bg-surface-container-high rounded-xl font-bold">Cancel</button>
                <button onClick={handleDelete} className="flex-1 py-3 bg-error text-white rounded-xl font-bold shadow-lg shadow-error/20">Confirm Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Schedule Modal */}
      <AnimatePresence>
        {isScheduleModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsScheduleModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="relative bg-surface-container-lowest w-full max-w-md rounded-2xl p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-headline text-2xl font-bold text-primary">Schedule Booking</h3>
                <button onClick={() => setIsScheduleModalOpen(false)} className="p-2 hover:bg-surface-container-high rounded-full"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleSchedule} className="space-y-6">
                {error && (
                  <div className="bg-error/10 text-error p-3 rounded-lg flex items-center gap-2 text-sm font-bold">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wider">Departure Date</label>
                  <input 
                    type="date" 
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wider">Departure Time</label>
                  <input 
                    type="time" 
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <button type="submit" className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold shadow-lg">
                  Confirm Schedule
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-secondary-container text-on-secondary-container px-4 py-1 rounded-full text-xs font-bold font-label uppercase tracking-widest">
              {booking.status === 'confirmed' ? 'Booking Confirmed' : 'Booking Pending'}
            </span>
            <span className="text-tertiary font-label text-sm font-medium">Ref: {booking.id}</span>
          </div>
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-2">{booking.tripName}</h1>
          <p className="font-label text-on-surface-variant text-lg">
            Trip for {booking.clientName} • {booking.items.length} Items • {booking.travelType.toUpperCase()}
          </p>
          {booking.scheduledAt && (
            <div className="flex items-center gap-2 mt-4 text-secondary font-bold">
              <Calendar className="w-5 h-5" />
              <span>Scheduled for: {booking.scheduledAt}</span>
            </div>
          )}
        </div>
        <button className="flex items-center justify-center gap-2 bg-primary text-on-primary px-8 py-4 rounded-xl font-headline font-bold shadow-lg active:scale-95 transition-all">
          <Share2 className="w-5 h-5" />
          Share with Client
        </button>
      </section>

      {/* Passenger List */}
      <section className="bg-surface-container-low p-8 rounded-3xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-headline text-2xl font-bold text-primary">Passenger Manifest</h3>
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{booking.passengers.length} Total</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {booking.passengers.map((p) => (
            <div key={p.id} className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {p.name.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-primary text-sm">{p.name}</p>
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">{p.role} · {p.age}y · {p.gender}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Itinerary */}
        <div className="lg:col-span-8 space-y-12">
          {/* Items List */}
          <div className="space-y-6">
            <h2 className="font-headline text-2xl font-bold text-primary mb-4 px-2">Confirmed Services</h2>
            {booking.items.map((item) => (
              <div key={item.id} className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/5 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <ItemIcon title={item.title} />
                    <h2 className="font-headline text-2xl font-bold text-primary">{item.title}</h2>
                  </div>
                  <span className="font-label text-xs font-semibold bg-surface-container-high px-3 py-1 rounded-full text-on-surface-variant uppercase tracking-wider">
                    Confirmed
                  </span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative">
                  <div className="text-center md:text-left">
                    <p className="font-headline text-lg font-bold text-primary">{item.subtitle}</p>
                    <p className="text-sm font-label text-on-surface-variant">Scheduled for {item.date}</p>
                    <p className="text-[10px] text-secondary font-bold uppercase tracking-widest mt-1">
                      {item.passengerCount} Passengers · ${item.perPersonPrice}/ea
                    </p>
                  </div>
                  <div className="text-center md:text-right">
                    <p className="font-headline text-2xl font-bold text-primary">${item.price.toLocaleString()}.00</p>
                    <p className="text-sm font-label text-on-surface-variant">Total Amount</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Daily Itinerary Timeline (Mock) */}
          <div className="space-y-0">
            <h2 className="font-headline text-2xl font-bold text-primary mb-8 px-2">Daily Itinerary</h2>
            <TimelineDay 
              day={1} 
              date="Monday, Sept 14" 
              title="Arrival & Private Transfer"
              description="Upon arrival, meet your driver at the arrival hall for a private transfer to your hotel. Afternoon at leisure to explore the district."
              tags={['Private Executive Van', 'Luxury Hotel (5★)']}
              active
            />
            <TimelineDay 
              day={2} 
              date="Tuesday, Sept 15" 
              title="City Art & Architecture Tour"
              description="A 4-hour private walking tour focused on the city's modern transformation. Highlights include museum visits and architectural landmarks."
              image="https://picsum.photos/seed/city/800/400"
              guide="Erik Johansen (Confirmed)"
            />
          </div>
        </div>

        {/* Right Column: Vouchers & Summary */}
        <div className="lg:col-span-4 space-y-8">
          {/* Service Voucher */}
          <div className="bg-primary text-on-primary rounded-xl overflow-hidden shadow-xl">
            <div className="p-1 bg-gradient-to-r from-secondary-container to-secondary" />
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-[10px] font-label font-bold text-white/60 uppercase tracking-widest mb-1">Service Voucher</p>
                  <h3 className="font-headline text-xl font-bold">{booking.tripName}</h3>
                </div>
                <QrCode className="w-8 h-8" />
              </div>
              <div className="space-y-4 mb-8">
                <VoucherRow label="Client" value={booking.clientName} />
                <VoucherRow label="Reference" value={booking.id} />
                <VoucherRow label="Total Value" value={`$${booking.totalAmount.toLocaleString()}`} />
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-xs leading-relaxed italic flex gap-3">
                <Info className="w-4 h-4 flex-shrink-0" />
                Present this digital voucher to your service providers. 24/7 support is available via the concierge.
              </div>
            </div>
          </div>

          {/* Investment Summary */}
          <div className="bg-surface-container rounded-xl p-6">
            <h4 className="font-headline font-bold text-primary mb-4">Investment Summary</h4>
            <div className="space-y-3">
              <SummaryRow label="Total Services" value={`$${booking.totalAmount.toLocaleString()}.00`} />
              <SummaryRow label="Agency Fee (5%)" value={`$${(booking.totalAmount * 0.05).toLocaleString()}.00`} />
              <div className="pt-4 mt-4 border-t border-outline-variant/30 flex justify-between items-center">
                <span className="font-headline font-bold text-primary">Total Amount</span>
                <span className="font-headline text-xl font-extrabold text-primary">${(booking.totalAmount * 1.05).toLocaleString()}.00</span>
              </div>
            </div>
          </div>

          {/* Support Card */}
          <div className="bg-secondary-container/30 rounded-xl p-6 border border-secondary-container">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white rounded-lg">
                <Headset className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h4 className="font-headline font-bold text-on-secondary-container">24/7 Concierge</h4>
                <p className="text-xs text-on-secondary-container/80 mt-1">Contact your dedicated agent anytime during your journey.</p>
                <button className="mt-4 text-xs font-bold uppercase tracking-widest text-secondary flex items-center gap-1">
                  Open Chat
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ItemIcon({ title }: { title: string }) {
  const t = title.toLowerCase();
  if (t.includes('flight') || t.includes('jal') || t.includes('ana')) return <Plane className="w-8 h-8 text-primary" />;
  if (t.includes('hotel') || t.includes('aman') || t.includes('ritz')) return <Hotel className="w-8 h-8 text-primary" />;
  if (t.includes('bus')) return <Bus className="w-8 h-8 text-primary" />;
  if (t.includes('transfer') || t.includes('private') || t.includes('car')) return <Car className="w-8 h-8 text-primary" />;
  return <Coffee className="w-8 h-8 text-primary" />;
}

function TimelineDay({ day, date, title, description, tags, image, guide, active }: any) {
  return (
    <div className="relative pl-12 pb-12 last:pb-0">
      <div className="absolute left-[7px] top-0 bottom-0 w-[2px] bg-surface-container-highest" />
      <div className={`absolute left-0 top-0 w-4 h-4 rounded-full border-4 border-surface ${active ? 'bg-secondary ring-4 ring-secondary/20' : 'bg-surface-container-highest'}`} />
      <div className="space-y-4">
        <div className="flex items-baseline gap-4">
          <span className="font-headline text-xl font-extrabold text-primary">Day {day}</span>
          <span className="text-on-surface-variant font-label text-sm">{date}</span>
        </div>
        <div className="bg-surface-container-low rounded-xl p-6 hover:translate-x-1 transition-transform border border-outline-variant/5">
          {image && <img src={image} alt={title} className="rounded-lg object-cover h-40 w-full mb-4" referrerPolicy="no-referrer" />}
          <h3 className="font-headline font-bold text-lg mb-2">{title}</h3>
          <p className="text-on-surface-variant leading-relaxed mb-4">{description}</p>
          {tags && (
            <div className="flex flex-wrap gap-3">
              {tags.map((tag: string, i: number) => (
                <div key={i} className="flex items-center gap-2 bg-surface-container-lowest px-3 py-1.5 rounded-lg border border-outline-variant/10">
                  <span className="text-xs font-bold font-label">{tag}</span>
                </div>
              ))}
            </div>
          )}
          {guide && (
            <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-widest">
              <Headset className="w-4 h-4" />
              Guide: {guide}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function VoucherRow({ label, value }: any) {
  return (
    <div className="flex justify-between border-b border-white/10 pb-2">
      <span className="text-sm font-label text-white/70">{label}</span>
      <span className="text-sm font-bold">{value}</span>
    </div>
  );
}

function SummaryRow({ label, value }: any) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-on-surface-variant">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
