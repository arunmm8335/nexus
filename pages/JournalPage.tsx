
import React, { useState, useEffect } from 'react';
import { Camera, Video, Send, Image as ImageIcon, Smile, MoreHorizontal, Trash2 } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { JournalEntry } from '../types';

export const JournalPage: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('nexus_journal');
    if (saved) {
      return JSON.parse(saved);
    }
    // Default example entries
    return [
      {
        id: 'init-002',
        date: new Date().toISOString(),
        text: "Late night optimization session. 🌙\n\nFinally managed to stabilize the chart rendering on the Finance module. The layout engine was causing some re-render loops, but isolating the components seems to have fixed it.\n\nReward: 30 mins of gaming before reviewing the Algorithms assignment. Budget is tight this month, so cooking dinner at home.",
        mood: 'Productive'
      },
      {
        id: 'init-001',
        date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        text: "Day 1. Initialization complete.\n\nSystems are optimal. Completed the refactoring of the backend earlier today. Hydration levels were steady, though caffeine intake exceeded recommended parameters.\n\nThe dark mode aesthetic is really helping with eye strain during these long sessions.",
        mood: 'Focused'
      }
    ];
  });
  const [newEntryText, setNewEntryText] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);

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
      mood: 'Neutral' // Could expand to mood selector
    };

    setEntries([entry, ...entries]);
    setNewEntryText('');
    setMediaFile(null);
    setMediaPreview(null);
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Input Area */}
      <GlassCard className="p-0 overflow-hidden border-sky-500/20 shadow-sky-500/5 group hover:border-sky-500/40 transition-colors">
        <div className="p-4 bg-slate-900/50">
          <textarea 
            className="w-full bg-transparent border-none focus:ring-0 text-slate-200 placeholder-slate-500 resize-none h-32 text-lg"
            placeholder="Log your experience, Commander..."
            value={newEntryText}
            onChange={e => setNewEntryText(e.target.value)}
          />
          
          {mediaPreview && (
             <div className="relative inline-block mt-2 rounded-xl overflow-hidden border border-slate-700">
               {mediaFile?.type.startsWith('video') ? (
                 <video src={mediaPreview} className="h-32 w-auto object-cover" controls />
               ) : (
                 <img src={mediaPreview} alt="Preview" className="h-32 w-auto object-cover" />
               )}
               <button 
                  onClick={() => { setMediaFile(null); setMediaPreview(null); }}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-red-500/80 transition-colors"
               >
                 <XIcon className="w-3 h-3" />
               </button>
             </div>
          )}
        </div>
        
        <div className="bg-slate-900/80 border-t border-slate-800 p-3 flex justify-between items-center backdrop-blur-md">
          <div className="flex gap-2">
            <label className="p-2 text-slate-400 hover:text-sky-400 hover:bg-sky-500/10 rounded-full cursor-pointer transition-colors" title="Add Image">
              <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
              <Camera className="w-5 h-5" />
            </label>
             <label className="p-2 text-slate-400 hover:text-sky-400 hover:bg-sky-500/10 rounded-full cursor-pointer transition-colors" title="Add Video">
              <input type="file" className="hidden" accept="video/*" onChange={handleFileSelect} />
              <Video className="w-5 h-5" />
            </label>
            <button className="p-2 text-slate-400 hover:text-sky-400 hover:bg-sky-500/10 rounded-full transition-colors">
              <Smile className="w-5 h-5" />
            </button>
          </div>
          <button 
            onClick={addEntry}
            disabled={!newEntryText && !mediaFile}
            className="px-6 py-2 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-400 transition-all shadow-lg shadow-sky-500/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Log Entry <Send className="w-4 h-4" />
          </button>
        </div>
      </GlassCard>

      {/* Timeline */}
      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
        {entries.map((entry) => (
          <div key={entry.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            
            {/* Icon */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-700 bg-slate-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-slate-400 group-hover:border-sky-500 group-hover:text-sky-400 transition-colors">
               {entry.mediaType === 'video' ? <Video className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
            </div>
            
            {/* Content */}
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 shadow-xl backdrop-blur-sm transition-transform hover:scale-[1.01]">
               <div className="flex justify-between items-start mb-2">
                 <time className="font-mono text-xs text-sky-400 font-bold tracking-wide">{new Date(entry.date).toLocaleString()}</time>
                 <button onClick={() => deleteEntry(entry.id)} className="text-slate-600 hover:text-red-400 transition-colors p-1">
                   <Trash2 className="w-4 h-4" />
                 </button>
               </div>
               
               <p className="text-slate-200 leading-relaxed mb-4 whitespace-pre-wrap text-sm md:text-base">{entry.text}</p>
               
               {entry.mediaUrl && (
                 <div className="rounded-lg overflow-hidden border border-slate-700/50 shadow-lg bg-black/40">
                   {entry.mediaType === 'video' ? (
                     <video src={entry.mediaUrl} controls className="w-full h-auto max-h-[400px]" />
                   ) : (
                     <img src={entry.mediaUrl} alt="Entry media" className="w-full h-auto max-h-[400px] object-cover" />
                   )}
                 </div>
               )}
            </div>

          </div>
        ))}
        {entries.length === 0 && (
          <div className="text-center py-20">
             <div className="inline-flex p-4 rounded-full bg-slate-800/50 mb-4">
                <ImageIcon className="w-8 h-8 text-slate-600" />
             </div>
             <p className="text-slate-500 italic">No memories logged yet. Start capturing your journey.</p>
          </div>
        )}
      </div>

    </div>
  );
};

const XIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
