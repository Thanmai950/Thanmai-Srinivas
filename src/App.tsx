/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Directory from './components/Directory';
import Planner from './components/Planner';
import Bookings from './components/Bookings';
import Inquiries from './components/Inquiries';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Brochure from './components/Brochure';
import ClientReview from './components/ClientReview';
import Chat from './components/Chat';
import Support from './components/Support';
import { VoyagerProvider, useVoyager } from './VoyagerContext';
import { motion, AnimatePresence } from 'motion/react';

function AppContent() {
  const { currentView, setCurrentView } = useVoyager();

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'directory': return <Directory />;
      case 'planner': return <Planner />;
      case 'bookings': return <Bookings />;
      case 'inquiries': return <Inquiries />;
      case 'cart': return <Cart />;
      case 'checkout': return <Checkout />;
      case 'brochure': return <Brochure />;
      case 'client-review': return <ClientReview />;
      case 'chat': return <Chat />;
      case 'support': return <Support />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}

export default function App() {
  return (
    <VoyagerProvider>
      <AppContent />
    </VoyagerProvider>
  );
}

