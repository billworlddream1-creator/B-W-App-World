
import React, { useState } from 'react';
import { User } from '../types';
import { APP_NAME } from '../constants';

interface LoginProps {
  onLogin: (user: User, refCode?: string) => void;
}

const LoginPage: React.FC<LoginProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [refCode, setRefCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: name || (email.split('@')[0]),
      email: email,
      role: email.toLowerCase().includes('admin') ? 'admin' : 'user',
      credits: 80,
      maxCredits: 80,
      plan: 'free',
      lastLoginDateString: '',
      referralCode: Math.random().toString(36).substr(2, 6).toUpperCase(),
      referralCount: 0,
      referralCreditsEarned: 0
    };
    onLogin(mockUser, refCode);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#000000]">
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full animate-pulse"></div>
      
      <div className="w-full max-w-lg glass-morphism rounded-[3rem] p-12 relative z-10 border-white/10 shadow-2xl animate-in zoom-in-95 fade-in duration-700">
        <div className="text-center mb-12">
          <div className="h-20 w-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-white/10 accent-shadow">
            <i className="fa-solid fa-b text-4xl text-black"></i>
          </div>
          <h1 className="text-4xl font-black mb-3 tracking-tighter uppercase">{APP_NAME}</h1>
          <p className="text-slate-500 text-[10px] font-black tracking-widest uppercase">The Next Generation of AI Creativity</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
              <input
                type="text" required
                value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-1 focus:accent-border outline-none transition-all text-sm font-medium"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
            <input
              type="email" required
              value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-1 focus:accent-border outline-none transition-all text-sm font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Referral Code (Optional)</label>
            <input
              type="text"
              value={refCode} onChange={(e) => setRefCode(e.target.value)}
              placeholder="Code from a friend"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-1 focus:accent-border outline-none transition-all text-sm font-medium"
            />
          </div>

          <button
            type="submit"
            className="w-full py-5 accent-bg text-white rounded-2xl font-black text-lg transition-all shadow-2xl active:scale-95 transform uppercase tracking-tighter accent-shadow"
          >
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-10 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-slate-500 hover:accent-text text-[10px] transition-colors font-black uppercase tracking-widest"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
