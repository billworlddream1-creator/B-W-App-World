
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
  const [isPresenting, setIsPresenting] = useState(false);
  const [isForgingSlideVisual, setIsForgingSlideVisual] = useState(false);

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

  const forgeVisualForSlide = async () => {
    if (!deck || isForgingSlideVisual) return;
    setIsForgingSlideVisual(true);
    try {
      const visualPrompt = deck.slides[currentSlideIndex].visualDirective;
      const imageUrl = await aiService.generateImage(visualPrompt);
      const updatedSlides = [...deck.slides];
      updatedSlides[currentSlideIndex].generatedImageUrl = imageUrl;
      setDeck({ ...deck, slides: updatedSlides });
    } catch (err) {
      console.error(err);
    } finally {
      setIsForgingSlideVisual(false);
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

  const PresentationOverlay = () => {
    if (!isPresenting || !deck) return null;
    const current = deck.slides[currentSlideIndex];

    return (
      <div className="fixed inset-0 z-[200] bg-black text-white flex items-center justify-center p-8 md:p-24 animate-in fade-in duration-700">
        <button onClick={() => setIsPresenting(false)} className="absolute top-10 right-10 h-14 w-14 glass-morphism rounded-full flex items-center justify-center text-xl hover:bg-white/10">
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
            <p className="text-accent-color font-black uppercase tracking-[0.5em] text-sm">Slide {currentSlideIndex + 1}</p>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-tight">{current.title}</h1>
            <ul className="space-y-8">
              {current.content.map((bullet, i) => (
                <li key={i} className="flex gap-6 items-start">
                   <span className="h-4 w-4 bg-accent-color rotate-45 mt-3 flex-shrink-0"></span>
                   <p className="text-2xl md:text-3xl text-slate-400 font-medium leading-relaxed">{bullet}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="aspect-square glass-morphism rounded-[4rem] border-white/10 overflow-hidden relative shadow-[0_0_100px_rgba(255,255,255,0.05)]">
             {current.generatedImageUrl ? (
               <img src={current.generatedImageUrl} className="w-full h-full object-cover animate-in zoom-in duration-1000" />
             ) : (
               <div className="w-full h-full flex flex-col items-center justify-center text-slate-800 space-y-4">
                  <i className="fa-solid fa-camera-viewfinder text-8xl"></i>
                  <p className="text-[10px] font-black uppercase tracking-widest">Visual Not Synthesized</p>
               </div>
             )}
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-10">
           <button 
            disabled={currentSlideIndex === 0}
            onClick={() => setCurrentSlideIndex(p => p - 1)}
            className="h-16 w-16 glass-morphism rounded-full flex items-center justify-center hover:bg-white/10 disabled:opacity-30"
           >
             <i className="fa-solid fa-chevron-left"></i>
           </button>
           <span className="text-xl font-black text-white">{currentSlideIndex + 1} / {deck.slides.length}</span>
           <button 
            disabled={currentSlideIndex === deck.slides.length - 1}
            onClick={() => setCurrentSlideIndex(p => p + 1)}
            className="h-16 w-16 glass-morphism rounded-full flex items-center justify-center hover:bg-white/10 disabled:opacity-30"
           >
             <i className="fa-solid fa-chevron-right"></i>
           </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700">
      <PresentationOverlay />
      
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="h-16 w-16 rounded-[2rem] bg-gradient-to-br from-yellow-600 to-amber-400 flex items-center justify-center shadow-xl shadow-yellow-500/20">
            <i className="fa-solid fa-presentation-screen text-2xl text-white"></i>
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase">Slide Nexus</h1>
            <p className="text-slate-500 font-medium">Immersive cinematic decks at your command.</p>
          </div>
        </div>
        
        <div className="flex gap-4">
          {deck && (
            <button 
              onClick={() => setIsPresenting(true)}
              className="px-8 py-3 bg-accent-color text-black rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl accent-shadow hover:scale-105 transition-all"
            >
              <i className="fa-solid fa-play mr-2"></i> Launch Presentation
            </button>
          )}
          <div className="px-6 py-3 glass-morphism border-white/10 rounded-2xl flex items-center gap-4">
             <div className="text-right">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Max Capacity</p>
                <p className="text-xs font-black accent-text">{slideLimit} Slides</p>
             </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-morphism rounded-[2.5rem] p-8 space-y-6 border-white/10">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Blueprint Topic</label>
                <button onClick={handleSuggest} className="text-[9px] accent-text font-black uppercase tracking-widest">AI Suggest</button>
              </div>
              <textarea 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Topic..."
                className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-5 text-sm focus:ring-1 focus:accent-border outline-none transition-all resize-none"
              />
            </div>
            
            {suggestions.length > 0 && (
              <div className="space-y-2">
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => {setTopic(s); setSuggestions([]);}} className="w-full text-left p-3 rounded-xl bg-white/5 text-[10px] hover:bg-white/10">{s}</button>
                ))}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !topic.trim() || user.credits <= 0}
              className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all ${
                isGenerating ? 'bg-slate-800' : 'bg-white text-black accent-shadow'
              }`}
            >
              {isGenerating ? 'Drafting...' : 'Synthesize Deck'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-8">
          {deck ? (
            <div className="space-y-8">
              <div className="aspect-[16/9] glass-morphism rounded-[3rem] p-12 border-white/10 flex flex-col justify-center relative overflow-hidden group shadow-2xl">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="space-y-6">
                      <h2 className="text-4xl font-black uppercase accent-text">{deck.slides[currentSlideIndex].title}</h2>
                      <ul className="space-y-4">
                        {deck.slides[currentSlideIndex].content.map((bullet, idx) => (
                          <li key={idx} className="flex gap-4"><span className="h-1.5 w-1.5 rounded-full accent-bg mt-2"></span><p className="text-sm text-slate-300 font-medium leading-relaxed">{bullet}</p></li>
                        ))}
                      </ul>
                   </div>
                   <div className="relative aspect-square glass-morphism rounded-3xl border-white/5 overflow-hidden flex flex-col items-center justify-center p-4">
                      {deck.slides[currentSlideIndex].generatedImageUrl ? (
                        <img src={deck.slides[currentSlideIndex].generatedImageUrl} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <button 
                          onClick={forgeVisualForSlide}
                          disabled={isForgingSlideVisual}
                          className="flex flex-col items-center gap-3 text-slate-600 hover:text-white transition-all"
                        >
                          {isForgingSlideVisual ? <i className="fa-solid fa-spinner-third animate-spin text-4xl accent-text"></i> : <i className="fa-solid fa-image-polaroid text-5xl"></i>}
                          <span className="text-[10px] font-black uppercase tracking-widest">{isForgingSlideVisual ? 'Forging Visual...' : 'Synthesize Slide Visual'}</span>
                        </button>
                      )}
                   </div>
                 </div>
                 <div className="mt-8 pt-8 border-t border-white/5 text-[10px] text-slate-600 font-black uppercase flex items-center gap-3 tracking-widest">
                    <i className="fa-solid fa-camera-viewfinder text-accent-color"></i>
                    {deck.slides[currentSlideIndex].visualDirective}
                 </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  <button disabled={currentSlideIndex === 0} onClick={() => setCurrentSlideIndex(p => p - 1)} className="h-12 w-12 glass-morphism rounded-xl flex items-center justify-center disabled:opacity-30"><i className="fa-solid fa-chevron-left"></i></button>
                  <button disabled={currentSlideIndex === deck.slides.length - 1} onClick={() => setCurrentSlideIndex(p => p + 1)} className="h-12 w-12 glass-morphism rounded-xl flex items-center justify-center disabled:opacity-30"><i className="fa-solid fa-chevron-right"></i></button>
                </div>
                <p className="text-xs font-black text-slate-500">SLIDE {currentSlideIndex + 1} OF {deck.slides.length}</p>
              </div>
            </div>
          ) : (
            <div className="aspect-[16/9] glass-morphism rounded-[3rem] border border-dashed border-white/10 flex flex-col items-center justify-center text-center p-12">
               {isGenerating ? <div className="animate-pulse"><i className="fa-solid fa-compass-drafting text-6xl text-slate-700"></i></div> : <div className="space-y-4"><i className="fa-solid fa-presentation-screen text-6xl text-slate-800"></i><h3 className="text-xl font-bold uppercase">Ready for Synthesis</h3></div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PresentationPage;
