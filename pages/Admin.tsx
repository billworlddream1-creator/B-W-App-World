
import React, { useState } from 'react';
import { AppState, GenerationHistory, User } from '../types';
import { PRICING_PLANS, APP_NAME } from '../constants';

interface AdminProps {
  state: AppState;
  onUpdateSettings: (settings: AppState['systemSettings']) => void;
  onClearHistory: () => void;
  onSendMessage: (toUserId: string, content: string) => void;
  onAddUser: (userData: Partial<User>) => void;
}

type AdminTab = 'overview' | 'activity' | 'users' | 'referrals' | 'financials' | 'settings';

const AdminPage: React.FC<AdminProps> = ({ state, onUpdateSettings, onClearHistory, onSendMessage, onAddUser }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [localSettings, setLocalSettings] = useState(state.systemSettings);
  
  const [msgTargetId, setMsgTargetId] = useState('');
  const [msgContent, setMsgContent] = useState('');
  
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');

  const handleSaveSettings = () => {
    onUpdateSettings(localSettings);
    alert('Artifi Terminal Synchronized.');
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;
    onAddUser({ name: newUserName, email: newUserEmail });
    setNewUserName('');
    setNewUserEmail('');
    alert('Identity Provisioned.');
  };

  const handleSend = () => {
    if (!msgTargetId || !msgContent) return;
    onSendMessage(msgTargetId, msgContent);
    setMsgContent('');
    alert('System Dispatch Successful.');
  };

  const totalGens = state.history.length;
  const audioGens = state.history.filter(h => h.type === 'audio').length;
  const imageGens = state.history.filter(h => h.type === 'image').length;
  const videoGens = state.history.filter(h => h.type === 'video').length;
  const getPercentage = (count: number) => totalGens > 0 ? Math.round((count / totalGens) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2 uppercase">Artifi Command</h1>
          <p className="text-slate-500">Master control over nodes, identities, and financial velocity.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-white animate-pulse"></span>
            Node Alpha - Live
          </div>
        </div>
      </header>

      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-1 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', icon: 'fa-chart-network', label: 'Nodes' },
          { id: 'activity', icon: 'fa-shoe-prints', label: 'Footprints' },
          { id: 'users', icon: 'fa-user-gear', label: 'Identities' },
          { id: 'referrals', icon: 'fa-handshake', label: 'Referees' },
          { id: 'financials', icon: 'fa-wallet', label: 'Ledger' },
          { id: 'settings', icon: 'fa-microchip', label: 'Engine' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as AdminTab)}
            className={`px-6 py-3 rounded-t-2xl font-bold text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === tab.id 
              ? 'bg-white/5 text-white border-white' 
              : 'text-slate-500 border-transparent hover:text-slate-300'
            }`}
          >
            <i className={`fa-solid ${tab.icon}`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Identities', value: state.allUsers.length, color: 'white', icon: 'fa-users' },
              { label: 'Synthetic OPS', value: totalGens, color: 'white', icon: 'fa-sparkles' },
              { label: 'Uptime', value: '100%', color: 'white', icon: 'fa-heart-pulse' },
              { label: 'Dispatches', value: state.messages.length, color: 'white', icon: 'fa-envelope' }
            ].map((stat, i) => (
              <div key={i} className="glass-morphism p-6 rounded-3xl border border-white/10">
                <div className={`h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center mb-4 text-white`}>
                  <i className={`fa-solid ${stat.icon}`}></i>
                </div>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                <p className="text-3xl font-black mt-1 tracking-tighter">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
          {/* Add User Form */}
          <div className="glass-morphism rounded-[2.5rem] p-8 space-y-8 border-white/10 bg-black/40">
            <h3 className="text-xl font-bold flex items-center gap-3 uppercase tracking-widest">
              <i className="fa-solid fa-user-plus text-white"></i>
              Provision New Identity
            </h3>
            <form onSubmit={handleAddUser} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Full Name</label>
                <input 
                  required 
                  value={newUserName} 
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-1 focus:ring-white outline-none text-sm transition-all"
                  placeholder="e.g. Alexander Black"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Email Address</label>
                <input 
                  required 
                  type="email" 
                  value={newUserEmail} 
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-1 focus:ring-white outline-none text-sm transition-all"
                  placeholder="artisan@example.com"
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-4 bg-white text-black hover:bg-slate-200 rounded-2xl font-black transition-all shadow-xl uppercase text-xs tracking-widest"
              >
                Initialize Provisioning
              </button>
            </form>
          </div>

          {/* User List & Quick Dispatch */}
          <div className="glass-morphism rounded-[2.5rem] p-8 space-y-8 border-white/10 flex flex-col">
            <h3 className="text-xl font-bold flex items-center gap-3 uppercase tracking-widest">
              <i className="fa-solid fa-id-card text-white"></i>
              Identity Archive
            </h3>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {state.allUsers.map(u => (
                <div key={u.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-white/20 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-white text-black flex items-center justify-center text-sm font-black">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-black">{u.name}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-tighter">{u.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setMsgTargetId(u.id)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                      msgTargetId === u.id 
                      ? 'bg-white text-black' 
                      : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    Target
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-white/10 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Dispatch System Alert</h4>
                {msgTargetId && (
                  <button 
                    onClick={() => setMsgTargetId('')}
                    className="text-[9px] text-slate-400 hover:text-white uppercase font-bold"
                  >
                    Clear Target
                  </button>
                )}
              </div>
              <textarea 
                value={msgContent}
                onChange={(e) => setMsgContent(e.target.value)}
                placeholder={msgTargetId ? "Enter message for targeted node..." : "Select a target above to dispatch a message."}
                disabled={!msgTargetId}
                className="w-full h-24 bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-1 focus:ring-white outline-none transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button 
                onClick={handleSend}
                disabled={!msgTargetId || !msgContent}
                className="w-full py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl font-black transition-all uppercase text-xs tracking-widest disabled:opacity-50"
              >
                Send Secure Dispatch
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'referrals' && (
        <div className="glass-morphism rounded-[2.5rem] p-10 space-y-8 animate-in fade-in duration-300">
          <h3 className="text-xl font-bold uppercase tracking-widest flex items-center gap-3">
            <i className="fa-solid fa-handshake text-white"></i>
            Referee Network Velocity
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-500 px-4">Subject</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-500 px-4">Ref Code</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-500 px-4">Total Referrals</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-500 px-4">Credits Earned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {state.allUsers.map(u => (
                  <tr key={u.id}>
                    <td className="py-4 px-4 text-sm font-bold">{u.name}</td>
                    <td className="py-4 px-4 font-mono text-xs text-slate-400">{u.referralCode}</td>
                    <td className="py-4 px-4 text-sm font-black">{u.referralCount}</td>
                    <td className="py-4 px-4 text-sm text-white">+{u.referralCreditsEarned}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FOOTER ANALYSIS - Owner Strategy */}
      <section className="mt-12 animate-in fade-in duration-1000">
        <div className="glass-morphism rounded-[3rem] p-10 border border-white/10 relative overflow-hidden bg-black">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <i className="fa-solid fa-chess-king text-9xl"></i>
          </div>
          <h2 className="text-2xl font-black mb-8 uppercase tracking-widest flex items-center gap-4">
            <i className="fa-solid fa-shield-halved text-white"></i>
            Executive Command & Control
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="space-y-4">
              <h4 className="text-white font-black uppercase text-xs tracking-widest">Referral Velocity</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                The Referee Program is designed for <strong>Zero-Cost Growth</strong>. Each free referral costs you exactly 1 credit, which incentivizes users to expand the network without increasing your synthetic overhead significantly.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-black uppercase text-xs tracking-widest">Monochrome Footprints</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Use the <strong>Footprints</strong> tab to monitor concurrent logons. If multiple identities share the same IP/Agent within the same hour, consider auditing their referral earnings for synthetic manipulation.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-black uppercase text-xs tracking-widest">System Dispatches</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Communicate directly via the <strong>Identities</strong> tab. Send specific rewards or warnings to individual nodes to maintain high-quality synthetic output and platform integrity.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminPage;
