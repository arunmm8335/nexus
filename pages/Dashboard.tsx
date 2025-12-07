
import React, { useState, useEffect } from 'react';
import { Zap, RotateCcw } from 'lucide-react';
import { WeatherWidget } from '../components/WeatherWidget';
import { TodoWidget } from '../components/TodoWidget';
import { FocusWidget } from '../components/FocusWidget';
import { MusicWidget } from '../components/MusicWidget';
import { CalendarWidget } from '../components/CalendarWidget';
import { FinanceWidget } from '../components/FinanceWidget';
import { GlassCard } from '../components/GlassCard';
import { ScratchpadWidget } from '../components/ScratchpadWidget';
import { SystemWidget } from '../components/SystemWidget';
import { getSmartBriefing } from '../services/geminiService';
import { WeatherData, FinanceData, CalendarEvent, WaterData, TodoItem } from '../types';

export const Dashboard: React.FC = () => {
  const [briefing, setBriefing] = useState<string>("Initializing Nexus AI...");
  const [briefingLoading, setBriefingLoading] = useState(false);
  
  // Data State
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [financeData, setFinanceData] = useState<FinanceData>({ budget: 0, transactions: [] });
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    const saved = localStorage.getItem('nexus_todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [waterData] = useState<WaterData>({ current: Number(localStorage.getItem('nexus_water_current') || 0), goal: 8 });

  const handleGenerateBriefing = async () => {
    setBriefingLoading(true);
    const text = await getSmartBriefing(weatherData, financeData, calendarEvents, waterData);
    setBriefing(text);
    setBriefingLoading(false);
  };

  useEffect(() => {
    if (weatherData && briefing === "Initializing Nexus AI...") {
      handleGenerateBriefing();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weatherData]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10">
      
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (Bio & Tasks) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="h-[240px]">
            <WeatherWidget onWeatherUpdate={setWeatherData} />
          </div>
          <div className="flex-1 min-h-[400px]">
             <TodoWidget onTodosUpdate={setTodos} />
          </div>
          <div>
            <FocusWidget />
          </div>
          <div>
            <MusicWidget />
          </div>
        </div>

        {/* Center Column (Intelligence & Systems) */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          {/* Briefing Card */}
          <div className="min-h-[160px]">
             <GlassCard 
               title="Daily Intelligence"
               className="bg-neutral-900/40 border-neutral-800 h-full justify-center"
               action={
                  <button 
                    onClick={handleGenerateBriefing}
                    className="text-neutral-500 hover:text-white transition-colors"
                    title="Update Intelligence"
                  >
                    <Zap className={`w-4 h-4 ${briefingLoading ? 'animate-pulse' : ''}`} />
                  </button>
               }
             >
                <div className="flex items-start space-x-4 h-full">
                   <div className="p-3 bg-white/5 rounded-full animate-pulse hidden md:block border border-white/10 shrink-0 mt-1">
                      <Zap className="w-5 h-5 text-neutral-300" />
                   </div>
                   <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 max-h-[140px]">
                      <p className="text-base leading-relaxed font-light text-neutral-300">
                        {briefingLoading ? "Analyzing schedule and budget..." : briefing}
                      </p>
                   </div>
                </div>
             </GlassCard>
          </div>

          <div className="min-h-[250px]">
            <SystemWidget />
          </div>

          <div className="min-h-[200px]">
            <ScratchpadWidget />
          </div>
        </div>

        {/* Right Column (Finance) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="h-full min-h-[500px]">
            <FinanceWidget onFinanceUpdate={setFinanceData} />
          </div>
        </div>
      </div>

      {/* Bottom Row (Calendar) */}
      <div className="w-full h-[600px]">
        <CalendarWidget onEventsUpdate={setCalendarEvents} />
      </div>

    </div>
  );
};
