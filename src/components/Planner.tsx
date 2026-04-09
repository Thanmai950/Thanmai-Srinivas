import React, { useState, useMemo } from 'react';
import { Plane, Hotel, MapPin, TrendingUp, ArrowRight, X, Bus, UserCheck, ShieldCheck, Car, Coffee, Search, Filter, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useVoyager } from '../VoyagerContext';
import { ItemCategory, PlannerItem as IPlannerItem, TravelType } from '../types';

const globalItems: IPlannerItem[] = [
  // Flights
  { id: 'f1', category: 'flights', title: 'Emirates EK202', subtitle: 'JFK · New York → DXB · Dubai', price: 1850, tag: 'A380 Experience', airline: 'Emirates', stops: 0, duration: '12h 45m', origin: 'New York', destination: 'Dubai' },
  { id: 'f2', category: 'flights', title: 'Lufthansa LH401', subtitle: 'JFK · New York → FRA · Frankfurt', price: 950, tag: 'Business Class', airline: 'Lufthansa', stops: 0, duration: '7h 30m', origin: 'New York', destination: 'Frankfurt' },
  { id: 'f3', category: 'flights', title: 'Singapore SQ25', subtitle: 'FRA · Frankfurt → SIN · Singapore', price: 1100, airline: 'Singapore Airlines', stops: 0, duration: '12h 10m', origin: 'Frankfurt', destination: 'Singapore' },
  { id: 'f4', category: 'flights', title: 'Air France AF007', subtitle: 'JFK · New York → CDG · Paris', price: 820, airline: 'Air France', stops: 0, duration: '7h 15m', origin: 'New York', destination: 'Paris' },
  // Hotels
  { id: 'h1', category: 'hotels', title: 'Burj Al Arab Jumeirah', subtitle: 'Royal Suite · Private Butler', price: 2500, tag: '7-Star Luxury', location: 'Dubai, UAE', rating: 5.0, amenities: ['Pool', 'Spa', 'Gym'] },
  { id: 'h2', category: 'hotels', title: 'Hotel Plaza Athénée', subtitle: 'Eiffel Tower View Suite', price: 1800, location: 'Paris, France', rating: 4.9, amenities: ['Restaurant', 'Spa'] },
  { id: 'h3', category: 'hotels', title: 'Marina Bay Sands', subtitle: 'Sands Premier Room', price: 650, location: 'Singapore', rating: 4.7, amenities: ['Infinity Pool', 'Casino'] },
  // Buses
  { id: 'b1', category: 'buses', title: 'FlixBus Premium', subtitle: 'Paris Bercy → Amsterdam Sloterdijk', price: 45, operator: 'FlixBus', duration: '7h 20m', origin: 'Paris', destination: 'Amsterdam' },
  { id: 'b2', category: 'buses', title: 'Greyhound Express', subtitle: 'New York Port Authority → Washington DC', price: 35, operator: 'Greyhound', duration: '4h 30m', origin: 'New York', destination: 'Washington DC' },
  // Private (Only approved)
  { id: 'p1', category: 'private', title: 'Private Yacht Charter', subtitle: 'Amalfi Coast · Full Day', price: 1200, tag: 'Approved Partner' },
];

const popularCities = ['New York', 'Dubai', 'Paris', 'London', 'Singapore', 'Frankfurt', 'Tokyo', 'Sydney', 'Amsterdam', 'Washington DC'];

