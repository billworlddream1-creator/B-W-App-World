
import React, { useState, useMemo } from 'react';
import { User, PresentationDeck, Slide } from '../types';
import { aiService } from '../services/geminiService';

interface PresentationProps {
  user: User;
  onGenerate: (item: any) => void;
}

const PresentationPage: React.FC<PresentationProps> = ({ user, onGenerate }) => {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [deck, setDeck] = useState<PresentationDeck | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Usage Plan Logic: Max slides based on plan
  const slideLimit = useMemo(() => {
    switch (user.plan) {
      case 'weekly': return 10;
      case 'monthly': return 15;
      case 'yearly': return 25;
      default: return 5;
    }
  }, [user.plan]);

  const handleGenerate = async () => {
    if (!topic.trim() || user.credits <= 0) return;
    setIsGenerating(true);
    setDeck(null);
    try {
      // Pass the plan-based slide count to the service
      const result = await aiService.generatePresentation(topic, slideLimit);
      setDeck(result);
      setCurrentSlideIndex(0);
      onGenerate({
        type: 'presentation',
        prompt: topic,
        url: 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(result))
      });
    } catch (err) {
      console.error(err);
      alert('Architectural synthesis failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSuggest = async () => {
    setIsSuggesting(true);
    try {
      const ideas = await aiService.suggestPrompts('ppt', topic);
      setSuggestions(ideas);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSuggesting(false);
    }
  };

  const copyDeck = () => {
    if (!deck) return;
    navigator.clipboard.writeText(JSON.stringify(deck, null, 2));
    alert('Slide Deck Blueprint copied to clipboard.');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="h-16 w-16 rounded-[2rem] bg-gradient-to-br from-yellow-600 to-amber-400 flex items-center justify-center shadow-xl shadow-yellow-500/20">
            <i className="fa-solid fa-presentation-screen text-2xl text-white"></i>
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase">Slide Nexus</h1>
            <p className="text-slate-500 font-medium">Forge cinematic deck blueprints for professional pitches.</p>
          </div>
        </div>
        
        {/* Plan Capacity Indicator */}
        <div className="px-6 py-3 glass-morphism border-white/10 rounded-2xl flex items-center gap-4">
           <div className="text-right">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Node Capability</p>
              <p className="text-xs font-bold text-white uppercase">{user.plan} Architect</p>
           </div>
           <div className="h-10 w-1 bg-white/10"></div>
           <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Max Capacity</p>
              <p className="text-xs font-black accent-text">{slideLimit} Slides</p>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Input Control */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-morphism rounded-[2.5rem] p-8 space-y-6 border-white/10">
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Presentation Topic</label>
                <button 
                  onClick={handleSuggest}
                  disabled={isSuggesting}
                  className="text-[9px] font-black accent-text uppercase tracking-widest hover:underline"
                >
                  {isSuggesting ? 'Analyzing...' : 'Suggest Topics'}
                </button>
              </div>
              <textarea 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. The Future of Sustainable Brutalist Architecture in 2030..."
                className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-5 text-sm focus:ring-1 focus:accent-border outline-none transition-all resize-none"
              />
            </div>

            {suggestions.length > 0 && (
              <div className="space-y-2 animate-in slide-in-from-top-1 duration-300">
                {suggestions.map((s, i) => (
                  <button 
                    key={i} 
                    onClick={() => { setTopic(s); setSuggestions([]); }}
                    className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/5 hover:border-accent-color/30 text-[10px] text-slate-400 hover:text-white transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !topic.trim() || user.credits <= 0}
              className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all ${
                isGenerating ? 'bg-slate-800' : 'bg-white text-black hover:scale-[1.02] accent-shadow'
              }`}
            >
              {isGenerating ? <><i className="fa-solid fa-compass-drafting animate-spin mr-2"></i> Drafting {slideLimit} slides...</> : 'Initialize Deck'}
            </button>
          </div>

          <div className="p-6 glass-morphism rounded-3xl border-white/5">
             <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Architectural Specs</h4>
             <ul className="space-y-3">
               {[
                 { icon: 'fa-layer-group', text: `${slideLimit} Thematic Slides` },
                 { icon: 'fa-wand-magic-sparkles', text: 'AI Visual Directives' },
                 { icon: 'fa-file-code', text: 'Structured JSON Metadata' }
               ].map((item, i) => (
                 <li key={i} className="flex items-center gap-3 text-xs font-bold text-slate-400">
                   <i className={`fa-solid ${item.icon} text-slate-600`}></i>
                   {item.text}
                 </li>
               ))}
             </ul>
             
             {user.plan === 'free' && (
               <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/10">
                 <p className="text-[9px] font-black uppercase text-amber-500 mb-2">Upgrade Available</p>
                 <p className="text-[10px] text-slate-400 leading-relaxed mb-3">Upgrade to Silver for 10 slides or Platinum for 25 slides per deck.</p>
                 <button className="text-[9px] font-black text-white uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                   View Plans <i className="fa-solid fa-arrow-right"></i>
                 </button>
               </div>
             )}
          </div>
        </div>

        {/* Preview Area */}
        <div className="lg:col-span-8">
          {deck ? (
            <div className="space-y-8 animate-in zoom-in-95 duration-500">
              {/* Slide Display */}
              <div className="aspect-[16/9] glass-morphism rounded-[3rem] p-12 border-white/10 flex flex-col justify-center relative overflow-hidden group shadow-2xl">
                 <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <span className="text-9xl font-black">{currentSlideIndex + 1}</span>
                 </div>
                 
                 <div className="relative z-10 max-w-3xl space-y-6">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight uppercase accent-text">
                      {deck.slides[currentSlideIndex].title}
                    </h2>
                    <ul className="space-y-4">
                      {deck.slides[currentSlideIndex].content.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-4">
                           <span className="h-1.5 w-1.5 rounded-full accent-bg mt-2 flex-shrink-0"></span>
                           <p className="text-lg text-slate-300 font-medium leading-relaxed">{bullet}</p>
                        </li>
                      ))}
                    </ul>
                 </div>

                 <div className="mt-12 pt-12 border-t border-white/5">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 flex items-center gap-3">
                      <i className="fa-solid fa-camera-viewfinder accent-text"></i>
                      Visual Directive: <span className="text-slate-400 normal-case italic font-medium">"{deck.slides[currentSlideIndex].visualDirective}"</span>
                    </p>
                 </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  <button 
                    disabled={currentSlideIndex === 0}
                    onClick={() => setCurrentSlideIndex(prev => prev - 1)}
                    className="h-12 w-12 glass-morphism rounded-xl border-white/10 flex items-center justify-center text-white disabled:opacity-30 hover:accent-border transition-all"
                  >
                    <i className="fa-solid fa-chevron-left"></i>
                  </button>
                  <button 
                    disabled={currentSlideIndex === deck.slides.length - 1}
                    onClick={() => setCurrentSlideIndex(prev => prev + 1)}
                    className="h-12 w-12 glass-morphism rounded-xl border-white/10 flex items-center justify-center text-white disabled:opacity-30 hover:accent-border transition-all"
                  >
                    <i className="fa-solid fa-chevron-right"></i>
                  </button>
                </div>

                <div className="flex items-center gap-6">
                   <p className="text-xs font-black text-slate-500 tracking-widest">SLIDE {currentSlideIndex + 1} OF {deck.slides.length}</p>
                   <button 
                    onClick={copyDeck}
                    className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all"
                   >
                     Copy Blueprint
                   </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="aspect-[16/9] glass-morphism rounded-[3rem] border border-dashed border-white/10 flex flex-col items-center justify-center text-center p-12">
               {isGenerating ? (
                 <div className="space-y-6">
                    <div className="h-24 w-24 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center mx-auto accent-shadow">
                       <i className="fa-solid fa-compass-drafting text-4xl accent-text animate-spin"></i>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Synthesizing {slideLimit} Slide Structure...</p>
                 </div>
               ) : (
                 <div className="space-y-4 max-w-sm">
                    <i className="fa-solid fa-presentation-screen text-6xl text-slate-800 mb-4"></i>
                    <h3 className="text-xl font-bold uppercase tracking-tight">Ready for Synthesis</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">Your current {user.plan} node can generate decks up to {slideLimit} slides in length. Enter a topic to begin.</p>
                 </div>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PresentationPage;
