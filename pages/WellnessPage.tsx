
import React, { useState } from 'react';
import { WaterWidget } from '../components/WaterWidget';
import { PeriodTracker } from '../components/PeriodTracker';
import { GlassCard } from '../components/GlassCard';
import { WaterData } from '../types';

export const WellnessPage: React.FC = () => {
  const [waterData, setWaterData] = useState<WaterData>({ current: 0, goal: 8 });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Column 1: Daily Hydration */}
      <div className="space-y-6">
        <div className="h-[400px]">
           <WaterWidget onUpdate={setWaterData} />
        </div>
        
        <GlassCard title="Health Notes" className="h-[250px]">
          <textarea 
            className="w-full h-full bg-transparent resize-none border-none focus:ring-0 text-slate-300 placeholder-slate-600 text-sm p-0 leading-relaxed"
            placeholder="Log symptoms, medicines, or workout notes here..."
          ></textarea>
        </GlassCard>
      </div>

      {/* Column 2: Cycle Tracker */}
      <div className="h-[674px]">
        <PeriodTracker />
      </div>
    </div>
  );
};