export default function Planner() {
  const { clients, draftItems, addToDraft, removeFromDraft, finalizeBooking, totalDraftPrice, saveToClientCart } = useVoyager();
  const [activeCategory, setActiveCategory] = useState<ItemCategory>('flights');
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || '');
  const [tripName, setTripName] = useState('Global Expedition');
  const [travelType, setTravelType] = useState<TravelType>('individual');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState<number>(5000);
  
  // Separate routes for Flights and Buses
  const [flightOrigin, setFlightOrigin] = useState('');
  const [flightDestination, setFlightDestination] = useState('');
  const [busOrigin, setBusOrigin] = useState('');
  const [busDestination, setBusDestination] = useState('');
  
  // Hotel specific
  const [hotelLocation, setHotelLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  // Filters
  const [selectedAirline, setSelectedAirline] = useState<string>('All');
  const [selectedStops, setSelectedStops] = useState<string>('All');
  const [selectedBusType, setSelectedBusType] = useState<string>('All');
  const [selectedRating, setSelectedRating] = useState<number>(0);

  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const selectedClient = clients.find(c => c.id === selectedClientId);
  const passengerCount = selectedClient?.members.length || 1;

  const filteredItems = useMemo(() => {
    return globalItems.filter(item => {
      const matchesCategory = item.category === activeCategory;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesPrice = item.price <= priceFilter;
      
      let matchesRoute = true;
      if (activeCategory === 'flights') {
        if (flightOrigin) matchesRoute = matchesRoute && item.origin?.toLowerCase().includes(flightOrigin.toLowerCase()) || false;
        if (flightDestination) matchesRoute = matchesRoute && item.destination?.toLowerCase().includes(flightDestination.toLowerCase()) || false;
        if (selectedAirline !== 'All') matchesRoute = matchesRoute && item.airline === selectedAirline;
        if (selectedStops !== 'All') matchesRoute = matchesRoute && item.stops === parseInt(selectedStops);
      } else if (activeCategory === 'buses') {
        if (busOrigin) matchesRoute = matchesRoute && item.origin?.toLowerCase().includes(busOrigin.toLowerCase()) || false;
        if (busDestination) matchesRoute = matchesRoute && item.destination?.toLowerCase().includes(busDestination.toLowerCase()) || false;
        if (selectedBusType !== 'All') matchesRoute = matchesRoute && item.busType === selectedBusType;
      } else if (activeCategory === 'hotels') {
        if (hotelLocation) matchesRoute = matchesRoute && item.location?.toLowerCase().includes(hotelLocation.toLowerCase()) || false;
        if (selectedRating > 0) matchesRoute = matchesRoute && (item.rating || 0) >= selectedRating;
      }

      return matchesCategory && matchesSearch && matchesPrice && matchesRoute;
    });
  }, [activeCategory, searchQuery, priceFilter, flightOrigin, flightDestination, busOrigin, busDestination, hotelLocation, selectedAirline, selectedStops, selectedBusType, selectedRating]);

  const handleSearch = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  };

  const handleFinalize = () => {
    if (draftItems.length === 0) {
      alert('Please add items to your itinerary first.');
      return;
    }
    saveToClientCart(selectedClientId, tripName);
  };

  const handleQuickBook = () => {
    if (draftItems.length === 0) {
      alert('Please add items to your itinerary first.');
      return;
    }
    finalizeBooking(selectedClientId, tripName, travelType);
  };

  const handleAddToDraft = (item: IPlannerItem) => {
    if (activeCategory === 'flights' && flightOrigin && flightDestination && flightOrigin.toLowerCase() === flightDestination.toLowerCase()) {
      alert('Origin and Destination cannot be the same.');
      return;
    }
    if (activeCategory === 'buses' && busOrigin && busDestination && busOrigin.toLowerCase() === busDestination.toLowerCase()) {
      alert('Origin and Destination cannot be the same.');
      return;
    }
    addToDraft(item, passengerCount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      <section className="md:col-span-8 flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="font-label text-sm uppercase tracking-widest text-on-surface-variant">Global Builder</span>
            <input 
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              className="text-4xl font-extrabold font-headline tracking-tight text-primary bg-transparent border-none p-0 focus:ring-0 w-full"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-4 bg-surface-container-low p-4 rounded-xl">
              <UserCheck className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Client</p>
                <select 
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="bg-transparent border-none p-0 font-bold text-primary focus:ring-0 w-full cursor-pointer"
                >
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>{client.name} ({client.members.length} pax)</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-surface-container-low p-4 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Travel Type</p>
                <select 
                  value={travelType}
                  onChange={(e) => setTravelType(e.target.value as TravelType)}
                  className="bg-transparent border-none p-0 font-bold text-primary focus:ring-0 w-full cursor-pointer"
                >
                  <option value="individual">Individual</option>
                  <option value="couple">Couple</option>
                  <option value="family">Family</option>
                  <option value="group">Group</option>
                  <option value="friends">Friends</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Route Selection & Filters */}
        <div className="bg-surface-container-low p-6 rounded-2xl flex flex-col gap-6">
          {activeCategory === 'flights' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Flight From</label>
                <div className="relative">
                  <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <input 
                    type="text"
                    placeholder="Origin City/Airport"
                    value={flightOrigin}
                    onChange={(e) => setFlightOrigin(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div className="relative">
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Flight To</label>
                <div className="relative">
                  <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
                  <input 
                    type="text"
                    placeholder="Destination City/Airport"
                    value={flightDestination}
                    onChange={(e) => setFlightDestination(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>
          )}

          {activeCategory === 'buses' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Bus From</label>
                <div className="relative">
                  <Bus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <input 
                    type="text"
                    placeholder="Origin City"
                    value={busOrigin}
                    onChange={(e) => setBusOrigin(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div className="relative">
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Bus To</label>
                <div className="relative">
                  <Bus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
                  <input 
                    type="text"
                    placeholder="Destination City"
                    value={busDestination}
                    onChange={(e) => setBusDestination(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>
          )}

          {activeCategory === 'hotels' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="relative">
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">City / Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <input 
                    type="text"
                    placeholder="Where to stay?"
                    value={hotelLocation}
                    onChange={(e) => setHotelLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div className="relative">
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Check-in</label>
                <input 
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-container-lowest border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="relative">
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Check-out</label>
                <input 
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-container-lowest border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          )}

          {/* Mandatory Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4 border-t border-outline-variant/10">
            {activeCategory === 'flights' && (
              <>
                <div>
                  <label className="block text-[8px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Airline</label>
                  <select 
                    value={selectedAirline}
                    onChange={(e) => setSelectedAirline(e.target.value)}
                    className="w-full bg-surface-container-lowest border-none rounded-lg text-[10px] font-bold focus:ring-1 focus:ring-primary/20"
                  >
                    <option value="All">All Airlines</option>
                    <option value="Emirates">Emirates</option>
                    <option value="Lufthansa">Lufthansa</option>
                    <option value="Singapore Airlines">Singapore Airlines</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[8px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Stops</label>
                  <select 
                    value={selectedStops}
                    onChange={(e) => setSelectedStops(e.target.value)}
                    className="w-full bg-surface-container-lowest border-none rounded-lg text-[10px] font-bold focus:ring-1 focus:ring-primary/20"
                  >
                    <option value="All">Any Stops</option>
                    <option value="0">Non-stop</option>
                    <option value="1">1 Stop</option>
                    <option value="2">2+ Stops</option>
                  </select>
                </div>
              </>
            )}
            {activeCategory === 'buses' && (
              <div>
                <label className="block text-[8px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Bus Type</label>
                <select 
                  value={selectedBusType}
                  onChange={(e) => setSelectedBusType(e.target.value)}
                  className="w-full bg-surface-container-lowest border-none rounded-lg text-[10px] font-bold focus:ring-1 focus:ring-primary/20"
                >
                  <option value="All">All Types</option>
                  <option value="AC">AC</option>
                  <option value="Non-AC">Non-AC</option>
                  <option value="Sleeper">Sleeper</option>
                </select>
              </div>
            )}
            {activeCategory === 'hotels' && (
              <div>
                <label className="block text-[8px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Min Rating</label>
                <select 
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(Number(e.target.value))}
                  className="w-full bg-surface-container-lowest border-none rounded-lg text-[10px] font-bold focus:ring-1 focus:ring-primary/20"
                >
                  <option value="0">Any Rating</option>
                  <option value="3">3+ Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="5">5 Stars</option>
                </select>
              </div>
            )}
            <div className="sm:col-span-2">
              <label className="block text-[8px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Max Price: ${priceFilter}</label>
              <input 
                type="range" 
                min="0" 
                max="5000" 
                step="100"
                value={priceFilter}
                onChange={(e) => setPriceFilter(Number(e.target.value))}
                className="w-full accent-primary h-2 bg-surface-container-lowest rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          <button 
            onClick={handleSearch}
            className="w-full bg-primary text-on-primary font-bold py-3 rounded-xl text-sm uppercase tracking-widest hover:bg-primary-container transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Search className="w-4 h-4" />
                Search Worldwide
              </>
            )}
          </button>
        </div>

        <div className="bg-surface-container-low rounded-xl p-6 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center border-b border-outline-variant/10 pb-4">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {(['flights', 'hotels', 'buses', 'private'] as ItemCategory[]).map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-md font-bold transition-all whitespace-nowrap ${
                    activeCategory === cat ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input 
                type="text"
                placeholder="Global keyword search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {isLoading ? (
              <div className="py-24 flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-sm font-bold text-primary uppercase tracking-widest animate-pulse">Scanning Global Datasets...</p>
              </div>
            ) : filteredItems.length > 0 ? filteredItems.map((item) => (
              <PlannerItem 
                key={item.id}
                item={item}
                onAdd={() => handleAddToDraft(item)}
                passengerCount={passengerCount}
              />
            )) : (
              <div className="py-12 text-center">
                <AlertCircle className="w-12 h-12 text-outline mx-auto mb-4 opacity-20" />
                <p className="text-on-surface-variant italic">No results found for your global search.</p>
                <button 
                  onClick={() => {
                    setFlightOrigin('');
                    setFlightDestination('');
                    setBusOrigin('');
                    setBusDestination('');
                    setHotelLocation('');
                    setSearchQuery('');
                    setPriceFilter(5000);
                  }}
                  className="mt-4 text-primary text-xs font-bold uppercase tracking-widest hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold font-headline text-primary">Draft Itinerary</h3>
            <span className="text-xs font-bold uppercase text-on-surface-variant tracking-widest">{draftItems.length} Items Selected</span>
          </div>
          <div className="relative pl-8">
            <div className="absolute left-[3px] top-4 bottom-4 w-0.5 bg-surface-container-highest" />
            <div className="space-y-6">
              <AnimatePresence initial={false}>
                {draftItems.map((item) => (
                  <DraftItem 
                    key={item.id} 
                    item={item} 
                    onRemove={() => removeFromDraft(item.id)} 
                  />
                ))}
              </AnimatePresence>
              {draftItems.length === 0 && (
                <p className="text-on-surface-variant italic py-4">No items added to draft yet.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <aside className="md:col-span-4 flex flex-col gap-6">
        <div className="sticky top-24">
          <div className="bg-primary text-white p-6 rounded-2xl shadow-xl flex flex-col gap-6 bg-gradient-to-br from-primary to-primary-container">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">Live Estimate</h3>
              <p className="text-4xl font-extrabold font-headline">${totalDraftPrice.toLocaleString()}.00</p>
              <p className="text-xs mt-2 text-white/60 font-medium">Estimated for 2 Travelers · Taxes Included</p>
            </div>
            <div className="space-y-3 py-4 border-y border-white/10">
              <div className="flex justify-between text-sm">
                <span className="opacity-80">Subtotal</span>
                <span className="font-bold">${totalDraftPrice.toLocaleString()}.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="opacity-80">Agency Fee (5%)</span>
                <span className="font-bold">${(totalDraftPrice * 0.05).toLocaleString()}.00</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-white/10">
                <span className="font-bold">Total</span>
                <span className="font-bold">${(totalDraftPrice * 1.05).toLocaleString()}.00</span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleFinalize}
                className="w-full bg-white text-primary font-bold py-3 rounded-lg text-sm uppercase tracking-wider hover:bg-surface-bright transition-all active:scale-95 shadow-md"
              >
                Save to Client Cart
              </button>
              <button 
                onClick={handleQuickBook}
                className="w-full bg-white/10 border border-white/20 text-white font-bold py-3 rounded-lg text-sm uppercase tracking-wider hover:bg-white/20 transition-all"
              >
                Quick Book Now
              </button>
            </div>
          </div>

          <div className="mt-6 bg-surface-container-low rounded-xl p-6 flex flex-col gap-4">
            <h4 className="font-bold font-headline text-primary">Destination Insights</h4>
            <div className="aspect-video rounded-lg overflow-hidden relative">
              <img 
                src="https://picsum.photos/seed/shinjuku/800/600" 
                alt="Tokyo" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <p className="text-white text-sm font-bold flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Tokyo, JP · 18°C Sunny
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-xs font-bold text-primary uppercase">Market Trend</p>
                <p className="text-sm text-on-surface-variant">Prices are 12% lower than usual for April bookings.</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function PlannerItem({ item, onAdd, passengerCount }: any) {
  const getIcon = () => {
    switch (item.category) {
      case 'flights': return <Plane className="w-5 h-5 text-on-secondary-container" />;
      case 'hotels': return <Hotel className="w-5 h-5 text-on-tertiary-container" />;
      case 'buses': return <Bus className="w-5 h-5 text-on-primary-container" />;
      case 'private': return <Car className="w-5 h-5 text-secondary" />;
      default: return <Coffee className="w-5 h-5" />;
    }
  };

  const getIconBg = () => {
    switch (item.category) {
      case 'flights': return 'bg-secondary-container';
      case 'hotels': return 'bg-tertiary-container';
      case 'buses': return 'bg-primary-container';
      case 'private': return 'bg-surface-container-highest';
      default: return 'bg-surface-container';
    }
  };

  return (
    <div className="bg-surface-container-lowest p-5 rounded-xl flex items-center gap-6 group hover:shadow-lg transition-all duration-300 border border-outline-variant/5">
      <div className={`flex flex-col items-center justify-center p-3 ${getIconBg()} rounded-lg`}>
        {getIcon()}
      </div>
      <div className="flex-1">
        {item.tag && <span className="text-[10px] font-bold text-white bg-tertiary px-2 py-0.5 rounded uppercase mb-1 inline-block">{item.tag}</span>}
        <h3 className="text-lg font-bold font-headline">{item.title}</h3>
        <p className="text-sm text-on-surface-variant">{item.subtitle}</p>
      </div>
      <div className="flex flex-col items-end gap-2 border-l border-outline-variant/20 pl-6">
        <div className="text-right">
          <span className="text-xl font-extrabold text-primary">${(item.price * passengerCount).toLocaleString()}</span>
          <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">${item.price}/person</p>
        </div>
        <button 
          onClick={onAdd}
          className="px-4 py-1.5 bg-primary text-white rounded-md text-xs font-bold uppercase tracking-wider active:scale-95 transition-transform"
        >
          Add to Draft
        </button>
      </div>
    </div>
  );
}

function DraftItem({ item, onRemove }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="relative"
    >
      <div className="absolute -left-[33px] top-1.5 w-4 h-4 rounded-full bg-secondary border-4 border-surface" />
      <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/10 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-center w-12">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase">{item.date.split(' ')[0]}</p>
            <p className="text-lg font-bold leading-tight">{item.date.split(' ')[1]}</p>
          </div>
          <div>
            <p className="text-sm font-bold">{item.title}</p>
            <p className="text-xs text-on-surface-variant">{item.subtitle}</p>
            <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">
              {item.passengerCount} Passenger{item.passengerCount > 1 ? 's' : ''} · ${item.perPersonPrice}/ea
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold">${item.price.toLocaleString()}</span>
          <button 
            onClick={onRemove}
            className="text-on-surface-variant hover:text-error transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
