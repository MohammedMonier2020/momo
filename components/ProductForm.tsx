
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import { CATEGORIES } from '../constants';
import CyberPanel from './ui/CyberPanel';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (p: Partial<Product>) => void;
  editingProduct?: Product | null;
}

const ProductForm: React.FC<ProductFormProps> = ({ isOpen, onClose, onSubmit, editingProduct }) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    sku: '',
    expiryDate: new Date().toISOString().split('T')[0],
    category: CATEGORIES[0],
    notes: ''
  });

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        ...editingProduct,
        expiryDate: new Date(editingProduct.expiryDate).toISOString().split('T')[0]
      });
    } else {
      setFormData({
        name: '',
        sku: '',
        expiryDate: new Date().toISOString().split('T')[0],
        category: CATEGORIES[0],
        notes: ''
      });
    }
  }, [editingProduct, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-lg z-[101]"
          >
            <CyberPanel title={editingProduct ? "Edit Neural Node" : "Register New Node"}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] text-cyan-500 font-orbitron mb-1 tracking-widest">PRODUCT_NAME</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="Enter designation..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-cyan-500 font-orbitron mb-1 tracking-widest">UNIT_CODE (SKU)</label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={e => setFormData({...formData, sku: e.target.value})}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                      placeholder="XXXX-000"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-cyan-500 font-orbitron mb-1 tracking-widest">EXPIRY_DATE</label>
                    <input
                      required
                      type="date"
                      value={formData.expiryDate}
                      onChange={e => setFormData({...formData, expiryDate: e.target.value})}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-cyan-500 font-orbitron mb-1 tracking-widest">CLASSIFICATION</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c} className="bg-slate-900">{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-cyan-500 font-orbitron mb-1 tracking-widest">MEMO_BUFFER</label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="Optional data strings..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-slate-700 rounded text-slate-400 font-orbitron text-xs hover:bg-slate-800 transition-colors"
                  >
                    ABORT_TASK
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-cyan-600/20 border border-cyan-500 rounded text-cyan-400 font-orbitron text-xs hover:bg-cyan-500 hover:text-white transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                  >
                    {editingProduct ? 'UPDATE_NODE' : 'REGISTER_NODE'}
                  </button>
                </div>
              </form>
            </CyberPanel>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProductForm;
