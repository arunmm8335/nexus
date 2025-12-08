
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Disc, Volume2, VolumeX } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface Track {
  title: string;
  artist: string;
  genre: string;
  coverColor: string;
  url: string;
}

const PLAYLIST: Track[] = [
  { 
    title: "Lofi Study", 
    artist: "FASSounds", 
    genre: "Lo-Fi / Chill", 
    coverColor: "bg-sky-500",
    url: "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3"
  },
  { 
    title: "Cyberpunk City", 
    artist: "Grand Project", 
    genre: "Synthwave", 
    coverColor: "bg-purple-500",
    url: "https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a73467.mp3"
  },
  { 
    title: "Deep Focus", 
    artist: "Coma-Media", 
    genre: "Ambient", 
    coverColor: "bg-emerald-500",
    url: "https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d0.mp3"
  },
];

export const MusicWidget: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Audio
  useEffect(() => {
    audioRef.current = new Audio(PLAYLIST[0].url);
    audioRef.current.volume = 0.5;

    const updateTime = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
        setDuration(audioRef.current.duration || 0);
      }
    };

    const handleEnded = () => {
      handleNext();
    };

    audioRef.current.addEventListener('timeupdate', updateTime);
    audioRef.current.addEventListener('ended', handleEnded);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('timeupdate', updateTime);
        audioRef.current.removeEventListener('ended', handleEnded);
      }
    };
  }, []);

  // Handle Track Changes
  useEffect(() => {
    if (audioRef.current) {
      if (audioRef.current.src !== PLAYLIST[currentTrackIdx].url) {
        audioRef.current.src = PLAYLIST[currentTrackIdx].url;
        audioRef.current.load();
        if (isPlaying) {
          audioRef.current.play().catch(e => {
            console.error("Autoplay prevented", e);
            setIsPlaying(false);
          });
        }
      }
    }
  }, [currentTrackIdx]);

  // Handle Play/Pause State
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.error("Play failed", e);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Handle Mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const handleNext = () => {
    setCurrentTrackIdx((prev) => (prev + 1) % PLAYLIST.length);
  };

  const handlePrev = () => {
    setCurrentTrackIdx((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;
  const currentTrack = PLAYLIST[currentTrackIdx];

  return (
    <GlassCard title="Audio Stream" className="min-h-[180px]">
      <div className="flex flex-col h-full justify-between gap-4">
        
        {/* Track Info */}
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${currentTrack.coverColor} shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-colors duration-500`}>
            <Disc className={`w-6 h-6 text-white ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
          </div>
          <div className="overflow-hidden">
            <div className="text-sm font-bold truncate" style={{ color: 'var(--text-main)' }}>{currentTrack.title}</div>
            <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{currentTrack.artist}</div>
            <div className="text-[10px] uppercase tracking-wider mt-0.5 opacity-60" style={{ color: 'var(--text-muted)' }}>{currentTrack.genre}</div>
          </div>
        </div>

        {/* Visualizer & Progress */}
        <div className="space-y-2">
           {/* Visualizer */}
           <div className="flex items-end justify-between h-8 px-1 gap-1">
             {[...Array(20)].map((_, i) => (
               <div 
                  key={i} 
                  className={`w-1 rounded-t-sm transition-all duration-300 ${isPlaying ? 'bg-sky-400' : 'bg-neutral-600'}`}
                  style={{ 
                    height: isPlaying ? `${Math.max(10, Math.random() * 100)}%` : '10%',
                    opacity: isPlaying ? 0.8 : 0.3
                  }}
               ></div>
             ))}
           </div>
           
           {/* Progress Bar */}
           <div 
             className="h-1 bg-neutral-800 rounded-full overflow-hidden cursor-pointer group" 
             onClick={(e) => {
               if (audioRef.current && duration) {
                 const rect = e.currentTarget.getBoundingClientRect();
                 const x = e.clientX - rect.left;
                 const width = rect.width;
                 const newTime = (x / width) * duration;
                 audioRef.current.currentTime = newTime;
                 setCurrentTime(newTime);
               }
             }}
           >
             <div className="h-full bg-sky-400 transition-all duration-100 ease-linear group-hover:bg-sky-300" style={{ width: `${progressPercent}%` }}></div>
           </div>
           
           <div className="flex justify-between text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
             <span>{formatTime(currentTime)}</span>
             <span>{formatTime(duration)}</span>
           </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setIsMuted(!isMuted)} 
            className="hover:text-white transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          
          <div className="flex items-center gap-4">
            <button onClick={handlePrev} className="hover:text-white transition-colors" style={{ color: 'var(--text-muted)' }}>
              <SkipBack className="w-5 h-5" />
            </button>
            <button 
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-neutral-200 transition-colors active:scale-95 shadow-lg shadow-white/10"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>
            <button onClick={handleNext} className="hover:text-white transition-colors" style={{ color: 'var(--text-muted)' }}>
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          <div className="w-4"></div> {/* Spacer for alignment */}
        </div>

      </div>
    </GlassCard>
  );
};
