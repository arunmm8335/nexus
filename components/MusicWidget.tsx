
import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Disc, Volume2 } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface Track {
  title: string;
  artist: string;
  genre: string;
  coverColor: string;
}

const PLAYLIST: Track[] = [
  { title: "Neural Link v2.0", artist: "Nexus Systems", genre: "Lo-Fi / Study", coverColor: "bg-sky-500" },
  { title: "Midnight City", artist: "M83 (AI Ver.)", genre: "Synthwave", coverColor: "bg-purple-500" },
  { title: "Quantum Focus", artist: "Deep Mind", genre: "Alpha Waves", coverColor: "bg-emerald-500" },
];

export const MusicWidget: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  const currentTrack = PLAYLIST[currentTrackIdx];

  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const nextTrack = () => {
    setCurrentTrackIdx((prev) => (prev + 1) % PLAYLIST.length);
    setProgress(0);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIdx((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    setProgress(0);
    setIsPlaying(true);
  };

  return (
    <GlassCard title="Audio Stream" className="min-h-[180px]">
      <div className="flex flex-col h-full justify-between gap-4">
        
        {/* Track Info */}
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${currentTrack.coverColor} shadow-[0_0_15px_rgba(255,255,255,0.1)]`}>
            <Disc className={`w-6 h-6 text-white ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
          </div>
          <div className="overflow-hidden">
            <div className="text-sm font-bold text-white truncate">{currentTrack.title}</div>
            <div className="text-xs text-neutral-500 truncate">{currentTrack.artist}</div>
            <div className="text-[10px] text-neutral-600 uppercase tracking-wider mt-0.5">{currentTrack.genre}</div>
          </div>
        </div>

        {/* Visualizer & Progress */}
        <div className="space-y-2">
           <div className="flex items-end justify-between h-8 px-1 gap-1">
             {[...Array(20)].map((_, i) => (
               <div 
                  key={i} 
                  className={`w-1 bg-neutral-700 rounded-t-sm transition-all duration-300 ${isPlaying ? 'bg-neutral-200' : ''}`}
                  style={{ 
                    height: isPlaying ? `${Math.max(20, Math.random() * 100)}%` : '20%',
                    opacity: isPlaying ? 1 : 0.3
                  }}
               ></div>
             ))}
           </div>
           
           <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
             <div className="h-full bg-white transition-all duration-300" style={{ width: `${progress}%` }}></div>
           </div>
           <div className="flex justify-between text-[10px] text-neutral-600 font-mono">
             <span>0:{Math.floor(progress / 100 * 180 / 60).toString().padStart(2, '0')}:{Math.floor(progress / 100 * 180 % 60).toString().padStart(2, '0')}</span>
             <span>3:00</span>
           </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <button className="text-neutral-500 hover:text-white transition-colors">
            <Volume2 className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-4">
            <button onClick={prevTrack} className="text-neutral-400 hover:text-white transition-colors">
              <SkipBack className="w-5 h-5" />
            </button>
            <button 
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-neutral-200 transition-colors active:scale-95"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>
            <button onClick={nextTrack} className="text-neutral-400 hover:text-white transition-colors">
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          <div className="w-4"></div> {/* Spacer for alignment */}
        </div>

      </div>
    </GlassCard>
  );
};
