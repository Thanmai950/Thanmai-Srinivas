import React from 'react';
import { Search, LayoutDashboard, Users, Map, ClipboardList, MessageSquare, ShoppingCart, FileText, LifeBuoy } from 'lucide-react';
import { View } from '../types';
import { motion } from 'motion/react';
import { useVoyager } from '../VoyagerContext';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  onViewChange: (view: View) => void;
}

export default function Layout({ children, currentView, onViewChange }: LayoutProps) {
  const { bookings, inquiries, clientCarts, supportTickets } = useVoyager();

  const pendingInquiries = inquiries.filter(i => i.status === 'pending').length;
  const activeCarts = clientCarts.length;
  const openTickets = supportTickets.filter(t => t.status === 'open').length;

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body selection:bg-primary/10 selection:text-primary">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10">
        <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onViewChange('dashboard')}>
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-white font-headline font-black text-xl">V</span>
              </div>
              <h1 className="font-headline text-2xl font-black tracking-tighter text-primary">VOYAGER</h1>
            </div>
            
            <nav className="hidden lg:flex items-center gap-2">
              <NavButton 
                active={currentView === 'dashboard'} 
                onClick={() => onViewChange('dashboard')}
                icon={<LayoutDashboard className="w-5 h-5" />}
                label="Console"
              />
              <NavButton 
                active={currentView === 'inquiries'} 
                onClick={() => onViewChange('inquiries')}
                icon={<MessageSquare className="w-5 h-5" />}
                label="Inquiries"
                badge={pendingInquiries > 0 ? pendingInquiries : undefined}
              />
              <NavButton 
                active={currentView === 'chat'} 
                onClick={() => onViewChange('chat')}
                icon={<MessageSquare className="w-5 h-5" />}
                label="Chat"
              />
              <NavButton 
                active={currentView === 'directory'} 
                onClick={() => onViewChange('directory')}
                icon={<Users className="w-5 h-5" />}
                label="Directory"
              />
              <NavButton 
                active={currentView === 'planner'} 
                onClick={() => onViewChange('planner')}
                icon={<Map className="w-5 h-5" />}
                label="Planner"
              />
              <NavButton 
                active={currentView === 'cart'} 
                onClick={() => onViewChange('cart')}
                icon={<ShoppingCart className="w-5 h-5" />}
                label="Carts"
                badge={activeCarts > 0 ? activeCarts : undefined}
              />
              <NavButton 
                active={currentView === 'bookings'} 
                onClick={() => onViewChange('bookings')}
                icon={<ClipboardList className="w-5 h-5" />}
                label="Bookings"
                badge={bookings.length > 0 ? bookings.length : undefined}
              />
              <NavButton 
                active={currentView === 'support'} 
                onClick={() => onViewChange('support')}
                icon={<LifeBuoy className="w-5 h-5" />}
                label="Support"
                badge={openTickets > 0 ? openTickets : undefined}
              />
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center bg-surface-container-high rounded-full px-4 py-2 w-64 group focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <Search className="w-4 h-4 text-outline group-focus-within:text-primary" />
              <input 
                type="text" 
                placeholder="Search dossiers..." 
                className="bg-transparent border-none focus:ring-0 text-sm w-full ml-2"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold leading-none">Alex Rivers</p>
                <p className="text-[10px] font-bold text-tertiary uppercase tracking-widest mt-1">Senior Partner</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-surface-container-highest border-2 border-surface shadow-sm overflow-hidden">
                <img src="https://picsum.photos/seed/agent/100/100" alt="Agent" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-[1600px] mx-auto px-6 py-8 pb-32 lg:pb-8">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-6 left-6 right-6 z-50 bg-surface-container-lowest/90 backdrop-blur-xl border border-outline-variant/10 rounded-2xl p-2 flex items-center justify-around shadow-2xl">
        <MobileNavButton 
          active={currentView === 'dashboard'} 
          onClick={() => onViewChange('dashboard')}
          icon={<LayoutDashboard className="w-6 h-6" />}
        />
        <MobileNavButton 
          active={currentView === 'directory'} 
          onClick={() => onViewChange('directory')}
          icon={<Users className="w-6 h-6" />}
        />
        <div className="relative -top-6">
          <button 
            onClick={() => onViewChange('planner')}
            className="w-14 h-14 bg-primary text-on-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/30 active:scale-90 transition-transform"
          >
            <Map className="w-7 h-7" />
          </button>
        </div>
        <MobileNavButton 
          active={currentView === 'bookings'} 
          onClick={() => onViewChange('bookings')}
          icon={<ClipboardList className="w-6 h-6" />}
        />
        <div className="w-12 h-12 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden">
             <img src="https://picsum.photos/seed/agent/100/100" alt="Agent" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
        </div>
      </nav>
    </div>
  );
}

function NavButton({ active, onClick, icon, label, badge }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, badge?: number }) {
  return (
    <button 
      onClick={onClick}
      className={`relative flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
        active ? 'bg-primary/5 text-primary' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-primary'
      }`}
    >
      {icon}
      <span>{label}</span>
      {badge !== undefined && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-tertiary text-white text-[10px] flex items-center justify-center rounded-full border-2 border-surface">
          {badge}
        </span>
      )}
      {active && (
        <motion.div 
          layoutId="nav-pill"
          className="absolute inset-0 bg-primary/5 rounded-xl -z-10"
          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
        />
      )}
    </button>
  );
}

function MobileNavButton({ active, onClick, icon }: { active: boolean, onClick: () => void, icon: React.ReactNode }) {
  return (
    <button 
      onClick={onClick}
      className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all ${
        active ? 'text-primary bg-primary/5' : 'text-on-surface-variant'
      }`}
    >
      {icon}
    </button>
  );
}
