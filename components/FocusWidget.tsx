
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Zap } from 'lucide-react';
import { GlassCard } from './GlassCard';

export const FocusWidget: React.FC = () => {
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const FOCUS_TIME = 25 * 60;
  const BREAK_TIME = 5 * 60;

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Optional: Play sound or notification here
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? FOCUS_TIME : BREAK_TIME);
  };

  const switchMode = (newMode: 'focus' | 'break') => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'focus' ? FOCUS_TIME : BREAK_TIME);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((mode === 'focus' ? FOCUS_TIME : BREAK_TIME) - timeLeft) / (mode === 'focus' ? FOCUS_TIME : BREAK_TIME) * 100;

  return (
    <GlassCard title="Focus Protocol" className="min-h-[200px]">
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        
        {/* Mode Toggles */}
        <div className="flex p-1 bg-neutral-900 rounded-lg border border-neutral-800">
          <button 
            onClick={() => switchMode('focus')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${mode === 'focus' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            <Zap className="w-3 h-3" /> Work
          </button>
          <button 
            onClick={() => switchMode('break')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${mode === 'break' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            <Coffee className="w-3 h-3" /> Rest
          </button>
        </div>

        {/* Timer Display */}
        <div className="relative group">
           <div className="text-6xl font-mono font-bold text-white tracking-tighter tabular-nums drop-shadow-lg">
             {formatTime(timeLeft)}
           </div>
           {/* Progress Bar under timer */}
           <div className="absolute -bottom-2 left-0 right-0 h-1 bg-neutral-800 rounded-full overflow-hidden">
             <div 
               className={`h-full transition-all duration-1000 ${mode === 'focus' ? 'bg-sky-500' : 'bg-green-500'}`} 
               style={{ width: `${progress}%` }}
             ></div>
           </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mt-2">
          <button 
            onClick={toggleTimer}
            className={`p-4 rounded-full border transition-all active:scale-95 ${isActive ? 'bg-neutral-800 border-neutral-700 text-red-400 hover:border-red-500/50' : 'bg-white text-black border-white hover:bg-neutral-200'}`}
          >
            {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current" />}
          </button>
          
          <button 
            onClick={resetTimer}
            className="p-3 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>
    </GlassCard>
  );
};
