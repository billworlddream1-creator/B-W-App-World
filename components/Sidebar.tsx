
import React from 'react';
import { AppView } from '../types';
import { APP_NAME } from '../constants';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  userRole: 'user' | 'admin';
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, userRole }) => {
  const menuItems = [
    { id: 'dashboard', icon: 'fa-solid fa-grid-2', label: 'Dashboard' },
    { id: 'academy', icon: 'fa-solid fa-graduation-cap', label: 'Academy' },
    { id: 'tts', icon: 'fa-solid fa-waveform-lines', label: 'Voice Lab' },
    { id: 'image', icon: 'fa-solid fa-camera-retro', label: 'Image Forge' },
    { id: 'video', icon: 'fa-solid fa-film-canister', label: 'Video Studio' },
    { id: 'ppt', icon: 'fa-solid fa-presentation-screen', label: 'Slide Nexus' },
    { id: 'history', icon: 'fa-solid fa-box-archive', label: 'History' },
    { id: 'pricing', icon: 'fa-solid fa-medal', label: 'Upgrade' },
  ];

  if (userRole === 'admin') {
    menuItems.push({ id: 'admin', icon: 'fa-solid fa-terminal', label: 'Admin Panel' });
  }

  return (
    <aside className="w-72 glass-morphism border-r border-white/10 flex-col hidden md:flex z-20 bg-black">
      <div className="p-8 flex items-center gap-4">
        <div className="h-11 w-11 rounded-2xl bg-white flex items-center justify-center shadow-xl shadow-white/10">
          <i className="fa-solid fa-b text-xl text-black"></i>
        </div>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight leading-none uppercase">B&W Artifi</h1>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">AI Platform</span>
        </div>
      </div>

      <nav className="flex-1 mt-4 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id as AppView)}
            className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${
              currentView === item.id 
                ? 'bg-white text-black shadow-lg' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <i className={`${item.icon} text-lg transition-transform group-hover:scale-110 ${currentView === item.id ? 'text-black' : 'text-slate-500'}`}></i>
            <span className="font-bold text-xs uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6">
        <div className="p-5 rounded-[2rem] border border-white/10 relative overflow-hidden group bg-gradient-to-br from-white/5 to-transparent">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/5 blur-2xl group-hover:bg-white/10 transition-all"></div>
          <p className="text-xs font-bold text-white mb-2 uppercase tracking-tighter">Premium Access</p>
          <p className="text-[10px] leading-relaxed text-slate-500 mb-4">Unlock more features and increase your daily limits.</p>
          <button onClick={() => setView('pricing')} className="text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-2 hover:gap-3 transition-all">
            View Plans <i className="fa-solid fa-arrow-right-long text-slate-400"></i>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
