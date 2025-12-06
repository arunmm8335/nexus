import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Droplets, Heart, Smile, Frown, Meh, AlertCircle } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { CycleData } from '../types';

export const PeriodTracker: React.FC = () => {
  const [cycleData, setCycleData] = useState<CycleData>(() => {
    const saved = localStorage.getItem('nexus_cycle_data');
    return saved ? JSON.parse(saved) : { lastPeriodDate: new Date().toISOString().split('T')[0], cycleLength: 28, periodLength: 5 };
  });
  
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [mood, setMood] = useState<string>('Neutral');

  useEffect(() => {
    localStorage.setItem('nexus_cycle_data', JSON.stringify(cycleData));
  }, [cycleData]);

  const nextPeriodDate = new Date(new Date(cycleData.lastPeriodDate).getTime() + cycleData.cycleLength * 24 * 60 * 60 * 1000);
  const daysUntil = Math.ceil((nextPeriodDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  const isPeriodNow = daysUntil > cycleData.cycleLength - cycleData.periodLength || daysUntil <= 0;

  const toggleSymptom = (s: string) => {
    setSymptoms(prev => prev.includes(s) ? prev.filter(i => i !== s) : [...prev, s]);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCycleData({ ...cycleData, lastPeriodDate: e.target.value });
  };

  return (
    <GlassCard title="Cycle & Bio-Rhythm" className="h-full flex flex-col">
       {/* Main Status */}
       <div className="flex flex-col items-center justify-center py-8">
         <div className={`relative w-48 h-48 rounded-full border-4 flex items-center justify-center mb-6 transition-colors duration-500 ${isPeriodNow ? 'border-pink-500/50 bg-pink-500/10' : 'border-neutral-800 bg-neutral-900'}`}>
            <div className="text-center">
               {isPeriodNow ? (
                 <>
                    <Droplets className="w-10 h-10 text-pink-400 mx-auto mb-2 animate-bounce" />
                    <div className="text-2xl font-bold text-pink-200">Period Day</div>
                    <div className="text-sm text-pink-400/80 uppercase tracking-widest">Active Phase</div>
                 </>
               ) : (
                 <>
                    <div className="text-5xl font-bold text-white">{daysUntil}</div>
                    <div className="text-sm text-neutral-500 uppercase tracking-widest mt-2">Days Until</div>
                 </>
               )}
            </div>
            
            {/* Circular Progress (Visual only) */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
              <circle cx="96" cy="96" r="90" fill="transparent" stroke="currentColor" strokeWidth="2" className={`${isPeriodNow ? 'text-pink-500' : 'text-sky-500'}`} strokeDasharray="565" strokeDashoffset={565 - (565 * ((cycleData.cycleLength - daysUntil) / cycleData.cycleLength))} />
            </svg>
         </div>

         <div className="text-center mb-8">
           <div className="text-sm text-neutral-500">Predicted Next Cycle Start</div>
           <div className="text-lg font-medium text-neutral-200">{nextPeriodDate.toDateString()}</div>
         </div>
       </div>

       {/* Controls */}
       <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800 flex-1 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-neutral-500 uppercase font-bold block mb-2">Last Period Start</label>
              <input 
                type="date" 
                value={cycleData.lastPeriodDate}
                onChange={handleDateChange}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-white focus:border-pink-500/50 outline-none" 
              />
            </div>
            <div>
              <label className="text-xs text-neutral-500 uppercase font-bold block mb-2">Cycle Length</label>
              <div className="flex items-center gap-3">
                 <button onClick={() => setCycleData(p => ({...p, cycleLength: p.cycleLength - 1}))} className="p-3 bg-neutral-800 rounded-lg hover:bg-neutral-700 border border-neutral-700">-</button>
                 <span className="text-xl font-mono text-white w-8 text-center">{cycleData.cycleLength}</span>
                 <button onClick={() => setCycleData(p => ({...p, cycleLength: p.cycleLength + 1}))} className="p-3 bg-neutral-800 rounded-lg hover:bg-neutral-700 border border-neutral-700">+</button>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-800 pt-6">
             <h4 className="text-xs text-neutral-500 uppercase font-bold mb-4">Daily Log</h4>
             
             {/* Mood */}
             <div className="flex justify-between mb-4">
                {['Happy', 'Neutral', 'Sad', 'Irritable'].map(m => (
                  <button 
                    key={m}
                    onClick={() => setMood(m)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${mood === m ? 'bg-pink-500/20 text-pink-300' : 'text-neutral-500 hover:text-white'}`}
                  >
                     {m === 'Happy' && <Smile className="w-6 h-6" />}
                     {m === 'Neutral' && <Meh className="w-6 h-6" />}
                     {m === 'Sad' && <Frown className="w-6 h-6" />}
                     {m === 'Irritable' && <AlertCircle className="w-6 h-6" />}
                     <span className="text-[10px]">{m}</span>
                  </button>
                ))}
             </div>

             {/* Symptoms */}
             <div className="flex flex-wrap gap-2">
               {['Cramps', 'Headache', 'Bloating', 'Acne', 'Fatigue'].map(s => (
                 <button 
                   key={s}
                   onClick={() => toggleSymptom(s)}
                   className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${symptoms.includes(s) ? 'bg-pink-500 text-white border-pink-500' : 'bg-transparent text-neutral-400 border-neutral-700 hover:border-neutral-500'}`}
                 >
                   {s}
                 </button>
               ))}
             </div>
          </div>
       </div>
    </GlassCard>
  );
};