import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { Client, Booking, DraftItem, View, PlannerItem, TravelType, ClientCategory, TravelPackage, Inquiry, ClientCart, InquiryStatus, CartStatus } from './types';

interface VoyagerContextType {
  currentView: View;
  setCurrentView: (view: View) => void;
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'lastBooking'>) => void;
  draftItems: DraftItem[];
  addToDraft: (item: PlannerItem, passengerCount?: number) => void;
  removeFromDraft: (id: string) => void;
  bookings: Booking[];
  deleteBooking: (id: string) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  finalizeBooking: (clientId: string, tripName: string, travelType: TravelType, scheduledDate?: string) => void;
  totalDraftPrice: number;
  packages: TravelPackage[];
  inquiries: Inquiry[];
  updateInquiryStatus: (id: string, status: InquiryStatus) => void;
  addMessage: (inquiryId: string, text: string, sender: 'admin' | 'bot' | 'client') => void;
  clientCarts: ClientCart[];
  saveToClientCart: (clientId: string, tripName: string) => void;
  updateCartStatus: (clientId: string, status: CartStatus) => void;
  selectedClientId: string;
  setSelectedClientId: (id: string) => void;
  supportTickets: SupportTicket[];
  addSupportTicket: (clientId: string, subject: string) => void;
  addSupportMessage: (ticketId: string, text: string, sender: 'admin' | 'client') => void;
}

const VoyagerContext = createContext<VoyagerContextType | undefined>(undefined);

const initialClients: Client[] = [
  { 
    id: '1', 
    name: 'Marcus Thorne', 
    membershipId: '#VG-88921', 
    lastBooking: 'Oct 24, 2023', 
    status: 'frequent', 
    avatar: 'https://picsum.photos/seed/marcus/100/100', 
    category: 'single',
    email: 'marcus.thorne@example.com',
    phone: '+1 (555) 123-4567',
    members: [{ id: 'm1', name: 'Marcus Thorne', gender: 'Male', age: 34, role: 'Self' }]
  },
  { 
    id: '2', 
    name: 'Elena & Sofia', 
    membershipId: '#VG-44210', 
    lastBooking: 'Nov 02, 2023', 
    status: 'active', 
    avatar: 'https://picsum.photos/seed/elena/100/100', 
    category: 'couple',
    email: 'elena.r@example.com',
    members: [
      { id: 'm2', name: 'Elena Rodriguez', gender: 'Female', age: 29, role: 'Partner 1' },
      { id: 'm3', name: 'Sofia Chen', gender: 'Female', age: 31, role: 'Partner 2' }
    ]
  },
  { 
    id: '3', 
    name: 'The Pendragon Family', 
    membershipId: '#VG-11002', 
    lastBooking: 'Aug 15, 2023', 
    status: 'elite', 
    avatar: 'https://picsum.photos/seed/arthur/100/100', 
    category: 'family',
    email: 'arthur.p@example.com',
    members: [
      { id: 'm4', name: 'Arthur Pendragon', gender: 'Male', age: 45, role: 'Father' },
      { id: 'm5', name: 'Guinevere Pendragon', gender: 'Female', age: 42, role: 'Mother' },
      { id: 'm6', name: 'Mordred Pendragon', gender: 'Male', age: 12, role: 'Child' }
    ]
  },
];

const initialPackages: TravelPackage[] = [
  { id: 'p1', name: 'Swiss Alps Expedition', destination: 'Switzerland', price: 3500, duration: '10 Days', image: 'https://picsum.photos/seed/swiss/800/600', type: 'family', rating: 4.9 },
  { id: 'p2', name: 'Kyoto Zen Retreat', destination: 'Japan', price: 2800, duration: '7 Days', image: 'https://picsum.photos/seed/kyoto/800/600', type: 'couple', rating: 4.8 },
  { id: 'p3', name: 'Safari Adventure', destination: 'Kenya', price: 4200, duration: '12 Days', image: 'https://picsum.photos/seed/safari/800/600', type: 'group', rating: 5.0 },
  { id: 'p4', name: 'Nordic Lights', destination: 'Iceland', price: 3100, duration: '8 Days', image: 'https://picsum.photos/seed/iceland/800/600', type: 'friends', rating: 4.7 },
];

const initialInquiries: Inquiry[] = [
  { 
    id: 'inq1', 
    clientId: '1', 
    clientName: 'Marcus Thorne', 
    tripName: 'Alpine Retreat', 
    duration: '12 Days', 
    timeAgo: '2h ago', 
    isUrgent: true, 
    status: 'pending',
    messages: [
      { id: 'm1', sender: 'client', text: 'I am looking for a luxury retreat in the Swiss Alps.', timestamp: '10:00 AM' }
    ]
  },
  { 
    id: 'inq2', 
    clientId: '3', 
    clientName: 'The Pendragon Family', 
    tripName: 'Mediterranean Cruise', 
    duration: '14 Days', 
    timeAgo: '5h ago', 
    isUrgent: false, 
    status: 'in-progress',
    messages: [
      { id: 'm2', sender: 'client', text: 'We need a family suite for 4 people.', timestamp: '08:30 AM' },
      { id: 'm3', sender: 'admin', text: 'I am looking into the best options for you.', timestamp: '09:15 AM' }
    ]
  },
];

const initialSupportTickets: SupportTicket[] = [
  {
    id: 't1',
    clientId: '1',
    clientName: 'Marcus Thorne',
    subject: 'Payment Issue',
    status: 'open',
    priority: 'high',
    createdAt: '2024-04-08T10:00:00Z',
    messages: [
      { id: 'tm1', sender: 'client', text: 'My payment failed twice.', timestamp: '10:00 AM' }
    ]
  }
];

