
import React, { useState, useEffect } from 'react';
import { Zap, BrainCircuit } from 'lucide-react';
import { WeatherWidget } from '../components/WeatherWidget';
import { QuoteWidget } from '../components/QuoteWidget';
import { TodoWidget } from '../components/TodoWidget';
import { FocusWidget } from '../components/FocusWidget';
import { MusicWidget } from '../components/MusicWidget';
import { CalendarWidget } from '../components/CalendarWidget';
import { FinanceWidget } from '../components/FinanceWidget';
import { GlassCard } from '../components/GlassCard';
import { getSmartBriefing, getPerformanceInsights } from '../services/geminiService';
import { WeatherData, FinanceData, CalendarEvent, WaterData, TodoItem, JournalEntry } from '../types';

export const Dashboard: React.FC = () => {
  const [briefing, setBriefing] = useState<string>("Initializing Nexus AI...");
  const [briefingLoading, setBriefingLoading] = useState(false);
  
  const [insights, setInsights] = useState<string>("Awaiting command to analyze performance metrics...");
  const [insightsLoading, setInsightsLoading] = useState(false);
  
  // Data State - Shared across dashboard for briefing context
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [financeData, setFinanceData] = useState<FinanceData>({ budget: 0, transactions: [] });
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  
  // Todo State - Managed here to pass to Insights
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    const saved = localStorage.getItem('nexus_todos');
    return saved ? JSON.parse(saved) : [];
  });

  // Load background data for AI analysis
  const [journal] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('nexus_journal');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [waterData] = useState<WaterData>({ current: Number(localStorage.getItem('nexus_water_current') || 0), goal: 8 });

  const handleGenerateBriefing = async () => {
    setBriefingLoading(true);
    const text = await getSmartBriefing(weatherData, financeData, calendarEvents, waterData);
    setBriefing(text);
    setBriefingLoading(false);
  };

  const handleGenerateInsights = async () => {
    setInsightsLoading(true);
    const text = await getPerformanceInsights(todos, journal, financeData);
    setInsights(text);
    setInsightsLoading(false);
  };

  useEffect(() => {
    if (weatherData && briefing === "Initializing Nexus AI...") {
      handleGenerateBriefing();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weatherData]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start animate-in fade-in duration-500">
      
      {/* Left Column: Bio & Environment (Width: 3/12) */}
      <div className="lg:col-span-3 flex flex-col gap-6 h-full">
        <div className="flex-none">
           <WeatherWidget onWeatherUpdate={setWeatherData} />
        </div>
        <div className="flex-1 min-h-[400px]">
           <TodoWidget onTodosUpdate={setTodos} />
        </div>
        <div className="flex-none">
           <FocusWidget />
        </div>
        <div className="flex-none">
           <MusicWidget />
        </div>
      </div>

      {/* Main Content Area (Width: 9/12) */}
      <div className="lg:col-span-9 flex flex-col gap-6">
         
         {/* Top Section: Intelligence & Finance */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Intelligence Stack (Width: 2/3) */}
            <div className="lg:col-span-2 flex flex-col gap-6">
               {/* Briefing Card */}
               <GlassCard 
                 title="Daily Intelligence"
                 className="bg-neutral-900/40 border-neutral-800 flex-none min-h-[140px]"
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
                  <div className="flex items-start space-x-4">
                     <div className="p-3 bg-white/5 rounded-full animate-pulse hidden md:block border border-white/10">
                        <Zap className="w-5 h-5 text-neutral-300" />
                     </div>
                     <div className="flex-1">
                        <p className="text-base md:text-lg leading-snug font-light text-neutral-300">
                          {briefingLoading ? "Analyzing schedule and budget..." : briefing}
                        </p>
                     </div>
                  </div>
               </GlassCard>

               {/* AI Performance Insights Card */}
               <GlassCard 
                 title="Performance Patterns"
                 className="bg-neutral-900/60 border-white/5 flex-none min-h-[100px]"
                 action={
                    <button 
                      onClick={handleGenerateInsights}
                      className="text-neutral-500 hover:text-white transition-colors"
                      title="Analyze Performance"
                      disabled={insightsLoading}
                    >
                      <BrainCircuit className={`w-4 h-4 ${insightsLoading ? 'animate-pulse' : ''}`} />
                    </button>
                 }
               >
                 <div className="flex items-center space-x-4">
                   <div className="p-2 bg-white/5 rounded-lg hidden md:block">
                     <BrainCircuit className="w-4 h-4 text-neutral-400" />
                   </div>
                   <p className="text-sm leading-relaxed text-neutral-400 italic">
                     "{insightsLoading ? "Processing behavioral data..." : insights}"
                   </p>
                 </div>
               </GlassCard>

               {/* Quote Widget (Moved here to balance height with Finance) */}
               <div className="flex-none">
                 <QuoteWidget />
               </div>
            </div>

            {/* Finance Column (Width: 1/3) */}
            <div className="lg:col-span-1">
               <FinanceWidget onFinanceUpdate={setFinanceData} />
            </div>
         </div>

         {/* Bottom Section: Calendar (Full Width of Main Area) */}
         <div className="flex-none">
           <CalendarWidget onEventsUpdate={setCalendarEvents} />
         </div>
      </div>

    </div>
  );
};
