
import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../types';
import { calculateExpiry, getStatusLabel } from '../utils/expiry';
import CyberPanel from './ui/CyberPanel';

interface ProductCardProps {
  product: Product;
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete }) => {
  const { daysLeft, status, color, alarmLevel } = calculateExpiry(product.expiryDate);
  
  const isExpired = daysLeft < 0;
  const isCritical = daysLeft === 0;
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <CyberPanel 
        className="h-full group"
        glowColor={alarmLevel >= 2 ? 'red' : 'cyan'}
      >
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className="text-[10px] text-slate-400 font-orbitron uppercase tracking-tighter">SKU: {product.sku || 'N/A'}</span>
            <h2 className="text-xl font-bold font-orbitron text-white leading-tight group-hover:text-cyan-400 transition-colors">
              {product.name}
            </h2>
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => onEdit(product)}
              className="p-1 hover:text-cyan-400 text-slate-500"
              title="Edit Node"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M16.242 19.142l3.536-3.536M15.172 6.172L19.5 10.5M4 14.5V20h5.5l9.142-9.142-5.5-5.5L4 14.5z" /></svg>
            </button>
            <button 
              onClick={() => onDelete(product.id)}
              className="p-1 hover:text-red-400 text-slate-500"
              title="Decommission Node"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative">
               {/* Pulsing glow ring for critical/expired */}
               {(isExpired || isCritical) && (
                 <div className="absolute inset-0 rounded-full animate-ping bg-red-500/50 scale-150"></div>
               )}
               <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-orbitron text-lg font-bold`} style={{ borderColor: color, color: color }}>
                {isExpired ? '!' : daysLeft}
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Time to Terminal</p>
              <p className="text-sm font-bold" style={{ color }}>
                {isExpired ? 'LIFESPAN DEPLETED' : `${daysLeft} Solar Cycles Remaining`}
              </p>
            </div>
          </div>

          <div className="bg-slate-950/50 p-2 rounded border border-slate-800 text-[11px] font-mono">
            <div className="flex justify-between mb-1">
              <span className="text-slate-500">CATEGORY</span>
              <span className="text-cyan-500">{product.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">EXPIRY_DATE</span>
              <span className="text-slate-300">{new Date(product.expiryDate).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="relative h-1 bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(0, Math.min(100, (daysLeft / 30) * 100))}%` }}
              className="h-full"
              style={{ backgroundColor: color }}
            />
          </div>

          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full animate-pulse`} style={{ backgroundColor: color }}></div>
            <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color }}>
              {getStatusLabel(status)}
            </span>
          </div>
        </div>
      </CyberPanel>
    </motion.div>
  );
};

export default ProductCard;
