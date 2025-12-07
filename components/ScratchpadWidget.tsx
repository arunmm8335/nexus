
import React, { useState, useEffect } from 'react';
import { Save, Eraser } from 'lucide-react';
import { GlassCard } from './GlassCard';

export const ScratchpadWidget: React.FC = () => {
  const [text, setText] = useState(() => localStorage.getItem('nexus_scratchpad') || '');
  const [status, setStatus] = useState<'idle' | 'saving'>('idle');

  useEffect(() => {
    const handler = setTimeout(() => {
      localStorage.setItem('nexus_scratchpad', text);
      setStatus('idle');
    }, 1000);

    setStatus('saving');
    return () => clearTimeout(handler);
  }, [text]);

  const clearPad = () => {
    if (window.confirm("Clear neural buffer?")) {
      setText('');
    }
  };

  return (
    <GlassCard 
      title="Neural Buffer" 
      className="h-full min-h-[180px]"
      action={
        <button onClick={clearPad} className="text-neutral-500 hover:text-red-400 transition-colors">
          <Eraser className="w-3 h-3" />
        </button>
      }
    >
      <div className="relative h-full flex flex-col">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="// Temporary data stream..."
          className="flex-1 w-full bg-transparent border-none resize-none focus:ring-0 text-sm text-neutral-300 placeholder-neutral-600 font-mono leading-relaxed custom-scrollbar p-0"
          spellCheck={false}
        />
        <div className="absolute bottom-0 right-0 text-[10px] text-neutral-600 font-mono flex items-center gap-1">
          {status === 'saving' ? (
             <span className="animate-pulse text-sky-500">SYNCING...</span>
          ) : (
             <span className="opacity-50">READY</span>
          )}
        </div>
      </div>
    </GlassCard>
  );
};
