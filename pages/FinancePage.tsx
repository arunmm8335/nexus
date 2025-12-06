import React, { useState, useEffect } from 'react';
import { DollarSign, Upload, Search, FileText, Plus, X } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { GlassCard } from '../components/GlassCard';
import { Transaction } from '../types';

const COLORS = ['#38bdf8', '#818cf8', '#34d399', '#f472b6', '#fbbf24', '#a78bfa'];

export const FinancePage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('nexus_transactions');
    return saved ? JSON.parse(saved) : [];
  });
  const [budget] = useState(() => Number(localStorage.getItem('nexus_budget')) || 500);

  // Filter State
  const [searchTerm, setSearchTerm] = useState('');
  
  // Upload Mock State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const totalSpent = transactions.reduce((acc, t) => acc + t.amount, 0);

  // Chart Data
  const categoryData = transactions.reduce((acc, t) => {
    const existing = acc.find(i => i.name === t.category);
    if (existing) {
      existing.value += t.amount;
    } else {
      acc.push({ name: t.category, value: t.amount });
    }
    return acc;
  }, [] as { name: string, value: number }[]);

  // Simulate file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  const processUpload = () => {
    if (!uploadFile) return;
    // Mock processing - add a dummy transaction or just alert
    const newTx: Transaction = {
      id: Date.now().toString(),
      amount: Math.floor(Math.random() * 50) + 10,
      category: 'Other',
      date: new Date().toISOString(),
      receiptUrl: URL.createObjectURL(uploadFile), // Local preview
      note: `Receipt: ${uploadFile.name}`
    };
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    localStorage.setItem('nexus_transactions', JSON.stringify(updated));
    setUploadFile(null);
    setIsUploading(false);
  };

  const filteredTransactions = transactions.filter(t => 
    t.category.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (t.note && t.note.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6">
           <div className="text-neutral-500 text-xs uppercase tracking-widest font-bold">Total Budget</div>
           <div className="text-3xl font-light text-white mt-2">${budget.toFixed(2)}</div>
        </GlassCard>
        <GlassCard className="p-6">
           <div className="text-neutral-500 text-xs uppercase tracking-widest font-bold">Total Spent</div>
           <div className="text-3xl font-light text-red-400 mt-2">${totalSpent.toFixed(2)}</div>
        </GlassCard>
        <GlassCard className="p-6">
           <div className="text-neutral-500 text-xs uppercase tracking-widest font-bold">Remaining</div>
           <div className={`text-3xl font-light mt-2 ${budget - totalSpent >= 0 ? 'text-green-400' : 'text-red-500'}`}>
             ${(budget - totalSpent).toFixed(2)}
           </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts Column */}
        <div className="lg:col-span-1 space-y-6">
           <GlassCard title="Category Breakdown" className="h-[300px] flex flex-col">
              <div className="flex-1 min-h-[200px] w-full relative">
                 <div className="absolute inset-0">
                    <ResponsiveContainer width="99%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#000000" strokeWidth={2} />
                          ))}
                        </Pie>
                        <RechartsTooltip 
                          contentStyle={{ backgroundColor: '#000000', borderColor: '#333', borderRadius: '8px', color: '#fff' }} 
                          itemStyle={{ color: '#fff' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                 </div>
              </div>
           </GlassCard>

           <GlassCard title="Quick Upload Receipt" className="h-auto">
              {!isUploading ? (
                <button 
                  onClick={() => setIsUploading(true)}
                  className="w-full h-32 border-2 border-dashed border-neutral-800 hover:border-white/20 rounded-xl flex flex-col items-center justify-center text-neutral-500 hover:text-white transition-all group bg-white/5"
                >
                  <Upload className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Scan or Upload Receipt</span>
                </button>
              ) : (
                <div className="bg-neutral-900/50 rounded-xl p-4 space-y-4 border border-neutral-800">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-neutral-300">New Receipt</h4>
                    <button onClick={() => setIsUploading(false)}><X className="w-4 h-4 text-neutral-500 hover:text-white" /></button>
                  </div>
                  <input type="file" onChange={handleFileUpload} className="block w-full text-sm text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer" />
                  
                  {uploadFile && (
                    <div className="text-xs text-green-400 flex items-center gap-2 p-2 bg-green-500/10 rounded">
                       <FileText className="w-3 h-3" /> {uploadFile.name}
                    </div>
                  )}

                  <button 
                    onClick={processUpload} 
                    disabled={!uploadFile}
                    className="w-full py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-white/5"
                  >
                    Process Receipt
                  </button>
                </div>
              )}
           </GlassCard>
        </div>

        {/* Detailed Table Column */}
        <div className="lg:col-span-2">
          <GlassCard title="Transaction History" className="h-[600px] flex flex-col">
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input 
                type="text" 
                placeholder="Search transactions..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-white/20 transition-colors"
              />
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar rounded-lg border border-neutral-800">
               <table className="w-full text-left text-sm text-neutral-400">
                 <thead className="bg-neutral-900 sticky top-0 z-10">
                   <tr>
                     <th className="p-4 font-semibold text-neutral-200">Date</th>
                     <th className="p-4 font-semibold text-neutral-200">Category</th>
                     <th className="p-4 font-semibold text-neutral-200">Description</th>
                     <th className="p-4 font-semibold text-neutral-200">Proof</th>
                     <th className="p-4 font-semibold text-neutral-200 text-right">Amount</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-neutral-800">
                    {filteredTransactions.map((t) => (
                      <tr key={t.id} className="hover:bg-neutral-800/50 transition-colors">
                        <td className="p-4">{new Date(t.date).toLocaleDateString()}</td>
                        <td className="p-4">
                          <span className="px-2 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-xs whitespace-nowrap text-neutral-300">
                            {t.category}
                          </span>
                        </td>
                        <td className="p-4 text-neutral-300">{t.note || '-'}</td>
                        <td className="p-4">
                          {t.receiptUrl ? (
                            <a href={t.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 flex items-center gap-1 text-xs whitespace-nowrap">
                              <FileText className="w-3 h-3" /> View Receipt
                            </a>
                          ) : (
                            <span className="text-neutral-600 text-xs italic">No receipt</span>
                          )}
                        </td>
                        <td className="p-4 text-right font-mono font-medium text-white">
                          ${t.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                    {filteredTransactions.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-neutral-500 italic">No transactions found matching your criteria.</td>
                      </tr>
                    )}
                 </tbody>
               </table>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};