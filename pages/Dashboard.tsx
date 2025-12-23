
import React from 'react';
import { User, AppView } from '../types';

interface DashboardProps {
  user: User;
  setView: (view: AppView) => void;
  stats: { total: number; audio: number; image: number; video: number };
  themeName?: string;
  dailyShowcase?: {
    imageUrl: string;
    prompt: string;
    videoUrl?: string;
  };
}

const Dashboard: React.FC<DashboardProps> = ({ user, setView, stats, themeName, dailyShowcase }) => {
  const usagePercentage = Math.round((user.credits / user.maxCredits) * 100);

  const copyReferral = () => {
    const text = `Join B&W Artifi Ai and use my code ${user.referralCode} to get started! https://bw-artifi.ai/join?ref=${user.referralCode}`;
    navigator.clipboard.writeText(text);
    alert('Referral identity copied to clipboard.');
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black mb-2 tracking-tight">Active Node: <span className="bw-gradient-text">{user.name}</span></h1>
          <p className="text-slate-500 font-medium italic">Artisan Cycle: <span className="accent-text uppercase tracking-widest text-[10px] font-black">{themeName || 'Artisan Prime'}</span></p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 glass-morphism rounded-2xl flex items-center gap-2 border-white/5 accent-shadow">
            <span className="h-2 w-2 rounded-full accent-bg shadow-lg"></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Daily Sync Active</span>
          </div>
        </div>
      </header>

      {/* Main Stats Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-morphism p-10 rounded-[2.5rem] relative overflow-hidden group border-white/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[100px] -mr-32 -mt-32 transition-all"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10">
            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Available Compute</h3>
              <div className="flex items-baseline gap-3">
                <span className="text-7xl font-black tracking-tighter">{user.credits}</span>
                <span className="text-slate-500 text-lg font-bold">/ {user.maxCredits} OPS</span>
              </div>
            </div>
            <button 
              onClick={() => setView('pricing')}
              className="px-8 py-4 bg-white text-black hover:bg-slate-200 rounded-2xl font-black transition-all shadow-xl hover:scale-105 accent-shadow"
            >
              Recharge Node
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Allocation Capacity</span>
              <span className="text-sm font-black text-white">{usagePercentage}%</span>
            </div>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
              <div 
                className="accent-bg h-full rounded-full transition-all duration-1000 ease-out accent-shadow"
                style={{ width: `${usagePercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Daily Forge Discovery */}
        <div className="glass-morphism rounded-[2.5rem] p-6 border-white/10 relative group overflow-hidden flex flex-col justify-end min-h-[300px]">
          {dailyShowcase ? (
            <>
              <img 
                src={dailyShowcase.imageUrl} 
                className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-70 transition-all duration-1000" 
                alt="Daily Discovery"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
              <div className="relative z-10 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-white text-black text-[8px] font-black uppercase tracking-widest rounded">Daily Discovery</span>
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Synthesized 24h</span>
                </div>
                <p className="text-xs font-medium text-slate-200 line-clamp-2 leading-relaxed italic">
                  "{dailyShowcase.prompt}"
                </p>
                <button 
                  onClick={() => setView('history')}
                  className="text-[10px] font-black uppercase tracking-widest text-white hover:accent-text transition-colors flex items-center gap-2"
                >
                  Inspect Forge <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-center space-y-4 py-10">
              <i className="fa-solid fa-sparkles text-4xl text-slate-700 animate-pulse"></i>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Initializing Cycle Forge...</p>
            </div>
          )}
        </div>
      </div>

      {/* Tool Grid */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black tracking-tight flex items-center gap-3 uppercase">
          <i className="fa-solid fa-microchip text-slate-400"></i> Active Forge
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { id: 'tts', title: 'Sonic Lab', desc: 'Synthesize hyper-lifelike speech from text.', icon: 'fa-waveform-lines', color: 'bg-white' },
            { id: 'image', title: 'Vision Forge', desc: 'Craft high-contrast artistic synthetics.', icon: 'fa-camera-retro', color: 'bg-white' },
            { id: 'video', title: 'Motion Studio', desc: 'Render cinematic motion from frames.', icon: 'fa-film-canister', color: 'bg-white' },
            { id: 'ppt', title: 'Slide Nexus', desc: 'Forge professional presentation blueprints.', icon: 'fa-presentation-screen', color: 'bg-white' }
          ].map(tool => (
            <button
              key={tool.id}
              onClick={() => setView(tool.id as AppView)}
              className="group glass-morphism p-8 rounded-[2rem] text-left hover:accent-border transition-all duration-500 card-hover bg-black"
            >
              <div className={`h-12 w-12 rounded-xl bg-white flex items-center justify-center text-black mb-6 shadow-2xl transition-transform duration-500 group-hover:scale-110 accent-shadow group-hover:accent-bg group-hover:text-white`}>
                <i className={`fa-solid ${tool.icon} text-lg`}></i>
              </div>
              <h3 className="text-lg font-black mb-2 tracking-tight uppercase group-hover:accent-text transition-colors">{tool.title}</h3>
              <p className="text-slate-500 text-[10px] leading-relaxed font-medium mb-6">{tool.desc}</p>
              <div className="flex items-center text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-white transition-colors">
                Initialize <i className="fa-solid fa-arrow-right-long ml-2 group-hover:translate-x-1 transition-transform"></i>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
