
import React from 'react';
import { AppView } from '../types';

interface WorkNavigatorProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const WORK_SEQUENCE: AppView[] = [
  'dashboard',
  'academy',
  'tts',
  'image',
  'video',
  'ppt',
  'history'
];

const VIEW_LABELS: Record<string, string> = {
  dashboard: 'Home',
  academy: 'Academy',
  tts: 'Voice Lab',
  image: 'Image Forge',
  video: 'Video Studio',
  ppt: 'Slide Nexus',
  history: 'History'
};

const WorkNavigator: React.FC<WorkNavigatorProps> = ({ currentView, setView }) => {
  const currentIndex = WORK_SEQUENCE.indexOf(currentView);
  
  // If the current view isn't in our sequential work list (like Admin or Pricing), we don't show the navigator
  if (currentIndex === -1) return null;

  const prevIndex = (currentIndex - 1 + WORK_SEQUENCE.length) % WORK_SEQUENCE.length;
  const nextIndex = (currentIndex + 1) % WORK_SEQUENCE.length;

  const prevView = WORK_SEQUENCE[prevIndex];
  const nextView = WORK_SEQUENCE[nextIndex];

  return (
    <div className="flex items-center justify-between w-full mb-8 pointer-events-none">
      {/* Left Navigation */}
      <button
        onClick={() => setView(prevView)}
        className="group pointer-events-auto flex items-center gap-4 px-4 py-3 glass-morphism border-white/5 rounded-2xl hover:accent-border transition-all duration-500 hover:translate-x-[-4px]"
        title={`Back to ${VIEW_LABELS[prevView]}`}
      >
        <div className="h-8 w-8 rounded-xl bg-white/5 flex items-center justify-center group-hover:accent-bg group-hover:text-white transition-all">
          <i className="fa-solid fa-chevron-left text-xs text-slate-400 group-hover:text-white"></i>
        </div>
        <div className="flex flex-col items-start pr-2">
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">Previous</span>
          <span className="text-[10px] font-bold text-white uppercase tracking-wider">{VIEW_LABELS[prevView]}</span>
        </div>
      </button>

      {/* Center Breadcrumb (Optional but adds polish) */}
      <div className="hidden lg:flex items-center gap-3 px-6 py-2 bg-white/5 rounded-full border border-white/5">
         <span className="h-1 w-1 rounded-full bg-slate-700"></span>
         <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Forge Sequence</span>
         <span className="h-1 w-1 rounded-full bg-slate-700"></span>
      </div>

      {/* Right Navigation */}
      <button
        onClick={() => setView(nextView)}
        className="group pointer-events-auto flex items-center gap-4 px-4 py-3 glass-morphism border-white/5 rounded-2xl hover:accent-border transition-all duration-500 hover:translate-x-[4px]"
        title={`Forward to ${VIEW_LABELS[nextView]}`}
      >
        <div className="flex flex-col items-end pl-2">
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">Next</span>
          <span className="text-[10px] font-bold text-white uppercase tracking-wider">{VIEW_LABELS[nextView]}</span>
        </div>
        <div className="h-8 w-8 rounded-xl bg-white/5 flex items-center justify-center group-hover:accent-bg group-hover:text-white transition-all">
          <i className="fa-solid fa-chevron-right text-xs text-slate-400 group-hover:text-white"></i>
        </div>
      </button>
    </div>
  );
};

export default WorkNavigator;
