
import React, { useMemo, useState, useEffect } from 'react';
import { SHOWCASE_ASSETS, APP_NAME } from '../constants';

interface GlobalFooterProps {
  whatsappEnabled: boolean;
  whatsappNumber: string;
}

const DiamondClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  // Calculate degrees for hands
  const secDeg = (seconds / 60) * 360;
  const minDeg = (minutes / 60) * 360 + (seconds / 60) * 6;
  const hourDeg = (hours / 12) * 360 + (minutes / 60) * 30;

  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      {/* Diamond Frame */}
      <div className="absolute inset-0 border border-white/20 rotate-45 glass-morphism accent-shadow bg-black/40"></div>
      
      {/* Clock Hands Container */}
      <div className="relative w-12 h-12">
        {/* Hour Hand */}
        <div 
          className="absolute left-1/2 bottom-1/2 w-1 h-3.5 bg-white origin-bottom rounded-full transition-transform duration-500"
          style={{ transform: `translateX(-50%) rotate(${hourDeg}deg)` }}
        />
        {/* Minute Hand */}
        <div 
          className="absolute left-1/2 bottom-1/2 w-0.5 h-5 bg-slate-400 origin-bottom rounded-full transition-transform duration-500"
          style={{ transform: `translateX(-50%) rotate(${minDeg}deg)` }}
        />
        {/* Second Hand */}
        <div 
          className="absolute left-1/2 bottom-1/2 w-px h-5.5 accent-bg origin-bottom shadow-[0_0_8px_var(--accent-color)]"
          style={{ transform: `translateX(-50%) rotate(${secDeg}deg)` }}
        />
        {/* Center Point */}
        <div className="absolute left-1/2 top-1/2 w-1.5 h-1.5 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 z-10"></div>
      </div>
    </div>
  );
};

const GlobalFooter: React.FC<GlobalFooterProps> = ({ whatsappEnabled, whatsappNumber }) => {
  return (
    <footer className="mt-20 pb-10 space-y-12 relative overflow-hidden">
      {/* Sliding Showcase Marquee */}
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 text-center">Community Discover</h3>
        <div className="flex overflow-hidden group">
          <div className="flex animate-marquee whitespace-nowrap gap-6 py-4 px-6 hover:pause">
            {[...SHOWCASE_ASSETS, ...SHOWCASE_ASSETS, ...SHOWCASE_ASSETS].map((asset, i) => (
              <div key={i} className="h-40 w-64 flex-shrink-0 glass-morphism rounded-2xl overflow-hidden border border-white/5 card-hover">
                <img src={asset.url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Showcase" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subscription Trust Signals */}
      <div className="max-w-4xl mx-auto text-center px-6">
        <div className="glass-morphism p-6 rounded-[2rem] border-white/10 bg-white/5 relative group">
          <div className="flex justify-center gap-12">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-shield-check text-xs accent-text"></i>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-headset text-xs accent-text"></i>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">24/7 Support</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-crown text-xs accent-text"></i>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Elite AI Access</span>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Button (Admin Controlled) */}
      {whatsappEnabled && (
        <a 
          href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="fixed bottom-8 right-8 h-14 w-14 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl shadow-2xl shadow-green-500/40 hover:scale-110 active:scale-95 transition-all z-50 group"
        >
          <i className="fa-brands fa-whatsapp"></i>
          <span className="absolute right-16 bg-white text-black text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap shadow-xl">
            Support Chat
          </span>
        </a>
      )}

      {/* Copyright area with Diamond Clock */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between px-6 gap-6">
        <div className="flex items-center gap-6 order-2 md:order-1">
          <DiamondClock />
          <div className="hidden lg:block text-left">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white">Temporal Node</p>
            <p className="text-[9px] font-mono text-slate-500">UTC Sync Verified</p>
          </div>
        </div>

        <div className="text-center order-1 md:order-2">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.4em]">
            &copy; 2025 {APP_NAME} &bull; All Rights Reserved
          </p>
        </div>

        <div className="hidden md:flex items-center gap-4 order-3 text-right">
          <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600">
            Node status <span className="text-green-500">Alpha-1</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .pause:hover {
          animation-play-state: paused;
        }
      `}</style>
    </footer>
  );
};

export default GlobalFooter;
