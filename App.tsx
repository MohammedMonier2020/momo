
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, ExpiryStatus } from './types';
import { calculateExpiry } from './utils/expiry';
import ProductCard from './components/ProductCard';
import ProductForm from './components/ProductForm';
import Dashboard from './components/Dashboard';
import CyberPanel from './components/ui/CyberPanel';

// Sounds (Placeholder function since we can't bundle files easily)
const playBeep = (level: number) => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (level === 1) { // Soft
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.1);
    } else if (level === 2) { // Noticeable
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.3);
    } else { // Loud Alarm
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(1200, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
    }

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.5);
  } catch (e) {
    console.log("Audio Context blocked by browser policy until user interaction");
  }
};

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('chrono_sentinel_data');
    return saved ? JSON.parse(saved) : [];
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | ExpiryStatus>('ALL');
  const [notificationStatus, setNotificationStatus] = useState<string>('System Ready');

  useEffect(() => {
    localStorage.setItem('chrono_sentinel_data', JSON.stringify(products));
  }, [products]);

  // Request notification permissions
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             p.sku.toLowerCase().includes(searchQuery.toLowerCase());
        const { status } = calculateExpiry(p.expiryDate);
        const matchesFilter = activeFilter === 'ALL' || status === activeFilter;
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
  }, [products, searchQuery, activeFilter]);

  const handleAddProduct = (p: Partial<Product>) => {
    if (editingProduct) {
      setProducts(prev => prev.map(item => item.id === editingProduct.id ? { ...item, ...p } as Product : item));
      setEditingProduct(null);
      setNotificationStatus('Node Data Updated');
    } else {
      const newProduct: Product = {
        ...p,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      } as Product;
      setProducts(prev => [...prev, newProduct]);
      setNotificationStatus('New Node Registered');
    }
    
    // Play sci-fi interaction sound
    playBeep(1);
  };

  const handleDelete = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setNotificationStatus('Node Decommissioned');
    playBeep(2);
  };

  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setIsFormOpen(true);
  };

  // Browser Notification Trigger
  const triggerAlarm = (p: Product, level: number) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(`[ChronoGuard] Critical Alert`, {
        body: `Product ${p.name} reaches terminal stage today.`,
        icon: 'https://picsum.photos/100/100'
      });
    }
    playBeep(level);
  };

  return (
    <div className="min-h-screen relative pb-20 overflow-hidden">
      {/* Background VFX */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="scanline" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(15,23,42,0.5)_0%,rgba(2,6,23,1)_100%)]" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#334155 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
      </div>

      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-cyan-500/30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500/20 border border-cyan-500 rounded flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <h1 className="text-2xl font-black font-orbitron tracking-tighter text-white">CHRONO<span className="text-cyan-400">GUARD</span></h1>
              <p className="text-[10px] text-cyan-500/70 font-orbitron tracking-[0.2em] uppercase">Exp_Sentinel.v2.4</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block px-3 py-1 bg-slate-900 border border-slate-800 rounded text-[10px] font-mono text-cyan-500 animate-pulse">
              SYNC_STATUS: {notificationStatus}
            </div>
            <button
              onClick={() => { setEditingProduct(null); setIsFormOpen(true); }}
              className="px-6 py-2 bg-cyan-600/20 border border-cyan-500 text-cyan-400 rounded font-orbitron text-xs font-bold hover:bg-cyan-500 hover:text-white transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] group flex items-center gap-2"
            >
              <svg className="w-4 h-4 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              NEW_NODE
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* HUD Stats */}
        <Dashboard products={products} />

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <input 
              type="text"
              placeholder="SCAN FOR PRODUCT_ID OR DESIGNATION..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/40 border border-slate-800 rounded px-10 py-3 text-sm font-orbitron text-white focus:outline-none focus:border-cyan-500/50 focus:bg-slate-900/60 transition-all"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {['ALL', ExpiryStatus.EXPIRED, ExpiryStatus.CRITICAL, ExpiryStatus.WARNING, ExpiryStatus.SAFE].map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f as any)}
                className={`px-4 py-2 rounded border text-[10px] font-orbitron whitespace-nowrap transition-all ${
                  activeFilter === f 
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' 
                    : 'bg-slate-900/40 border-slate-800 text-slate-500 hover:border-slate-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filteredProducts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 border-2 border-dashed border-slate-800 rounded-xl"
          >
            <div className="mb-4">
              <svg className="w-12 h-12 mx-auto text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
            </div>
            <h3 className="font-orbitron text-slate-500 text-sm tracking-widest uppercase">No Active Nodes Detected</h3>
            <p className="text-slate-600 text-xs mt-2">Initialize new nodes to begin surveillance.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map(p => (
                <ProductCard 
                  key={p.id} 
                  product={p} 
                  onEdit={openEdit} 
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      <ProductForm 
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingProduct(null); }}
        onSubmit={handleAddProduct}
        editingProduct={editingProduct}
      />

      {/* Floating Action Button for Mobile */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => { setEditingProduct(null); setIsFormOpen(true); }}
        className="fixed bottom-8 right-8 md:hidden w-14 h-14 bg-cyan-500 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(6,182,212,0.6)] z-40"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
      </motion.button>

      {/* Footer decorative bar */}
      <footer className="fixed bottom-0 left-0 right-0 h-1 bg-slate-900 z-50 overflow-hidden">
        <motion.div 
          className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,1)]"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          style={{ width: '30%' }}
        />
      </footer>
    </div>
  );
};

export default App;
