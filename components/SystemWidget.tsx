
import React, { useState, useEffect } from 'react';
import { Wifi, Server, Database, Shield, Zap, Activity } from 'lucide-react';
import { GlassCard } from './GlassCard';

export const SystemWidget: React.FC = () => {
  const [metrics, setMetrics] = useState({
    netUp: 1.2,
    netDown: 4.5,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setMetrics(prev => ({
        netUp: Math.max(0, prev.netUp + (Math.random() * 5 - 2.5)),
        netDown: Math.max(0, prev.netDown + (Math.random() * 10 - 5)),
      }));
    }, 500);
    return () => clearInterval(timer);
  }, []);

  return (
    <GlassCard title="Network Traffic & Systems" className="min-h-[220px]">
      <div className="flex flex-col h-full gap-6">
        
        {/* Network Visualizer */}
        <div className="flex-1 rounded-xl p-4 border relative overflow-hidden group" style={{ backgroundColor: 'rgba(0,0,0,0.4)', borderColor: 'var(--glass-border)' }}>
           
           {/* Header Overlay */}
           <div className="flex justify-between items-start mb-2 relative z-10">
              <div className="flex items-center gap-2 text-xs text-sky-400 font-bold uppercase tracking-widest">
                <Activity className="w-4 h-4" /> Live Data Stream
              </div>
              <div className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                <span className="text-emerald-400">TX: {metrics.netUp.toFixed(1)} MB/s</span>
                <span className="mx-2">|</span>
                <span className="text-sky-400">RX: {metrics.netDown.toFixed(1)} MB/s</span>
              </div>
           </div>

           {/* Graph Bars */}
           <div className="flex items-end justify-between h-24 gap-1 relative z-10">
              {[...Array(50)].map((_, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-gradient-to-t from-sky-600/20 to-sky-400/80 rounded-t-sm transition-all duration-300 ease-in-out"
                  style={{ 
                    height: `${Math.max(5, Math.random() * 100)}%`,
                    opacity: Math.random() * 0.7 + 0.3
                  }}
                ></div>
              ))}
           </div>
           
           {/* Background Grid Effect */}
           <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center justify-between px-3 py-2 rounded border" style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--glass-border)' }}>
                <span className="text-[10px] uppercase flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                  <Database className="w-3 h-3" /> Database
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
            </div>
            <div className="flex items-center justify-between px-3 py-2 rounded border" style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--glass-border)' }}>
                <span className="text-[10px] uppercase flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                  <Shield className="w-3 h-3" /> Firewall
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
            </div>
            <div className="flex items-center justify-between px-3 py-2 rounded border" style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--glass-border)' }}>
                <span className="text-[10px] uppercase flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                  <Zap className="w-3 h-3" /> Power
                </span>
                <span className="text-[10px] text-yellow-500 font-mono font-bold">STABLE</span>
            </div>
            <div className="flex items-center justify-between px-3 py-2 rounded border" style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--glass-border)' }}>
                <span className="text-[10px] uppercase flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                  <Server className="w-3 h-3" /> Uptime
                </span>
                <span className="text-[10px] text-sky-500 font-mono">99.9%</span>
            </div>
        </div>

      </div>
    </GlassCard>
  );
};
