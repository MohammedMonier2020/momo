
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Product, ExpiryStatus } from '../types';
import { calculateExpiry } from '../utils/expiry';
import CyberPanel from './ui/CyberPanel';

interface DashboardProps {
  products: Product[];
}

const Dashboard: React.FC<DashboardProps> = ({ products }) => {
  const stats = useMemo(() => {
    const counts = {
      [ExpiryStatus.SAFE]: 0,
      [ExpiryStatus.APPROACHING]: 0,
      [ExpiryStatus.WARNING]: 0,
      [ExpiryStatus.CRITICAL]: 0,
      [ExpiryStatus.EXPIRED]: 0,
    };

    products.forEach(p => {
      const { status } = calculateExpiry(p.expiryDate);
      counts[status]++;
    });

    return [
      { name: 'Safe', value: counts[ExpiryStatus.SAFE], color: '#10b981' },
      { name: 'Approaching', value: counts[ExpiryStatus.APPROACHING], color: '#eab308' },
      { name: 'Warning', value: counts[ExpiryStatus.WARNING], color: '#f97316' },
      { name: 'Critical', value: counts[ExpiryStatus.CRITICAL], color: '#f43f5e' },
      { name: 'Expired', value: counts[ExpiryStatus.EXPIRED], color: '#ef4444' },
    ].filter(s => s.value > 0);
  }, [products]);

  const total = products.length;
  const criticalCount = products.filter(p => calculateExpiry(p.expiryDate).alarmLevel >= 2).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <CyberPanel title="Neural Network Stats" className="md:col-span-2">
        <div className="flex flex-col md:flex-row items-center gap-6 h-full">
          <div className="w-full h-48 md:w-1/2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: '#f8fafc' }}
                  itemStyle={{ color: '#22d3ee' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full md:w-1/2">
            <div className="p-3 bg-slate-950/50 rounded border border-slate-800">
              <p className="text-[10px] text-slate-500 uppercase font-orbitron">Active Nodes</p>
              <p className="text-2xl font-bold text-white">{total}</p>
            </div>
            <div className="p-3 bg-slate-950/50 rounded border border-slate-800">
              <p className="text-[10px] text-slate-500 uppercase font-orbitron">Integrity Warnings</p>
              <p className="text-2xl font-bold text-orange-500">{criticalCount}</p>
            </div>
            <div className="p-3 bg-slate-950/50 rounded border border-slate-800 col-span-2">
              <p className="text-[10px] text-slate-500 uppercase font-orbitron">System Health</p>
              <div className="mt-2 h-1 bg-slate-800 rounded-full">
                <div 
                  className="h-full bg-cyan-500 rounded-full" 
                  style={{ width: total > 0 ? `${((total - criticalCount) / total) * 100}%` : '100%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </CyberPanel>

      <CyberPanel title="System Alerts" glowColor={criticalCount > 0 ? 'red' : 'cyan'}>
        <div className="flex flex-col justify-center h-full gap-4 py-2">
          {criticalCount > 0 ? (
             <div className="text-center animate-pulse">
               <div className="text-red-500 mb-2">
                 <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
               </div>
               <p className="text-red-400 font-bold font-orbitron text-sm">SECURITY COMPROMISED</p>
               <p className="text-xs text-slate-400 mt-1">{criticalCount} critical items found.</p>
             </div>
          ) : (
            <div className="text-center">
              <div className="text-emerald-500 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <p className="text-emerald-400 font-bold font-orbitron text-sm">SYSTEM STABLE</p>
              <p className="text-xs text-slate-400 mt-1">All modules operating within normal parameters.</p>
            </div>
          )}
        </div>
      </CyberPanel>
    </div>
  );
};

export default Dashboard;
