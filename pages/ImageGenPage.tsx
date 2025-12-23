
import React, { useState, useRef } from 'react';
import { User, AppState } from '../types';
import { aiService, fileToBase64 } from '../services/geminiService';

interface ImageGenProps {
  user: User;
  onGenerate: (item: any) => void;
  settings: AppState['systemSettings'];
}

const ImageGenPage: React.FC<ImageGenProps> = ({ user, onGenerate, settings }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || user.credits <= 0) return;
    setIsGenerating(true);
    try {
      // Use reference image if provided for Image-to-Image synthesis
      const imageUrl = await aiService.generateImage(referenceImage ? `${prompt} (based on provided image context)` : prompt);
      setResultImage(imageUrl);
      onGenerate({ type: 'image', prompt: prompt, url: imageUrl });
    } catch (err) {
      console.error(err);
      alert('Image generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const b64 = await fileToBase64(e.target.files[0]);
      setReferenceImage(`data:image/png;base64,${b64}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
      <header className="flex items-center gap-6">
        <div className="h-16 w-16 rounded-2xl bg-purple-600 flex items-center justify-center shadow-xl shadow-purple-600/30">
          <i className="fa-solid fa-camera-retro text-2xl"></i>
        </div>
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight">Image Forge</h1>
          <p className="text-slate-400 font-medium">Synthesize high-contrast masterpieces from text or blueprints.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-6">
           <div 
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square glass-morphism rounded-[2.5rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-accent-color/50 transition-all overflow-hidden relative group"
           >
              {referenceImage ? (
                <>
                  <img src={referenceImage} className="w-full h-full object-cover opacity-60" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
                     <i className="fa-solid fa-image text-3xl mb-2"></i>
                     <span className="text-[10px] font-black uppercase tracking-widest">Blueprint Active</span>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center space-y-4">
                  <i className="fa-solid fa-upload text-4xl text-slate-700 group-hover:accent-text transition-colors"></i>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Upload Visual Blueprint <br/><span className="text-slate-600 font-bold lowercase">(Image-to-Image)</span></p>
                </div>
              )}
              <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
           </div>
           
           {referenceImage && (
             <button 
              onClick={() => setReferenceImage(null)}
              className="w-full py-3 bg-red-900/20 text-red-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-900/40"
             >
               Clear Blueprint
             </button>
           )}
        </div>

        <div className="lg:col-span-8 space-y-8">
          <div className="glass-morphism rounded-[2.5rem] p-8 space-y-8 border-white/10 relative">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Prompt Neural Core</label>
                <button onClick={() => aiService.suggestPrompts('image').then(setSuggestions)} className="text-[9px] accent-text font-black uppercase tracking-widest">AI Assist</button>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your artistic vision..."
                className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-5 text-sm focus:ring-1 focus:accent-border outline-none transition-all resize-none"
              />
            </div>

            {suggestions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => setPrompt(s)} className="px-4 py-2 glass-morphism rounded-xl text-[10px] text-slate-400 hover:text-white">{s}</button>
                ))}
              </div>
            )}

            <button
              disabled={isGenerating || !prompt.trim() || user.credits <= 0}
              onClick={handleGenerate}
              className={`w-full py-5 rounded-2xl font-black text-lg uppercase tracking-widest transition-all ${
                isGenerating ? 'bg-slate-800' : 'bg-white text-black accent-shadow hover:scale-[1.02]'
              }`}
            >
              {isGenerating ? <i className="fa-solid fa-spinner-third animate-spin"></i> : (referenceImage ? 'Re-imagine Blueprint' : 'Forge Original')}
            </button>
          </div>

          {resultImage && (
            <div className="glass-morphism rounded-[3rem] p-8 space-y-6 animate-in zoom-in duration-500 border-accent-color/20">
              <img src={resultImage} className="w-full rounded-[2rem] shadow-2xl" />
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Synthesis Complete</p>
                <a href={resultImage} download="artifi-image.png" className="px-8 py-3 bg-white text-black rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-xl">Download Artifact</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageGenPage;
