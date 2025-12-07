
import React, { useState, useEffect } from 'react';
import { Camera, Video, Send, Image as ImageIcon, Trash2, X, Zap, Cloud, Coffee, Sun } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { JournalEntry } from '../types';

export const JournalPage: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('nexus_journal');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      {
        id: 'init-002',
        date: new Date().toISOString(),
        text: "Late night optimization session. 🌙\n\nFinally managed to stabilize the chart rendering on the Finance module. The layout engine was causing some re-render loops, but isolating the components seems to have fixed it.\n\nReward: 30 mins of gaming before reviewing the Algorithms assignment. Budget is tight this month, so cooking dinner at home.",
        mood: 'Productive'
      },
      {
        id: 'init-001',
        date: new Date(Date.now() - 86400000).toISOString(),
        text: "Day 1. Initialization complete.\n\nSystems are optimal. Completed the refactoring of the backend earlier today. Hydration levels were steady, though caffeine intake exceeded recommended parameters.\n\nThe dark mode aesthetic is really helping with eye strain during these long sessions.",
        mood: 'Focused'
      }
    ];
  });
  const [newEntryText, setNewEntryText] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string>('Neutral');

  useEffect(() => {
    localStorage.setItem('nexus_journal', JSON.stringify(entries));
  }, [entries]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMediaFile(file);
      setMediaPreview(URL.createObjectURL(file));
    }
  };

  const addEntry = () => {
    if (!newEntryText.trim() && !mediaFile) return;

    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      text: newEntryText,
      mediaUrl: mediaPreview || undefined,
      mediaType: mediaFile?.type.startsWith('video') ? 'video' : 'image',
      mood: selectedMood
    };

    setEntries([entry, ...entries]);
    setNewEntryText('');
    setMediaFile(null);
    setMediaPreview(null);
    setSelectedMood('Neutral'); // Reset mood
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const moods = [
    { label: 'Productive', icon: Zap, color: 'text-yellow-400' },
    { label: 'Focused', icon: Coffee, color: 'text-amber-600' },
    { label: 'Happy', icon: Sun, color: 'text-orange-400' },
    { label: 'Neutral', icon: Cloud, color: 'text-slate-400' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Input Area */}
      <GlassCard className="p-0 overflow-hidden shadow-sky-500/5 group hover:border-white/20 transition-colors">
        <div className="p-6" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
          <textarea 
            className="w-full bg-transparent border-none focus:ring-0 placeholder-neutral-500 resize-none h-40 text-sm md:text-base leading-relaxed custom-scrollbar"
            style={{ color: 'var(--text-main)' }}
            placeholder="Log your experience, Commander..."
            value={newEntryText}
            onChange={e => setNewEntryText(e.target.value)}
          />
          
          {mediaPreview && (
             <div className="relative inline-block mt-4 rounded-xl overflow-hidden border border-white/10">
               {mediaFile?.type.startsWith('video') ? (
                 <video src={mediaPreview} className="h-48 w-auto object-cover" controls />
               ) : (
                 <img src={mediaPreview} alt="Preview" className="h-48 w-auto object-cover" />
               )}
               <button 
                  onClick={() => { setMediaFile(null); setMediaPreview(null); }}
                  className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 hover:bg-red-500/80 transition-colors backdrop-blur-sm"
               >
                 <X className="w-4 h-4" />
               </button>
             </div>
          )}
        </div>
        
        <div className="border-t p-4 flex flex-col md:flex-row justify-between items-center gap-4 backdrop-blur-md" style={{ borderColor: 'var(--glass-border)', backgroundColor: 'var(--glass-bg)' }}>
          
          <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
             <div className="flex gap-2 pr-4 border-r" style={{ borderColor: 'var(--glass-border)' }}>
               <label className="p-2 hover:bg-white/10 rounded-full cursor-pointer transition-colors" title="Add Image" style={{ color: 'var(--text-muted)' }}>
                 <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
                 <Camera className="w-5 h-5" />
               </label>
                <label className="p-2 hover:bg-white/10 rounded-full cursor-pointer transition-colors" title="Add Video" style={{ color: 'var(--text-muted)' }}>
                 <input type="file" className="hidden" accept="video/*" onChange={handleFileSelect} />
                 <Video className="w-5 h-5" />
               </label>
             </div>

             <div className="flex gap-2 items-center">
                <span className="text-xs font-bold uppercase tracking-wider mr-2" style={{ color: 'var(--text-muted)' }}>Mood:</span>
                {moods.map((m) => (
                  <button
                    key={m.label}
                    onClick={() => setSelectedMood(m.label)}
                    className={`p-1.5 rounded-lg border transition-all ${selectedMood === m.label ? 'bg-white/10 border-white/30 scale-110' : 'border-transparent hover:bg-white/5 opacity-50 hover:opacity-100'}`}
                    title={m.label}
                  >
                    <m.icon className={`w-4 h-4 ${m.color}`} />
                  </button>
                ))}
             </div>
          </div>

          <button 
            onClick={addEntry}
            disabled={!newEntryText && !mediaFile}
            className="w-full md:w-auto px-6 py-2 bg-sky-600/90 text-white font-semibold rounded-lg hover:bg-sky-500 transition-all shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Log Entry <Send className="w-4 h-4" />
          </button>
        </div>
      </GlassCard>

      {/* Timeline */}
      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:to-transparent" style={{ '--tw-gradient-via': 'var(--glass-border)' } as any}>
        {entries.map((entry, index) => {
          const isEven = index % 2 === 0;
          return (
            <div 
              key={entry.id} 
              className={`
                relative flex items-start justify-between 
                ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}
              `}
            >
              
              {/* Icon */}
              <div 
                className={`
                  flex items-center justify-center w-10 h-10 rounded-full border shadow shrink-0 z-10 transition-colors mt-3
                  ${isEven ? 'md:translate-x-1/2 md:order-1' : 'md:-translate-x-1/2 md:order-1'}
                `}
                style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)', color: 'var(--text-muted)' }}
              >
                 {entry.mediaType === 'video' ? <Video className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
              </div>
              
              {/* Content Card */}
              <div 
                className={`
                  w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] 
                  p-6 rounded-2xl border shadow-xl backdrop-blur-sm transition-transform hover:scale-[1.01]
                  ${isEven ? '' : 'md:text-left'} 
                `}
                style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }}
              >
                 <div className="flex justify-between items-start mb-2">
                   <div className="flex items-center gap-2">
                      <time className="font-mono text-xs font-bold tracking-wide text-sky-500">{new Date(entry.date).toLocaleString()}</time>
                      {entry.mood && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-white/5 border border-white/10" style={{ color: 'var(--text-muted)' }}>
                          {entry.mood}
                        </span>
                      )}
                   </div>
                   <button onClick={() => deleteEntry(entry.id)} className="hover:text-red-400 transition-colors p-1" style={{ color: 'var(--text-muted)' }}>
                     <Trash2 className="w-4 h-4" />
                   </button>
                 </div>
                 
                 <p className="leading-relaxed mb-4 whitespace-pre-wrap text-sm md:text-base" style={{ color: 'var(--text-main)' }}>{entry.text}</p>
                 
                 {entry.mediaUrl && (
                   <div className="rounded-lg overflow-hidden border shadow-lg bg-black/40" style={{ borderColor: 'var(--glass-border)' }}>
                     {entry.mediaType === 'video' ? (
                       <video src={entry.mediaUrl} controls className="w-full h-auto max-h-[400px]" />
                     ) : (
                       <img src={entry.mediaUrl} alt="Entry media" className="w-full h-auto max-h-[400px] object-cover" />
                     )}
                   </div>
                 )}
              </div>

            </div>
          );
        })}
        
        {entries.length === 0 && (
          <div className="text-center py-20">
             <div className="inline-flex p-4 rounded-full mb-4 border" style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }}>
                <ImageIcon className="w-8 h-8 opacity-50" style={{ color: 'var(--text-muted)' }} />
             </div>
             <p className="italic" style={{ color: 'var(--text-muted)' }}>No memories logged yet. Start capturing your journey.</p>
          </div>
        )}
      </div>

    </div>
  );
};
