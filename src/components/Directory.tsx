import React, { useState } from 'react';
import { Search, UserPlus, MoreVertical, ArrowRight, Award, X, Plus, Trash2, User, Users, Heart, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useVoyager } from '../VoyagerContext';
import { ClientCategory, Gender, GroupMember } from '../types';

export default function Directory() {
  const { clients, addClient } = useVoyager();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientCategory, setNewClientCategory] = useState<ClientCategory>('single');
  const [members, setMembers] = useState<Omit<GroupMember, 'id'>[]>([]);
  const [error, setError] = useState('');

  const resetForm = () => {
    setNewClientName('');
    setNewClientCategory('single');
    setMembers([]);
    setError('');
  };

  const handleCategoryChange = (cat: ClientCategory) => {
    setNewClientCategory(cat);
    if (cat === 'single') {
      setMembers([{ name: '', gender: 'Male', age: 25, role: 'Self' }]);
    } else if (cat === 'couple') {
      setMembers([
        { name: '', gender: 'Male', age: 30, role: 'Partner 1' },
        { name: '', gender: 'Female', age: 30, role: 'Partner 2' }
      ]);
    } else if (cat === 'family') {
      setMembers([
        { name: '', gender: 'Male', age: 40, role: 'Father' },
        { name: '', gender: 'Female', age: 38, role: 'Mother' }
      ]);
    } else {
      setMembers([{ name: '', gender: 'Male', age: 25, role: 'Member' }]);
    }
  };

  const addMember = () => {
    setMembers([...members, { name: '', gender: 'Male', age: 25, role: newClientCategory === 'family' ? 'Child' : 'Member' }]);
  };

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const updateMember = (index: number, updates: Partial<Omit<GroupMember, 'id'>>) => {
    setMembers(members.map((m, i) => i === index ? { ...m, ...updates } : m));
  };

  const validate = () => {
    if (!newClientName) return 'Group/Client name is required';
    if (members.length === 0) return 'At least one member is required';
    
    for (const m of members) {
      if (!m.name) return 'All members must have a name';
      if (m.age < 0) return 'Age cannot be negative';
    }

    if (newClientCategory === 'family') {
      const hasAdult = members.some(m => m.role === 'Father' || m.role === 'Mother' || m.age >= 18);
      if (!hasAdult) return 'Family must have at least one adult';
    }

    return '';
  };

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    addClient({
      name: newClientName,
      membershipId: `#VG-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'active',
      avatar: `https://picsum.photos/seed/${newClientName}/100/100`,
      category: newClientCategory,
      members: members.map(m => ({ ...m, id: Math.random().toString(36).substr(2, 9) })),
    });
    
    resetForm();
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <p className="font-label text-sm uppercase tracking-[0.2em] text-on-surface-variant font-medium">Global Management</p>
          <h2 className="font-headline text-4xl font-extrabold text-primary tracking-tight">Client Directory</h2>
        </div>
        <button 
          onClick={() => {
            resetForm();
            handleCategoryChange('single');
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-xl font-semibold shadow-lg active:scale-95 transition-transform"
        >
          <UserPlus className="w-5 h-5" />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Add Client Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-surface-container-lowest w-full max-w-2xl rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="font-headline text-3xl font-bold text-primary">New Client Profile</h3>
                  <p className="text-on-surface-variant">Create a structured travel group or individual profile.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-surface-container-high rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddClient} className="space-y-8">
                {error && (
                  <div className="p-4 bg-error/10 text-error rounded-xl flex items-center gap-3 font-bold text-sm">
                    <X className="w-5 h-5" />
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-on-surface-variant mb-2 uppercase tracking-wider">Group / Client Name</label>
                    <input 
                      type="text" 
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                      className="w-full px-4 py-3 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary/20"
                      placeholder="e.g. Sharma Family"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-on-surface-variant mb-2 uppercase tracking-wider">Category</label>
                    <div className="grid grid-cols-4 gap-2">
                      {(['single', 'couple', 'family', 'friends_group'] as ClientCategory[]).map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => handleCategoryChange(cat)}
                          className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
                            newClientCategory === cat ? 'bg-primary text-white shadow-lg' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                          }`}
                        >
                          {cat === 'single' && <User className="w-5 h-5" />}
                          {cat === 'couple' && <Heart className="w-5 h-5" />}
                          {cat === 'family' && <Home className="w-5 h-5" />}
                          {cat === 'friends_group' && <Users className="w-5 h-5" />}
                          <span className="text-[8px] font-bold uppercase">{cat.split('_')[0]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-primary uppercase tracking-widest text-xs">Group Members</h4>
                    {newClientCategory !== 'single' && newClientCategory !== 'couple' && (
                      <button 
                        type="button" 
                        onClick={addMember}
                        className="flex items-center gap-1 text-primary text-xs font-bold hover:underline"
                      >
                        <Plus className="w-4 h-4" /> Add Member
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    {members.map((member, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 bg-surface-container-low rounded-2xl flex flex-col gap-4 border border-outline-variant/5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Member #{index + 1}</span>
                          {members.length > 1 && (newClientCategory === 'family' || newClientCategory === 'friends_group') && (
                            <button type="button" onClick={() => removeMember(index)} className="text-error hover:bg-error/10 p-1 rounded-lg">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                          <div className="sm:col-span-5">
                            <input 
                              type="text" 
                              placeholder="Full Name"
                              value={member.name}
                              onChange={(e) => updateMember(index, { name: e.target.value })}
                              className="w-full px-3 py-2 bg-surface-container-lowest border-none rounded-lg text-sm"
                            />
                          </div>
                          <div className="sm:col-span-3">
                            <select 
                              value={member.gender}
                              onChange={(e) => updateMember(index, { gender: e.target.value as Gender })}
                              className="w-full px-3 py-2 bg-surface-container-lowest border-none rounded-lg text-sm"
                            >
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div className="sm:col-span-2">
                            <input 
                              type="number" 
                              placeholder="Age"
                              value={member.age}
                              onChange={(e) => updateMember(index, { age: parseInt(e.target.value) || 0 })}
                              className="w-full px-3 py-2 bg-surface-container-lowest border-none rounded-lg text-sm"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <input 
                              type="text" 
                              placeholder="Role"
                              value={member.role}
                              onChange={(e) => updateMember(index, { role: e.target.value })}
                              className="w-full px-3 py-2 bg-surface-container-lowest border-none rounded-lg text-sm"
                              disabled={newClientCategory === 'single' || newClientCategory === 'couple'}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <button type="submit" className="w-full py-4 bg-primary text-on-primary rounded-2xl font-bold shadow-xl shadow-primary/20 hover:brightness-110 transition-all">
                  Create Global Profile
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Search Bar */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
          <Search className="w-6 h-6 text-outline" />
        </div>
        <input 
          type="text" 
          placeholder="Search clients by name, destination, or membership ID..."
          className="w-full pl-14 pr-6 py-5 bg-surface-container-high border-none rounded-2xl font-body text-lg focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all placeholder:text-outline"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar Stats */}
        <aside className="lg:col-span-3 flex flex-col gap-6">
          <div className="p-6 rounded-2xl bg-surface-container-low">
            <h3 className="font-headline font-bold text-tertiary mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <StatRow label="Active Travelers" value="1,240" progress={75} color="bg-secondary" />
              <StatRow label="Retention Rate" value="92%" progress={92} color="bg-primary" />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-primary text-on-primary relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="font-headline font-bold text-lg mb-1">VIP Insights</h3>
              <p className="text-sm text-on-primary/80 mb-4">42 clients are eligible for status upgrades this month.</p>
              <button className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                Review List <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <Award className="w-32 h-32" />
            </div>
          </div>
        </aside>

        {/* Main List */}
        <div className="lg:col-span-9 space-y-4">
          {clients.map((client) => (
            <motion.div 
              key={client.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row items-center md:justify-between p-5 bg-surface-container-lowest rounded-2xl transition-all hover:bg-surface-bright group border border-outline-variant/5"
            >
              <div className="flex items-center gap-5 w-full md:w-auto mb-4 md:mb-0">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-surface-container flex-shrink-0">
                  <img 
                    src={client.avatar} 
                    alt={client.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h4 className="font-headline font-bold text-xl text-primary">{client.name}</h4>
                  <p className="text-sm text-on-surface-variant font-medium">Membership ID: {client.membershipId}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 md:gap-12 w-full md:w-auto justify-between md:justify-end">
                <div className="text-center md:text-right">
                  <p className="text-[10px] uppercase tracking-widest text-outline font-bold mb-1">Category</p>
                  <p className="font-headline font-semibold text-tertiary capitalize">{client.category.replace('_', ' ')}</p>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-[10px] uppercase tracking-widest text-outline font-bold mb-1">Members</p>
                  <p className="font-headline font-semibold text-tertiary">{client.members.length}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    client.status === 'elite' ? 'bg-tertiary-container text-white' : 'bg-secondary-container text-on-secondary-container'
                  }`}>
                    {client.status}
                  </span>
                  <button className="p-2 rounded-xl hover:bg-surface-container-high transition-colors">
                    <MoreVertical className="w-5 h-5 text-outline" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatRow({ label, value, progress, color }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-on-surface-variant">{label}</span>
        <span className="text-sm font-bold text-primary">{value}</span>
      </div>
      <div className="w-full bg-outline-variant/20 h-1.5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`${color} h-full`} 
        />
      </div>
    </div>
  );
}
