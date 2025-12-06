
import React, { useEffect, useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { getDailyQuote } from '../services/geminiService';
import { QuoteData } from '../types';

export const QuoteWidget: React.FC = () => {
  const [quote, setQuote] = useState<QuoteData>({ text: "Initializing wisdom protocols...", author: "Nexus" });
  const [loading, setLoading] = useState(false);

  const fetchNewQuote = async () => {
    setLoading(true);
    const data = await getDailyQuote();
    setQuote(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchNewQuote();
  }, []);

  return (
    <GlassCard 
      className="h-full min-h-[150px] justify-center relative overflow-hidden"
      action={
        <button onClick={fetchNewQuote} disabled={loading} className="text-neutral-600 hover:text-white transition-colors">
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
        </button>
      }
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neutral-700 to-transparent opacity-30"></div>
      
      <div className="relative z-10 text-center flex flex-col items-center">
        <div className="mb-4 p-2 bg-white/5 rounded-full animate-pulse-slow">
           <Sparkles className="w-4 h-4 text-neutral-400" />
        </div>
        <blockquote className="text-sm md:text-base font-light italic leading-relaxed text-neutral-300 max-w-prose">
          "{quote.text}"
        </blockquote>
        <div className="mt-4 flex items-center gap-2">
          <div className="h-px w-6 bg-gradient-to-r from-transparent to-neutral-700"></div>
          <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
            {quote.author}
          </div>
          <div className="h-px w-6 bg-gradient-to-l from-transparent to-neutral-700"></div>
        </div>
      </div>
    </GlassCard>
  );
};
