
import React, { useState, useMemo, useEffect } from 'react';
import { User, AppView, AdminMessage } from '../types';
import { APP_NAME, SYSTEM_MESSAGES } from '../constants';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  setView: (view: AppView) => void;
  notificationCount: number;
  messages: AdminMessage[];
  currentView: AppView;
  salutation?: string; // New prop for personalized greeting
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, setView, notificationCount, messages, currentView, salutation }) => {
  const [showInbox, setShowInbox] = useState(false);
  const [isNewSession, setIsNewSession] = useState(true);

  // Auto-hide the specific salutation after a while to resume normal system broadcasts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsNewSession(false);
    }, 15000); // Show for 15 seconds
    return () => clearTimeout(timer);
  }, [user?.id]); // Reset when user changes

  // Randomize a normal system message if not showing the salutation
  const systemBroadcast = useMemo(() => {
    return SYSTEM_MESSAGES[Math.floor(Math.random() * SYSTEM_MESSAGES.length)];
  }, [currentView]);

  return (
    <nav className="h-20 glass-morphism border-b border-white/5 flex items-center justify-between px-8 z-30">
      <div className="flex items-center gap-4 flex-1">
        <i className="fa-solid fa-atom text-2xl text-white md:hidden" onClick={() => setView('dashboard')}></i>
        <div className="hidden md:flex flex-col">
          <span className="text-xl font-black tracking-tighter uppercase">{APP_NAME}</span>
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600">Secure Core</span>
        </div>
      </div>

      {/* Neural Broadcast - Center Piece */}
      <div className="hidden lg:flex flex-[2] justify-center px-4">
        <div className={`px-6 py-2 glass-morphism border-white/10 rounded-full flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-700 transition-all ${isNewSession && salutation ? 'accent-border bg-white/5' : ''}`}>
          {isNewSession && salutation ? (
             <>
               <i className="fa-solid fa-sparkles text-[10px] accent-text animate-pulse"></i>
               <p className="text-[10px] font-bold text-white tracking-tight">
                 <span className="accent-text font-black uppercase mr-2 tracking-widest">Greeting:</span>
                 {salutation}
               </p>
             </>
          ) : (
             <>
               <i className="fa-solid fa-satellite-dish text-[10px] accent-text animate-pulse"></i>
               <p className="text-[10px] font-bold text-slate-300 tracking-tight">
                 <span className="accent-text font-black uppercase mr-2 tracking-widest">Neural Status:</span>
                 {systemBroadcast}
               </p>
             </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6 flex-1 justify-end">
        {user && (
          <>
            {/* Inbox / Notification Trigger */}
            <div className="relative">
              <button 
                onClick={() => setShowInbox(!showInbox)}
                className="h-10 w-10 glass-morphism border-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all relative"
              >
                <i className="fa-solid fa-bell-on"></i>
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-white text-black text-[8px] font-black rounded-full flex items-center justify-center animate-bounce">
                    {notificationCount}
                  </span>
                )}
              </button>

              {showInbox && (
                <div className="absolute right-0 mt-4 w-80 glass-morphism rounded-3xl p-6 border-white/20 shadow-2xl animate-in fade-in slide-in-from-top-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-white mb-6">Messages</h4>
                  <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                    {messages.length === 0 ? (
                      <p className="text-xs text-slate-500 italic py-4">No messages at this time.</p>
                    ) : (
                      messages.map(m => (
                        <div key={m.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/20 transition-all">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-black text-slate-500 uppercase">{m.from}</span>
                            <span className="text-[9px] font-mono text-slate-600">{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="text-xs font-medium text-slate-300 leading-relaxed">{m.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-black tracking-tight">{user.name}</span>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{user.plan} plan</span>
            </div>
            
            <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-sm font-black text-black shadow-lg">
              {user.name.charAt(0)}
            </div>

            <button 
              onClick={onLogout}
              className="h-10 w-10 glass-morphism border-white/10 rounded-xl text-slate-400 hover:text-red-400 transition-all"
            >
              <i className="fa-solid fa-power-off"></i>
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
