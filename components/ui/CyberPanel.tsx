
import React from 'react';
import { motion } from 'framer-motion';

interface CyberPanelProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  glowColor?: string;
}

const CyberPanel: React.FC<CyberPanelProps> = ({ children, title, className = '', glowColor = 'cyan' }) => {
  const borderColor = glowColor === 'red' ? 'border-red-500/50' : 'border-cyan-500/50';
  const glowShadow = glowColor === 'red' ? 'shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'shadow-[0_0_15px_rgba(6,182,212,0.2)]';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative bg-slate-900/40 backdrop-blur-xl border ${borderColor} rounded-lg overflow-hidden ${glowShadow} ${className}`}
    >
      {/* Decorative Corners */}
      <div className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 ${glowColor === 'red' ? 'border-red-500' : 'border-cyan-500'}`} />
      <div className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 ${glowColor === 'red' ? 'border-red-500' : 'border-cyan-500'}`} />
      <div className={`absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 ${glowColor === 'red' ? 'border-red-500' : 'border-cyan-500'}`} />
      <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 ${glowColor === 'red' ? 'border-red-500' : 'border-cyan-500'}`} />
      
      {title && (
        <div className={`px-4 py-2 border-b ${borderColor} bg-slate-800/50 flex justify-between items-center`}>
          <h3 className="font-orbitron text-xs tracking-widest uppercase text-cyan-400 font-bold">{title}</h3>
          <div className="flex gap-1">
            <div className={`w-1 h-3 ${glowColor === 'red' ? 'bg-red-500' : 'bg-cyan-500'} opacity-50`}></div>
            <div className={`w-1 h-3 ${glowColor === 'red' ? 'bg-red-500' : 'bg-cyan-500'} opacity-30`}></div>
          </div>
        </div>
      )}
      
      <div className="p-4 relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default CyberPanel;
