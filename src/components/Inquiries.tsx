import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Clock, AlertCircle, Send, CheckCircle2, User, Bot, ChevronRight, Filter } from 'lucide-react';
import { useVoyager } from '../VoyagerContext';
import { Inquiry, InquiryStatus } from '../types';

export default function Inquiries() {
  const { inquiries, updateInquiryStatus, addMessage } = useVoyager();
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(inquiries[0]?.id || null);
  const [messageText, setMessageText] = useState('');
  const [filter, setFilter] = useState<InquiryStatus | 'all'>('all');

  const selectedInquiry = inquiries.find(i => i.id === selectedInquiryId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText || !selectedInquiryId) return;
    addMessage(selectedInquiryId, messageText, 'admin');
    setMessageText('');
  };

  const handleBotResponse = () => {
    if (!selectedInquiryId) return;
    addMessage(selectedInquiryId, "Hello! I'm the Voyager AI. Our team is currently reviewing your request for the " + selectedInquiry?.tripName + ". We'll get back to you shortly with pricing and availability.", 'bot');
  };

  const filteredInquiries = inquiries.filter(i => filter === 'all' || i.status === filter);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-12rem)]">
      {/* Inquiry List */}
      <aside className="lg:col-span-4 flex flex-col gap-6 overflow-hidden">
        <div className="flex items-center justify-between px-2">
          <h2 className="font-headline text-2xl font-bold text-primary">Pending Inquiries</h2>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-outline" />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="text-xs font-bold uppercase tracking-widest bg-transparent border-none focus:ring-0 text-primary cursor-pointer"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="on-hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-4 no-scrollbar">
          {filteredInquiries.map((inq) => (
            <motion.button
              key={inq.id}
              onClick={() => setSelectedInquiryId(inq.id)}
              className={`w-full text-left p-5 rounded-2xl border transition-all ${
                selectedInquiryId === inq.id 
                  ? 'bg-primary text-on-primary border-primary shadow-lg' 
                  : 'bg-surface-container-lowest border-outline-variant/10 hover:bg-surface-bright'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                  selectedInquiryId === inq.id ? 'bg-white/20' : 'bg-primary/10 text-primary'
                }`}>
                  {inq.status.replace('-', ' ')}
                </span>
                {inq.isUrgent && <AlertCircle className={`w-4 h-4 ${selectedInquiryId === inq.id ? 'text-white' : 'text-error'}`} />}
              </div>
              <h3 className="font-bold text-lg mb-1">{inq.clientName}</h3>
              <p className={`text-sm mb-3 ${selectedInquiryId === inq.id ? 'text-white/80' : 'text-on-surface-variant'}`}>
                {inq.tripName} · {inq.duration}
              </p>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-60">
                <Clock className="w-3 h-3" />
                {inq.timeAgo}
              </div>
            </motion.button>
          ))}
        </div>
      </aside>

      {/* Chat Interface */}
      <main className="lg:col-span-8 bg-surface-container-low rounded-3xl flex flex-col overflow-hidden shadow-sm border border-outline-variant/5">
        {selectedInquiry ? (
          <>
            {/* Chat Header */}
            <div className="p-6 bg-surface-container-lowest border-b border-outline-variant/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                  {selectedInquiry.clientName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-primary">{selectedInquiry.clientName}</h3>
                  <p className="text-xs text-on-surface-variant">Inquiry for {selectedInquiry.tripName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <select 
                  value={selectedInquiry.status}
                  onChange={(e) => updateInquiryStatus(selectedInquiry.id, e.target.value as InquiryStatus)}
                  className="text-xs font-bold uppercase tracking-widest bg-surface-container-high border-none rounded-lg px-3 py-2 focus:ring-0 cursor-pointer"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="on-hold">On Hold</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
              {selectedInquiry.messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'client' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] flex gap-3 ${msg.sender === 'client' ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.sender === 'client' ? 'bg-secondary/10 text-secondary' : 
                      msg.sender === 'bot' ? 'bg-tertiary/10 text-tertiary' : 'bg-primary/10 text-primary'
                    }`}>
                      {msg.sender === 'client' ? <User className="w-4 h-4" /> : 
                       msg.sender === 'bot' ? <Bot className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <div className={`p-4 rounded-2xl ${
                      msg.sender === 'client' ? 'bg-white text-primary' : 
                      msg.sender === 'bot' ? 'bg-tertiary/10 text-tertiary border border-tertiary/20' : 'bg-primary text-on-primary'
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <p className={`text-[10px] mt-2 font-bold uppercase tracking-widest opacity-50 ${msg.sender === 'client' ? 'text-right' : 'text-left'}`}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-surface-container-lowest border-t border-outline-variant/10">
              <div className="flex gap-4 mb-4">
                <button 
                  onClick={handleBotResponse}
                  className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 bg-tertiary/10 text-tertiary rounded-lg hover:bg-tertiary/20 transition-colors"
                >
                  Auto-Reply (Bot)
                </button>
                <button 
                  onClick={() => setMessageText("We've checked the availability for your requested dates. The total price for the group would be $4,200. Would you like to proceed?")}
                  className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 bg-surface-container-high text-on-surface-variant rounded-lg hover:bg-surface-container-highest transition-colors"
                >
                  Template: Pricing
                </button>
              </div>
              <form onSubmit={handleSendMessage} className="flex gap-4">
                <input 
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your response..."
                  className="flex-1 bg-surface-container-high border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20"
                />
                <button type="submit" className="bg-primary text-on-primary p-3 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all">
                  <Send className="w-6 h-6" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
            <MessageSquare className="w-16 h-16 text-outline mb-6 opacity-20" />
            <h3 className="text-xl font-bold text-primary mb-2">Select an Inquiry</h3>
            <p className="text-on-surface-variant max-w-xs">Choose a client request from the sidebar to start the conversation.</p>
          </div>
        )}
      </main>
    </div>
  );
}
