
import React, { useState, useEffect } from 'react';
import { DollarSign, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { GlassCard } from './GlassCard';
import { FinanceData, Transaction } from '../types';

interface FinanceWidgetProps {
  onFinanceUpdate: (data: FinanceData) => void;
}

const COLORS = ['#38bdf8', '#818cf8', '#34d399', '#f472b6', '#fbbf24', '#a78bfa'];

export const FinanceWidget: React.FC<FinanceWidgetProps> = ({ onFinanceUpdate }) => {
  const navigate = useNavigate();
  const [budget] = useState(() => Number(localStorage.getItem('nexus_budget')) || 500);
  const [transactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('nexus_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    onFinanceUpdate({ budget, transactions });
  }, [budget, transactions, onFinanceUpdate]);

  const totalSpent = transactions.reduce((acc, t) => acc + t.amount, 0);
  const remaining = budget - totalSpent;
  const percentage = Math.min((totalSpent / budget) * 100, 100);

  // Prepare Chart Data
  const chartData = transactions.reduce((acc, t) => {
    const existing = acc.find(i => i.name === t.category);
    if (existing) {
      existing.value += t.amount;
    } else {
      acc.push({ name: t.category, value: t.amount });
    }
    return acc;
  }, [] as { name: string, value: number }[]);

  return (
    <GlassCard 
      title="Financial Telemetry" 
      className="h-full min-h-[400px]"
      action={
        <button onClick={() => navigate('/finance')} className="text-slate-500 hover:text-white transition-colors flex items-center gap-1 text-xs uppercase tracking-wide">
          Details <ArrowRight className="w-3 h-3" />
        </button>
      }
    >
      <div className="flex flex-col h-full">
        {/* Budget Bar */}
        <div className="mb-6 relative group flex-shrink-0">
          <div className="flex justify-between text-xs text-slate-500 mb-2 uppercase tracking-wider font-semibold">
            <span>Utilization</span>
            <span>${totalSpent.toFixed(0)} <span className="text-slate-700">/</span> ${budget}</span>
          </div>
          <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50 relative">
            <div 
              className={`h-full transition-all duration-700 ease-out relative ${percentage > 90 ? 'bg-red-500' : percentage > 75 ? 'bg-amber-500' : 'bg-gradient-to-r from-sky-500 to-indigo-500'}`}
              style={{ width: `${percentage}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full h-full animate-shimmer" style={{ transform: 'skewX(-20deg)' }}></div>
            </div>
          </div>
          <div className={`text-right mt-2 text-base font-mono font-medium ${remaining >= 0 ? 'text-slate-200' : 'text-red-400'}`}>
             {remaining >= 0 ? `$${remaining.toFixed(0)} Remaining` : `$${Math.abs(remaining).toFixed(0)} Overdraft`}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-h-0 relative">
            <div className="flex flex-col h-full gap-4">
                 {/* Mini Chart */}
                 {chartData.length > 0 ? (
                    <div className="h-40 w-full flex-shrink-0 relative overflow-hidden">
                       <ResponsiveContainer width="99%" height="100%">
                          <PieChart>
                             <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={60}
                                paddingAngle={5}
                                dataKey="value"
                             >
                                {chartData.map((entry, index) => (
                                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(15, 23, 42, 0.5)" strokeWidth={2} />
                                ))}
                             </Pie>
                             <RechartsTooltip 
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                                itemStyle={{ color: '#fff' }}
                                formatter={(value: number) => `$${value}`}
                             />
                          </PieChart>
                       </ResponsiveContainer>
                       <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Spent</span>
                       </div>
                    </div>
                 ) : (
                    <div className="h-40 flex items-center justify-center text-slate-600 text-sm">No data</div>
                 )}

                <div className="flex-1 overflow-y-auto pr-2 space-y-2 min-h-0 custom-scrollbar">
                  {transactions.slice(0, 5).map(t => (
                    <div key={t.id} className="flex justify-between items-center text-sm p-3 hover:bg-slate-800/40 rounded-lg transition-colors border border-transparent hover:border-slate-700/50 group shrink-0">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-800 rounded-full group-hover:bg-sky-500/10 transition-colors">
                          <DollarSign className="w-4 h-4 text-slate-400 group-hover:text-sky-400 transition-colors" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-slate-200 font-medium">{t.category}</span>
                            <span className="text-[10px] text-slate-500">{new Date(t.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <span className="font-mono text-slate-300 font-bold tracking-tight">-${t.amount}</span>
                    </div>
                  ))}
                  {transactions.length > 5 && (
                     <div className="text-center text-xs text-slate-500 pt-2">
                        + {transactions.length - 5} more transactions
                     </div>
                  )}
                </div>
              </div>
        </div>
      </div>
    </GlassCard>
  );
};
