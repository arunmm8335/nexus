
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Flag, Plus, X } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { CalendarEvent } from '../types';

interface CalendarWidgetProps {
  onEventsUpdate: (events: CalendarEvent[]) => void;
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({ onEventsUpdate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('nexus_calendar_events');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState('');

  useEffect(() => {
    localStorage.setItem('nexus_calendar_events', JSON.stringify(events));
    onEventsUpdate(events);
  }, [events, onEventsUpdate]);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  const handleDateClick = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
  };

  const handleQuickAdd = () => {
    const now = new Date();
    setCurrentDate(now); 
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    setSelectedDate(dateStr);
  };

  const addEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal || !selectedDate) return;
    const newEvent: CalendarEvent = {
      date: selectedDate,
      title: newGoal,
      type: 'goal'
    };
    setEvents([...events, newEvent]);
    setNewGoal('');
  };

  const removeEvent = (date: string, title: string) => {
    setEvents(events.filter(ev => !(ev.date === date && ev.title === title)));
  };

  const renderDays = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-12 md:h-14"></div>);
    }
    
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayEvents = events.filter(e => e.date === dateStr);
      const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), d).toDateString();
      const isSelected = selectedDate === dateStr;

      days.push(
        <button 
          key={d} 
          onClick={() => handleDateClick(d)}
          className={`
            h-12 md:h-14 rounded-lg flex flex-col items-center justify-start pt-1.5 relative transition-all duration-300
            ${isSelected ? 'bg-indigo-600 text-white shadow-lg border border-indigo-400/50' : 'hover:bg-white/5'}
            ${isToday ? 'border border-sky-500/30 bg-sky-500/10' : 'border border-transparent'}
          `}
          style={{ color: isSelected ? '#ffffff' : 'var(--text-muted)' }}
        >
          <span className={`text-xs font-medium z-10 ${isToday ? 'text-sky-400 font-bold' : ''}`}>{d}</span>
          
          {isToday && (
            <div className="absolute inset-0 rounded-lg bg-sky-400/5 animate-pulse-slow"></div>
          )}

          {dayEvents.length > 0 && (
             <div className="flex gap-0.5 mt-1.5 flex-wrap justify-center px-1 z-10">
               {dayEvents.slice(0, 4).map((_, i) => (
                 <div key={i} className="w-1.5 h-1.5 rounded-full bg-pink-500 shadow-[0_0_5px_rgba(236,72,153,0.5)]"></div>
               ))}
             </div>
          )}
        </button>
      );
    }
    return days;
  };

  const selectedEvents = selectedDate ? events.filter(e => e.date === selectedDate) : [];

  return (
    <GlassCard 
      title="Strategic Timeline" 
      className="h-full min-h-[500px]"
      action={
        <button 
          onClick={handleQuickAdd}
          className="hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-all"
          title="Add Goal for Today"
          style={{ color: 'var(--text-muted)' }}
        >
          <Plus className="w-4 h-4" />
        </button>
      }
    >
      <div className="flex items-center justify-between mb-6 px-2">
         <button onClick={handlePrevMonth} className="p-2 hover:bg-white/10 rounded-full transition-colors"><ChevronLeft className="w-5 h-5" style={{ color: 'var(--text-muted)' }} /></button>
         <h3 className="font-semibold text-xl tracking-wide" style={{ color: 'var(--text-main)' }}>
           {currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
         </h3>
         <button onClick={handleNextMonth} className="p-2 hover:bg-white/10 rounded-full transition-colors"><ChevronRight className="w-5 h-5" style={{ color: 'var(--text-muted)' }} /></button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center mb-2 border-b pb-2" style={{ borderColor: 'var(--glass-border)' }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 mb-6">
        {renderDays()}
      </div>

      {/* Selected Date Details */}
      <div className="border-t pt-4 flex-1 flex flex-col -mx-6 -mb-6 px-6 pb-6" style={{ borderColor: 'var(--glass-border)', backgroundColor: 'var(--input-bg)' }}>
        {selectedDate ? (
          <div className="animate-in slide-in-from-bottom-2 fade-in duration-300">
             <div className="flex justify-between items-center mb-4 mt-2">
               <div className="text-xs uppercase tracking-widest font-semibold" style={{ color: 'var(--text-muted)' }}>
                 Goals for <span className="ml-1" style={{ color: 'var(--text-main)' }}>{new Date(selectedDate).toLocaleDateString()}</span>
               </div>
             </div>
             
             <form onSubmit={addEvent} className="flex gap-2 mb-4">
               <input 
                  type="text" 
                  value={newGoal}
                  onChange={e => setNewGoal(e.target.value)}
                  placeholder="Add deadline, exam, or goal..."
                  className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors"
                  style={{ backgroundColor: 'rgba(0,0,0,0.2)', borderColor: 'var(--glass-border)', color: 'var(--text-main)' }}
                  autoFocus
               />
               <button type="submit" className="p-2 bg-indigo-500/20 text-indigo-300 rounded-lg hover:bg-indigo-500/30 transition-colors border border-indigo-500/20">
                 <Plus className="w-5 h-5" />
               </button>
             </form>

             <div className="space-y-2 overflow-y-auto max-h-[150px] pr-1 custom-scrollbar">
               {selectedEvents.length === 0 && <div className="text-sm italic py-4 text-center" style={{ color: 'var(--text-muted)' }}>No strategic goals set for this date.</div>}
               {selectedEvents.map((ev, idx) => (
                 <div key={idx} className="flex justify-between items-center group text-sm p-3 rounded-lg transition-colors border" style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }}>
                    <div className="flex items-center gap-3">
                      <Flag className="w-3.5 h-3.5 text-pink-400" />
                      <span style={{ color: 'var(--text-main)' }}>{ev.title}</span>
                    </div>
                    <button onClick={() => removeEvent(ev.date, ev.title)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-500/10">
                      <X className="w-3.5 h-3.5" />
                    </button>
                 </div>
               ))}
             </div>
          </div>
        ) : (
          <div className="text-center text-sm mt-6 flex flex-col items-center" style={{ color: 'var(--text-muted)' }}>
            <div className="p-3 rounded-full mb-3" style={{ backgroundColor: 'var(--glass-bg)' }}>
               <CalendarEventIcon />
            </div>
            Select a date to manage strategic goals.
          </div>
        )}
      </div>
    </GlassCard>
  );
};

const CalendarEventIcon = () => (
  <svg className="w-6 h-6 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)
