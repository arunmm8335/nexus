import React, { useState, useEffect } from 'react';
import { Plus, Minus, Trophy } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { WaterData } from '../types';

interface WaterWidgetProps {
  onUpdate: (data: WaterData) => void;
}

export const WaterWidget: React.FC<WaterWidgetProps> = ({ onUpdate }) => {
  const [current, setCurrent] = useState(0);
  const [goal, setGoal] = useState(8);
  
  useEffect(() => {
    const savedDate = localStorage.getItem('nexus_water_date');
    const today = new Date().toDateString();
    
    if (savedDate !== today) {
      setCurrent(0);
      localStorage.setItem('nexus_water_date', today);
    } else {
      const savedCurrent = localStorage.getItem('nexus_water_current');
      if (savedCurrent) setCurrent(parseInt(savedCurrent));
    }
    
    const savedGoal = localStorage.getItem('nexus_water_goal');
    if (savedGoal) setGoal(parseInt(savedGoal));
  }, []);

  useEffect(() => {
    localStorage.setItem('nexus_water_current', current.toString());
    localStorage.setItem('nexus_water_goal', goal.toString());
    localStorage.setItem('nexus_water_date', new Date().toDateString());
    onUpdate({ current, goal });
  }, [current, goal, onUpdate]);

  const percentage = Math.min((current / goal) * 100, 100);

  return (
    <GlassCard title="Hydration Levels" className="h-full min-h-[240px]">
      <div className="flex flex-col h-full items-center justify-between py-2 relative">
        
        {/* Visual Water Tank */}
        <div className="relative w-36 h-36 rounded-full border border-neutral-800 flex items-center justify-center overflow-hidden bg-neutral-900 shadow-inner">
          
          {/* Wave Container - Moves up/down */}
          <div 
            className="absolute bottom-0 w-full transition-all duration-700 ease-in-out"
            style={{ height: `${percentage}%` }}
          >
             {/* Rotating Waves */}
             <div className="wave"></div>
             <div className="wave" style={{ animationDelay: '-3s' }}></div>
          </div>
          
          <div className="relative z-10 flex flex-col items-center">
            <span className="text-4xl font-bold text-white drop-shadow-md">{current}</span>
            <div className="h-px w-8 bg-white/20 my-1"></div>
            <span className="text-xs text-white/60 uppercase tracking-widest drop-shadow-md">{goal}</span>
          </div>
        </div>

        <div className="flex gap-4 w-full justify-center mt-6">
          <button 
            onClick={() => setCurrent(Math.max(0, current - 1))}
            className="p-3 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-all border border-neutral-700 hover:border-neutral-600 active:scale-95"
          >
            <Minus className="w-5 h-5" />
          </button>
          
          <button 
            onClick={() => setCurrent(current + 1)}
            className="p-3 rounded-full bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 hover:text-sky-200 transition-all border border-sky-500/20 hover:border-sky-400/50 shadow-[0_0_15px_rgba(56,189,248,0.2)] active:scale-95"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {percentage >= 100 && (
          <div className="absolute top-0 right-0 p-2">
            <Trophy className="w-4 h-4 text-yellow-400 animate-bounce" />
          </div>
        )}
      </div>
    </GlassCard>
  );
};