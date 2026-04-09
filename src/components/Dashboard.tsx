import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Calendar, Plus, Plane, Ship, MessageSquare, MoreHorizontal, ArrowRight, Star, MapPin, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useVoyager } from '../VoyagerContext';
import { TravelType } from '../types';

export default function Dashboard() {
  const { setCurrentView, packages } = useVoyager();
  const [packageFilter, setPackageFilter] = useState<TravelType | 'all'>('all');

  const filteredPackages = useMemo(() => {
    if (packageFilter === 'all') return packages;
    return packages.filter(p => p.type === packageFilter);
  }, [packages, packageFilter]);

  const handleNewBooking = () => {
    setCurrentView('planner');
  };

  const handleSchedule = () => {
    setCurrentView('bookings');
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="font-label text-sm uppercase tracking-widest text-on-surface-variant">March 2024</span>
          <h2 className="font-headline text-4xl font-extrabold tracking-tight text-primary mt-1">Welcome back, Alex.</h2>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleSchedule}
            className="bg-surface-container-high px-4 py-2 rounded-xl text-primary font-semibold text-sm hover:bg-surface-container-highest transition-all flex items-center gap-2"
          >
            <Calendar className="w-5 h-5" />
            Schedule
          </button>
          <button 
            onClick={handleNewBooking}
            className="bg-primary text-on-primary px-6 py-2 rounded-xl font-semibold text-sm hover:brightness-110 transition-all shadow-lg shadow-primary/10 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Booking
          </button>
        </div>
      </section>

      {/* Travel Packages Section */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h3 className="font-headline text-2xl font-bold text-primary">Curated Packages</h3>
            <span className="bg-tertiary/10 text-tertiary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Global Offers</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <Filter className="w-4 h-4 text-on-surface-variant flex-shrink-0" />
            {(['all', 'individual', 'couple', 'family', 'group', 'friends'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setPackageFilter(type)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  packageFilter === type ? 'bg-primary text-white shadow-md' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredPackages.map((pkg) => (
              <motion.div
                key={pkg.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group border border-outline-variant/5"
              >
                <div className="h-48 relative overflow-hidden">
                  <img 
                    src={pkg.image} 
                    alt={pkg.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 text-secondary fill-secondary" />
                    <span className="text-[10px] font-bold">{pkg.rating}</span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                      {pkg.type}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-1 text-on-surface-variant mb-1">
                    <MapPin className="w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{pkg.destination}</span>
                  </div>
                  <h4 className="font-headline font-bold text-lg text-primary mb-2 line-clamp-1">{pkg.name}</h4>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-outline-variant/10">
                    <div>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Starting from</p>
                      <p className="text-xl font-black text-primary">${pkg.price.toLocaleString()}</p>
                    </div>
                    <button 
                      onClick={() => setCurrentView('planner')}
                      className="w-10 h-10 bg-surface-container-high rounded-xl flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Column 1: Performance & Metrics */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/10 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-headline text-xl font-bold text-primary">Monthly Performance</h3>
                <p className="font-label text-on-surface-variant text-sm">Revenue growth & booking volume</p>
              </div>
              <div className="bg-surface-container-low p-1 rounded-lg flex">
                <button className="px-3 py-1 text-xs font-semibold bg-surface-container-lowest rounded shadow-sm text-primary">Sales</button>
                <button className="px-3 py-1 text-xs font-semibold text-on-surface-variant">Volume</button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              {[
                { label: 'Total Sales', value: '$142,850', trend: '+12%', up: true },
                { label: 'Active Bookings', value: '38', trend: '5 new', up: true },
                { label: 'Conversion', value: '18.4%', trend: '-2%', up: false },
              ].map((metric, i) => (
                <div key={i} className="bg-surface-container-low p-6 rounded-xl">
                  <p className="text-on-surface-variant text-sm font-medium mb-1">{metric.label}</p>
                  <h4 className="text-2xl font-extrabold text-primary">{metric.value}</h4>
                  <div className={`flex items-center gap-1 text-xs mt-2 font-bold ${metric.up ? 'text-secondary' : 'text-error'}`}>
                    {metric.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {metric.trend} vs last month
                  </div>
                </div>
              ))}
            </div>

            {/* Stylized Chart */}
            <div className="h-48 w-full flex items-end justify-between gap-2 px-4">
              {[40, 55, 45, 70, 60, 85, 100].map((height, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  className={`w-full rounded-t-lg transition-all ${
                    i === 6 ? 'bg-primary' : 'bg-primary/10 hover:bg-primary/20'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-headline text-xl font-bold text-primary">Upcoming Departures</h3>
              <button className="text-primary font-semibold text-sm hover:underline underline-offset-4">View All Schedule</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DepartureCard 
                type="flight"
                code="LX241"
                client="Bernhard Family"
                time="08:45 AM"
                route="SFO → NRT"
                icon={<Plane className="w-5 h-5" />}
              />
              <DepartureCard 
                type="cruise"
                code="Horizon"
                client="Sarah Jenkins"
                time="12:30 PM"
                route="MIA Port"
                icon={<Ship className="w-5 h-5" />}
              />
            </div>
          </div>
        </div>

        {/* Column 2: Inquiries & Actions */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="bg-surface-container-low rounded-xl p-6 flex flex-col h-full border border-outline-variant/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-headline text-lg font-bold text-primary">Pending Inquiries</h3>
              <span className="bg-error-container text-on-error-container px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">4 Urgent</span>
            </div>
            <div className="flex flex-col gap-4 overflow-y-auto no-scrollbar">
              <InquiryItem name="James Wilson" trip="Maldives Luxury Retreat • 10d" time="2h ago" />
              <InquiryItem name="Elena Rodriguez" trip="Swiss Alps Ski Package" time="5h ago" />
              <InquiryItem name="Marco Polo Group" trip="Italy Wine Tour • Corporate" time="Overdue" urgent />
            </div>
            <button className="mt-auto pt-6 text-center text-sm font-bold text-primary/60 hover:text-primary transition-colors uppercase tracking-widest">
              Open Inquiry Manager
            </button>
          </div>

          <div className="relative h-64 rounded-xl overflow-hidden group">
            <img 
              src="https://picsum.photos/seed/tokyo/800/600" 
              alt="Tokyo" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent" />
            <div className="absolute bottom-0 p-6">
              <span className="text-[10px] font-bold text-secondary-container uppercase tracking-[0.2em]">New Commission Pack</span>
              <h4 className="text-white font-headline text-xl font-bold mt-1">Tokyo After Dark</h4>
              <p className="text-white/70 text-sm mt-2">15% commission on all boutique hotels in Shibuya & Ginza.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DepartureCard({ type, code, client, time, route, icon }: any) {
  return (
    <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10 hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full w-fit uppercase tracking-wider">
            {type} • {code}
          </span>
          <span className="font-headline font-bold text-lg text-primary mt-1">{client}</span>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Departs</p>
          <p className="text-sm font-extrabold text-primary">{time}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 py-3 border-y border-outline-variant/5">
        <div className="text-on-surface-variant">{icon}</div>
        <div className="flex-1 h-px bg-surface-container-highest relative">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-secondary" />
        </div>
        <span className="text-sm font-bold text-primary tracking-tight">{route}</span>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div className="flex -space-x-2">
          <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
          <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-300" />
        </div>
        <button className="text-primary text-xs font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform flex items-center gap-1">
          Check Status <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

function InquiryItem({ name, trip, time, urgent }: any) {
  return (
    <div className="bg-surface-container-lowest p-4 rounded-xl flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold text-primary text-sm">{name}</p>
          <p className="text-xs text-on-surface-variant">{trip}</p>
        </div>
        <p className={`text-[10px] font-bold ${urgent ? 'text-error' : 'text-on-surface-variant opacity-60'}`}>{time}</p>
      </div>
      <div className="flex gap-2">
        <button className={`flex-1 py-2 rounded-lg text-xs font-semibold ${urgent ? 'bg-error text-on-error' : 'bg-primary text-on-primary'}`}>
          {urgent ? 'Rush Reply' : 'Reply'}
        </button>
        <button className="px-3 bg-surface-container-high text-primary py-2 rounded-lg text-xs font-semibold">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
