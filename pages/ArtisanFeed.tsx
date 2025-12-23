
import React from 'react';
import { SHOWCASE_ASSETS } from '../constants';
import { AppView } from '../types';

interface FeedProps {
  setView: (view: AppView) => void;
}

const ArtisanFeed: React.FC<FeedProps> = ({ setView }) => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase">Artisan Feed</h1>
          <p className="text-slate-500 font-medium">Synced masterpieces from the global neural collective.</p>
        </div>
        <button 
          onClick={() => setView('image')}
          className="px-8 py-4 bg-white text-black rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-xl accent-shadow"
        >
          Forge Your Own
        </button>
      </header>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
        {[...SHOWCASE_ASSETS, ...SHOWCASE_ASSETS].map((asset, i) => (
          <div key={i} className="break-inside-avoid glass-morphism rounded-[2.5rem] p-4 border-white/5 group hover:accent-border transition-all duration-500 cursor-zoom-in">
            <div className="relative overflow-hidden rounded-[2rem] aspect-[3/4]">
              <img 
                src={asset.url} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                alt="Community Art" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-8 flex flex-col justify-end">
                <p className="text-[10px] font-black uppercase tracking-widest text-accent-color mb-2">Subject Node #{(i * 137) % 999}</p>
                <p className="text-sm font-bold text-white line-clamp-2 italic leading-relaxed mb-4">
                  "Ultra-minimalist architectural study of shadows and light in high-contrast obsidian."
                </p>
                <div className="flex items-center gap-4">
                  <button className="text-white hover:accent-text"><i className="fa-solid fa-heart"></i></button>
                  <button className="text-white hover:accent-text"><i className="fa-solid fa-share-nodes"></i></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtisanFeed;
