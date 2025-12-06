import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Edit2, Save, X } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownWidget: React.FC = () => {
  const [targetDate, setTargetDate] = useState<string>(() => 
    localStorage.getItem('nexus_event_date') || new Date(new Date().getFullYear() + 1, 0, 1).toISOString()
  );
  const [eventName, setEventName] = useState(() => 
    localStorage.getItem('nexus_event_name') || "Next Milestone"
  );
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isEditing, setIsEditing] = useState(false);
  
  // Temp state for editing
  const [editName, setEditName] = useState(eventName);
  const [editDate, setEditDate] = useState(targetDate.split('T')[0]);
  const [editTime, setEditTime] = useState("00:00");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const handleSave = () => {
    const combinedDate = new Date(`${editDate}T${editTime}`);
    const isoDate = combinedDate.toISOString();
    
    setEventName(editName);
    setTargetDate(isoDate);
    
    localStorage.setItem('nexus_event_name', editName);
    localStorage.setItem('nexus_event_date', isoDate);
    
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <GlassCard title="Configure Event" className="h-full min-h-[200px]">
        <div className="flex flex-col space-y-4">
          <div>
            <label className="block text-xs text-white/50 uppercase mb-1">Event Name</label>
            <input 
              type="text" 
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded p-2 text-sm text-white focus:outline-none focus:border-teal-400"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-white/50 uppercase mb-1">Date</label>
              <input 
                type="date" 
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded p-2 text-sm text-white focus:outline-none focus:border-teal-400"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 uppercase mb-1">Time</label>
              <input 
                type="time" 
                value={editTime}
                onChange={(e) => setEditTime(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded p-2 text-sm text-white focus:outline-none focus:border-teal-400"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-2">
            <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-white/10 rounded text-white/60">
              <X className="w-4 h-4" />
            </button>
            <button onClick={handleSave} className="flex items-center px-4 py-2 bg-teal-500/20 text-teal-300 rounded hover:bg-teal-500/30 transition-colors">
              <Save className="w-4 h-4 mr-2" /> Save
            </button>
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard 
      title="T-Minus Countdown" 
      className="h-full min-h-[180px]"
      action={
        <button onClick={() => setIsEditing(true)} className="text-white/40 hover:text-teal-400 transition-colors">
          <Edit2 className="w-3 h-3" />
        </button>
      }
    >
      <div className="flex flex-col h-full justify-center">
        <h3 className="text-center text-xl font-light text-blue-200 mb-6 tracking-wide">{eventName}</h3>
        
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-black/20 rounded-lg p-2 backdrop-blur-sm">
            <div className="text-2xl font-bold text-white">{timeLeft.days}</div>
            <div className="text-[10px] uppercase text-white/40 tracking-wider">Days</div>
          </div>
          <div className="bg-black/20 rounded-lg p-2 backdrop-blur-sm">
            <div className="text-2xl font-bold text-white">{timeLeft.hours}</div>
            <div className="text-[10px] uppercase text-white/40 tracking-wider">Hrs</div>
          </div>
          <div className="bg-black/20 rounded-lg p-2 backdrop-blur-sm">
            <div className="text-2xl font-bold text-white">{timeLeft.minutes}</div>
            <div className="text-[10px] uppercase text-white/40 tracking-wider">Mins</div>
          </div>
          <div className="bg-black/20 rounded-lg p-2 backdrop-blur-sm relative overflow-hidden">
             <div className="absolute inset-0 bg-teal-500/10 animate-pulse"></div>
            <div className="relative text-2xl font-bold text-teal-400">{timeLeft.seconds}</div>
            <div className="relative text-[10px] uppercase text-teal-400/60 tracking-wider">Secs</div>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-center text-xs text-white/30 space-x-2">
          <Calendar className="w-3 h-3" />
          <span>{new Date(targetDate).toLocaleDateString()}</span>
          <Clock className="w-3 h-3 ml-2" />
          <span>{new Date(targetDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        </div>
      </div>
    </GlassCard>
  );
};