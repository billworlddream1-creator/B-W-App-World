
import React, { useState } from 'react';
import { User, AppState } from '../types';
import { aiService } from '../services/geminiService';

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

  const handleGenerate = async () => {
    if (!prompt.trim() || user.credits <= 0) return;
    setIsGenerating(true);
    try {
      const imageUrl = await aiService.generateImage(prompt);
      setResultImage(imageUrl);
      onGenerate({
        type: 'image',
        prompt: prompt,
        url: imageUrl
      });
    } catch (err) {
      console.error(err);
      alert('Image generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSuggest = async () => {
    setIsSuggesting(true);
    try {
      const ideas = await aiService.suggestPrompts('image', prompt);
      setSuggestions(ideas);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <div className="flex items-center gap-4 mb-2">
          <div className="h-12 w-12 rounded-2xl bg-purple-600 flex items-center justify-center">
            <i className="fa-solid fa-image text-xl"></i>
          </div>
          <h1 className="text-3xl font-bold">Image Creator</h1>
        </div>
        <p className="text-slate-400">Generate stunning visuals from simple text descriptions.</p>
      </header>

      {!settings.imageEnabled && (
        <div className="p-4 bg-red-900/20 border border-red-500/20 rounded-2xl text-red-400 flex items-center gap-3">
          <i className="fa-solid fa-circle-exclamation"></i>
          <p>Image generation is currently disabled by the administrator.</p>
        </div>
      )}

      <div className="glass-morphism rounded-3xl p-6 space-y-6">
        <div className="relative">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-semibold text-slate-400">Detailed Prompt</label>
            <button 
              onClick={handleSuggest}
              disabled={isSuggesting}
              className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2 hover:accent-border hover:accent-text transition-all ${isSuggesting ? 'opacity-50' : 'animate-pulse'}`}
            >
              {isSuggesting ? (
                <><i className="fa-solid fa-circle-notch animate-spin"></i> Analyzing...</>
              ) : (
                <><i className="fa-solid fa-sparkles accent-text"></i> AI Assist</>
              )}
            </button>
          </div>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. A futuristic cyberpunk city with neon lights and flying cars, digital art style..."
            className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl p-4 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all text-lg"
          />
        </div>

        {suggestions.length > 0 && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-500">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Neural Suggestions</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((idea, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setPrompt(idea);
                    setSuggestions([]);
                  }}
                  className="px-4 py-2 glass-morphism border-white/5 hover:border-white/20 rounded-xl text-left text-xs text-slate-300 hover:text-white transition-all max-w-[300px] truncate"
                >
                  {idea}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {['Cyberpunk', 'Photorealistic', 'Oil Painting', '3D Render', 'Anime Style'].map(style => (
            <button 
              key={style}
              onClick={() => setPrompt(prev => prev + (prev ? ', ' : '') + style)}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-full text-xs font-medium text-slate-300 transition-colors"
            >
              + {style}
            </button>
          ))}
        </div>

        <button
          disabled={isGenerating || !prompt.trim() || user.credits <= 0 || !settings.imageEnabled}
          onClick={handleGenerate}
          className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${
            isGenerating ? 'bg-slate-700 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-purple-500/20'
          }`}
        >
          {isGenerating ? (
            <><i className="fa-solid fa-wand-magic-sparkles animate-pulse"></i> Creating Masterpiece...</>
          ) : (
            <><i className="fa-solid fa-sparkles"></i> Generate Image</>
          )}
        </button>
      </div>

      {resultImage && (
        <div className="glass-morphism rounded-3xl p-6 space-y-4 animate-in zoom-in duration-500">
          <div className="relative group rounded-2xl overflow-hidden aspect-square max-w-lg mx-auto">
            <img src={resultImage} alt="Generated" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <a 
                href={resultImage} 
                download="omni-gen-art.png"
                className="px-6 py-3 bg-white text-black font-bold rounded-xl shadow-xl hover:scale-105 transition-transform"
              >
                <i className="fa-solid fa-download mr-2"></i> Download Full Resolution
              </a>
            </div>
          </div>
          <div className="text-center">
            <p className="text-slate-400 text-sm italic">"{prompt}"</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGenPage;