export function VoyagerProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [draftItems, setDraftItems] = useState<DraftItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [packages] = useState<TravelPackage[]>(initialPackages);
  const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries);
  const [clientCarts, setClientCarts] = useState<ClientCart[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>(initialClients[0].id);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(initialSupportTickets);

  const addClient = (client: Omit<Client, 'id' | 'lastBooking'>) => {
    const newClient: Client = {
      ...client,
      id: Math.random().toString(36).substr(2, 9),
      lastBooking: 'Never',
    };
    setClients([newClient, ...clients]);
  };

  const addToDraft = (item: PlannerItem, passengerCount: number = 1) => {
    const newDraftItem: DraftItem = {
      id: Math.random().toString(36).substr(2, 9),
      plannerItemId: item.id,
      title: item.title,
      subtitle: item.subtitle,
      perPersonPrice: item.price,
      price: item.price * passengerCount,
      passengerCount,
      category: item.category,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      details: item,
    };
    setDraftItems([...draftItems, newDraftItem]);
  };

  const removeFromDraft = (id: string) => {
    setDraftItems(draftItems.filter(item => item.id !== id));
  };

  const deleteBooking = (id: string) => {
    setBookings(bookings.filter(b => b.id !== id));
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const finalizeBooking = (clientId: string, tripName: string, travelType: TravelType, scheduledDate?: string) => {
    const client = clients.find(c => c.id === clientId);
    if (!client || draftItems.length === 0) return;

    const total = draftItems.reduce((acc, item) => acc + item.price, 0);
    const newBooking: Booking = {
      id: `VOY-${Math.floor(100000 + Math.random() * 900000)}`,
      clientId,
      clientName: client.name,
      tripName,
      totalAmount: total,
      status: scheduledDate ? 'scheduled' : 'confirmed',
      items: [...draftItems],
      dateRange: scheduledDate ? `${scheduledDate}` : 'Sept 14 - 26, 2024',
      travelType,
      passengers: client.members,
      scheduledAt: scheduledDate,
      paymentStatus: 'paid',
    };

    setBookings([newBooking, ...bookings]);
    setDraftItems([]);
    setCurrentView('bookings');
  };

  const updateInquiryStatus = (id: string, status: InquiryStatus) => {
    setInquiries(inquiries.map(inq => inq.id === id ? { ...inq, status } : inq));
  };

  const addMessage = (inquiryId: string, text: string, sender: 'admin' | 'bot' | 'client') => {
    setInquiries(inquiries.map(inq => {
      if (inq.id === inquiryId) {
        return {
          ...inq,
          messages: [...inq.messages, { id: Date.now().toString(), text, sender, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]
        };
      }
      return inq;
    }));
  };

  const saveToClientCart = (clientId: string, tripName: string) => {
    const existingCart = clientCarts.find(c => c.clientId === clientId);
    if (existingCart) {
      setClientCarts(clientCarts.map(c => c.clientId === clientId ? { ...c, items: [...draftItems], tripName, status: 'draft' } : c));
    } else {
      setClientCarts([...clientCarts, { clientId, items: [...draftItems], tripName, status: 'draft' }]);
    }
    setDraftItems([]);
    setCurrentView('cart');
  };

  const updateCartStatus = (clientId: string, status: CartStatus) => {
    setClientCarts(clientCarts.map(c => c.clientId === clientId ? { ...c, status, lastSharedAt: status === 'pending-approval' ? new Date().toLocaleString() : c.lastSharedAt } : c));
  };

  const addSupportTicket = (clientId: string, subject: string) => {
    const client = clients.find(c => c.id === clientId);
    const newTicket: SupportTicket = {
      id: `TKT-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      clientId,
      clientName: client?.name || 'Unknown',
      subject,
      status: 'open',
      priority: 'medium',
      createdAt: new Date().toISOString(),
      messages: []
    };
    setSupportTickets([newTicket, ...supportTickets]);
  };

  const addSupportMessage = (ticketId: string, text: string, sender: 'admin' | 'client') => {
    setSupportTickets(supportTickets.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          messages: [...t.messages, { id: Date.now().toString(), text, sender, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]
        };
      }
      return t;
    }));
  };

  const totalDraftPrice = useMemo(() => draftItems.reduce((acc, item) => acc + item.price, 0), [draftItems]);

  return (
    <VoyagerContext.Provider value={{ 
      currentView, 
      setCurrentView, 
      clients, 
      addClient, 
      draftItems, 
      addToDraft, 
      removeFromDraft, 
      bookings, 
      deleteBooking,
      updateBooking,
      finalizeBooking,
      totalDraftPrice,
      packages,
      inquiries,
      updateInquiryStatus,
      addMessage,
      clientCarts,
      saveToClientCart,
      updateCartStatus,
      selectedClientId,
      setSelectedClientId,
      supportTickets,
      addSupportTicket,
      addSupportMessage
    }}>
      {children}
    </VoyagerContext.Provider>
  );
}

  const totalDraftPrice = useMemo(() => draftItems.reduce((acc, item) => acc + item.price, 0), [draftItems]);

  return (
    <VoyagerContext.Provider value={{ 
      currentView, 
      setCurrentView, 
      clients, 
      addClient, 
      draftItems, 
      addToDraft, 
      removeFromDraft, 
      bookings, 
      deleteBooking,
      updateBooking,
      finalizeBooking,
      totalDraftPrice,
      packages,
      inquiries,
      updateInquiryStatus,
      addMessage,
      clientCarts,
      saveToClientCart,
      updateCartStatus,
      selectedClientId,
      setSelectedClientId
    }}>
      {children}
    </VoyagerContext.Provider>
  );
}

export function useVoyager() {
  const context = useContext(VoyagerContext);
  if (context === undefined) {
    throw new Error('useVoyager must be used within a VoyagerProvider');
  }
  return context;
}
