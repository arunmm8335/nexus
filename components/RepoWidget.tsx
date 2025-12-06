
import React, { useState, useEffect } from 'react';
import { Github, Star, GitFork, CircleDot, RefreshCw, Search, Lock } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { getAuthHeaders } from '../services/githubService';

interface RepoData {
  name: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  pushed_at: string;
  description: string;
  private: boolean;
}

export const RepoWidget: React.FC = () => {
  const [repoPath, setRepoPath] = useState(() => localStorage.getItem('nexus_repo_path') || 'facebook/react');
  const [data, setData] = useState<RepoData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempPath, setTempPath] = useState(repoPath);

  const fetchRepoStats = async (path: string) => {
    setLoading(true);
    setError(null);
    try {
      const headers = getAuthHeaders();
      const res = await fetch(`https://api.github.com/repos/${path}`, {
        headers: {
          ...headers,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!res.ok) {
        if (res.status === 404) throw new Error("Repo not found");
        if (res.status === 403) throw new Error("Rate limit/Auth error");
        throw new Error("Fetch failed");
      }
      const json = await res.json();
      setData(json);
      // Save valid repo to storage
      localStorage.setItem('nexus_repo_path', path);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepoStats(repoPath);
  }, [repoPath]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRepoPath(tempPath);
    setIsEditing(false);
  };

  return (
    <GlassCard 
      title="Repository Status" 
      className="h-full min-h-[240px]"
      action={
        <button onClick={() => setIsEditing(!isEditing)} className="text-white/40 hover:text-white transition-colors">
          {isEditing ? <Search className="w-4 h-4" /> : <Search className="w-4 h-4" />}
        </button>
      }
    >
      {isEditing ? (
         <form onSubmit={handleSubmit} className="flex flex-col h-full justify-center space-y-4">
           <div>
             <label className="text-xs text-white/50 uppercase">Owner / Repo Name</label>
             <input 
              type="text" 
              value={tempPath}
              onChange={(e) => setTempPath(e.target.value)}
              placeholder="e.g. facebook/react"
              className="w-full mt-2 bg-white/10 border border-white/20 rounded p-3 text-white focus:outline-none focus:border-purple-400"
            />
           </div>
           <button type="submit" className="w-full py-2 bg-purple-500/20 text-purple-300 rounded hover:bg-purple-500/30">
             Track Repository
           </button>
         </form>
      ) : (
        <div className="flex flex-col h-full">
           <div className="flex items-start space-x-3 mb-6">
              <div className="p-3 bg-white/10 rounded-full relative mt-1">
                <Github className="w-6 h-6 text-white" />
                {data?.private && (
                  <div className="absolute -top-1 -right-1 bg-black rounded-full p-0.5 border border-white/20">
                    <Lock className="w-2 h-2 text-yellow-400" />
                  </div>
                )}
              </div>
              <div className="overflow-hidden">
                <div className="font-bold text-lg truncate leading-tight">{data?.name || repoPath}</div>
                <div className="text-xs text-white/40 line-clamp-2 mt-1">{data?.description || "Loading description..."}</div>
              </div>
           </div>

           {loading ? (
             <div className="flex-1 flex items-center justify-center">
               <RefreshCw className="w-6 h-6 animate-spin text-purple-400" />
             </div>
           ) : error ? (
             <div className="flex-1 flex items-center justify-center text-red-300 text-sm">
               {error}
             </div>
           ) : (
             <div className="grid grid-cols-3 gap-3 mt-auto">
                <div className="bg-black/20 rounded-lg p-3 flex flex-col items-center justify-center hover:bg-white/5 transition-colors">
                  <Star className="w-5 h-5 text-yellow-400 mb-1" />
                  <span className="font-mono font-bold text-lg">{data?.stargazers_count.toLocaleString()}</span>
                  <span className="text-[9px] uppercase text-white/30 tracking-wider">Stars</span>
                </div>
                <div className="bg-black/20 rounded-lg p-3 flex flex-col items-center justify-center hover:bg-white/5 transition-colors">
                  <GitFork className="w-5 h-5 text-blue-400 mb-1" />
                  <span className="font-mono font-bold text-lg">{data?.forks_count.toLocaleString()}</span>
                  <span className="text-[9px] uppercase text-white/30 tracking-wider">Forks</span>
                </div>
                <div className="bg-black/20 rounded-lg p-3 flex flex-col items-center justify-center hover:bg-white/5 transition-colors">
                  <CircleDot className="w-5 h-5 text-green-400 mb-1" />
                  <span className="font-mono font-bold text-lg">{data?.open_issues_count.toLocaleString()}</span>
                  <span className="text-[9px] uppercase text-white/30 tracking-wider">Issues</span>
                </div>
             </div>
           )}
           
           {data && (
             <div className="mt-4 text-[10px] text-right text-white/30">
               Last Push: {new Date(data.pushed_at).toLocaleDateString()}
             </div>
           )}
        </div>
      )}
    </GlassCard>
  );
};
