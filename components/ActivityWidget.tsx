import React, { useEffect, useState } from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { Activity, GitCommit, Settings, Save, LogOut } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { ActivityPoint } from '../types';
import { getStoredAuth, saveAuth, clearAuth, fetchUserContributions } from '../services/githubService';

export const ActivityWidget: React.FC = () => {
  const [data, setData] = useState<ActivityPoint[]>([]);
  const [totalCommits, setTotalCommits] = useState(0);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Auth State
  const [needsAuth, setNeedsAuth] = useState(true);
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchUserContributions();
      setData(result.points);
      setTotalCommits(result.total);
      setStreak(result.streak);
      setNeedsAuth(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load data");
      setNeedsAuth(true); // Assuming failure might be auth related
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const { username: storedUser, token: storedToken } = getStoredAuth();
    if (storedUser && storedToken) {
      setNeedsAuth(false);
      setUsername(storedUser);
      setToken(storedToken);
      loadData();
    } else {
      setNeedsAuth(true);
    }
  }, []);

  const handleSaveAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    saveAuth(username, token);
    setShowSettings(false);
    await loadData();
  };

  const handleLogout = () => {
    clearAuth();
    setNeedsAuth(true);
    setData([]);
    setTotalCommits(0);
    setStreak(0);
    setUsername('');
    setToken('');
    setShowSettings(false);
  };

  if (needsAuth || showSettings) {
    return (
      <GlassCard 
        title="GitHub Link" 
        className="h-full min-h-[250px]"
        action={
          !needsAuth && (
            <button onClick={() => setShowSettings(false)} className="text-white/50 hover:text-white">
              <Activity className="w-4 h-4" />
            </button>
          )
        }
      >
        <div className="flex flex-col h-full justify-center">
          <form onSubmit={handleSaveAuth} className="space-y-4">
            <div className="text-center mb-4">
              <div className="bg-white/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <GitCommit className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm text-white/60">Enter credentials to track contributions.</p>
            </div>
            
            <div>
              <label className="text-xs text-white/40 uppercase font-bold">Username</label>
              <input 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded p-2 text-white focus:outline-none focus:border-green-500/50"
                placeholder="octocat"
              />
            </div>
            
            <div>
              <label className="text-xs text-white/40 uppercase font-bold">Personal Access Token</label>
              <input 
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded p-2 text-white focus:outline-none focus:border-green-500/50"
                placeholder="ghp_..."
              />
              <p className="text-[10px] text-white/30 mt-1">Requires 'repo' and 'read:user' scopes.</p>
            </div>

            <div className="flex gap-2 pt-2">
              {!needsAuth && (
                <button type="button" onClick={handleLogout} className="flex-1 py-2 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 flex items-center justify-center">
                  <LogOut className="w-4 h-4 mr-2" /> Unlink
                </button>
              )}
              <button type="submit" className="flex-1 py-2 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 flex items-center justify-center">
                <Save className="w-4 h-4 mr-2" /> Connect
              </button>
            </div>
          </form>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard 
      title="Productivity Velocity" 
      className="h-full min-h-[250px]"
      action={
        <button onClick={() => setShowSettings(true)} className="text-white/30 hover:text-white transition-colors">
          <Settings className="w-4 h-4" />
        </button>
      }
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-green-500/10 p-3 rounded-full border border-green-500/20 relative">
            <Activity className="w-6 h-6 text-green-400" />
            <div className="absolute inset-0 bg-green-500/10 rounded-full animate-pulse-slow"></div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{totalCommits}</div>
            <div className="text-xs text-white/40 uppercase tracking-wide">Total (Year)</div>
          </div>
           <div className="flex-1 text-right">
             <div className="flex flex-col items-end">
                <div className="flex items-center text-green-400 text-xl font-mono font-bold drop-shadow-sm">
                   <GitCommit className="w-5 h-5 mr-1" /> {streak}
                </div>
                <div className="text-[10px] text-white/40 uppercase tracking-widest">Day Streak</div>
             </div>
          </div>
        </div>

        <div className="flex-1 w-full min-h-[100px] -ml-2">
          {loading ? (
             <div className="h-full flex items-center justify-center text-white/30 text-sm animate-pulse">
               Syncing with GitHub...
             </div>
          ) : error ? (
            <div className="h-full flex items-center justify-center text-red-400/80 text-sm text-center px-4">
              {error}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000000', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#34d399' }}
                  cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                />
                <XAxis dataKey="day" hide />
                <Area 
                  type="monotone" 
                  dataKey="commits" 
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorCommits)" 
                  strokeWidth={2}
                  activeDot={{ r: 4, strokeWidth: 0, fill: '#fff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </GlassCard>
  );
};