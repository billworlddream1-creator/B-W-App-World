
import React from 'react';
import { GenerationHistory } from '../types';

interface HistoryProps {
  history: GenerationHistory[];
}

const HistoryPage: React.FC<HistoryProps> = ({ history }) => {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-20 w-20 bg-slate-800 rounded-full flex items-center justify-center mb-6">
          <i className="fa-solid fa-ghost text-3xl text-slate-600"></i>
        </div>
        <h2 className="text-2xl font-bold mb-2">No history yet</h2>
        <p className="text-slate-400 max-w-md">Your creative journey hasn't started! Generate some audio, images, or videos to see them here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold mb-2">My History</h1>
        <p className="text-slate-400">View and download your previous generations.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {history.map((item) => (
          <div key={item.id} className="glass-morphism rounded-3xl overflow-hidden flex flex-col group border border-slate-700/50 hover:border-slate-500/50 transition-all">
            {/* Preview Section */}
            <div className="h-48 bg-slate-900 relative">
              {item.type === 'audio' && (
                <div className="h-full flex flex-col items-center justify-center p-4">
                  <div className="h-16 w-16 bg-blue-600/20 rounded-full flex items-center justify-center mb-4">
                    <i className="fa-solid fa-waveform-lines text-2xl text-blue-400"></i>
                  </div>
                  <audio src={item.url} controls className="w-full h-10"></audio>
                </div>
              )}
              {item.type === 'image' && (
                <img src={item.url} className="w-full h-full object-cover" alt="Generation" />
              )}
              {item.type === 'video' && (
                <video src={item.url} muted loop onMouseEnter={(e) => e.currentTarget.play()} onMouseLeave={(e) => e.currentTarget.pause()} className="w-full h-full object-cover" />
              )}
              
              <div className="absolute top-3 right-3">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  item.type === 'audio' ? 'bg-blue-600' : item.type === 'image' ? 'bg-purple-600' : 'bg-orange-600'
                }`}>
                  {item.type}
                </span>
              </div>
            </div>

            {/* Info Section */}
            <div className="p-5 flex-1 flex flex-col">
              <p className="text-xs text-slate-500 mb-2">
                {new Date(item.timestamp).toLocaleDateString()} at {new Date(item.timestamp).toLocaleTimeString()}
              </p>
              <p className="text-sm font-medium text-slate-300 line-clamp-2 mb-4 flex-1">
                {item.prompt}
              </p>
              
              <div className="flex gap-2">
                <a 
                  href={item.url} 
                  download={`omnigen-${item.id}.${item.type === 'video' ? 'mp4' : item.type === 'audio' ? 'wav' : 'png'}`}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold transition-colors border border-slate-700 flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-download"></i> Download
                </a>
                <button 
                  className="p-2 bg-slate-800 hover:bg-red-900/40 rounded-xl text-slate-400 hover:text-red-400 transition-colors border border-slate-700"
                  onClick={() => {/* Mock delete */}}
                >
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryPage;
