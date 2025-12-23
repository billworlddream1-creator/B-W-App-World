
import React, { useState, useRef } from 'react';
import { User, AppState } from '../types';
import { aiService, fileToBase64 } from '../services/geminiService';
import { VIDEO_TEMPLATES } from '../constants';

interface VideoGenProps {
  user: User;
  onGenerate: (item: any) => void;
  settings: AppState['systemSettings'];
}

const VideoGenPage: React.FC<VideoGenProps> = ({ user, onGenerate, settings }) => {
  const [prompt, setPrompt] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('Initializing...');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const useTemplate = (tPrompt: string) => {
    setPrompt(tPrompt);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSuggest = async () => {
    setIsSuggesting(true);
    try {
      const ideas = await aiService.suggestPrompts('video', prompt);
      setSuggestions(ideas);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleGenerate = async () => {
    if (user.credits <= 0) return;
    setIsGenerating(true);
    setStatusMessage('Syncing Neural Nodes...');
    try {
      let base64 = undefined;
      if (imageFile) base64 = await fileToBase64(imageFile);
      setStatusMessage('Synthesizing Cinema... (90s avg)');
      const resultVideoUrl = await aiService.generateVideo(prompt, base64);
      setVideoUrl(resultVideoUrl);
      onGenerate({ type: 'video', prompt: prompt || 'AI Motion Master', url: resultVideoUrl });
    } catch (err: any) {
      console.error(err);
      alert('Generation Error: Check Terminal Logs.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700">
      <header>
        <div className="flex items-center gap-4 mb-2">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-600 to-amber-500 flex items-center justify-center shadow-xl shadow-orange-600/30">
            <i className="fa-solid fa-clapperboard text-2xl text-white"></i>
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight">Motion Forge</h1>
            <p className="text-slate-400 font-medium">Professional AI cinematography at your fingertips.</p>
          </div>
        </div>
      </header>

      {/* Main Studio Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-morphism rounded-[2.5rem] p-10 space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-5 -mr-10 -mt-10">
            <i className="fa-solid fa-film text-9xl"></i>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="aspect-video bg-white/5 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-orange-500/50 hover:bg-orange-500/5 transition-all group overflow-hidden"
            >
              {imagePreview ? (
                <img src={imagePreview} className="w-full h-full object-cover" alt="Source" />
              ) : (
                <div className="text-center p-6">
                  <i className="fa-solid fa-image-polaroid text-3xl text-slate-600 mb-4 group-hover:text-orange-400 transition-colors"></i>
                  <p className="text-sm font-black uppercase tracking-widest text-slate-500">Add Keyframe</p>
                </div>
              )}
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Cinematic Prompt</label>
                <button 
                  onClick={handleSuggest}
                  disabled={isSuggesting}
                  className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded bg-white/5 border border-white/10 flex items-center gap-2 hover:bg-white/10 transition-all ${isSuggesting ? 'opacity-50' : 'animate-pulse'}`}
                >
                  <i className="fa-solid fa-sparkles text-amber-500"></i> AI Suggest
                </button>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the motion dynamics, lighting, and camera movement..."
                className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-5 focus:ring-2 focus:ring-orange-500/50 outline-none transition-all text-sm leading-relaxed"
              />
            </div>
          </div>

          {suggestions.length > 0 && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-500">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Creative Expansions</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((idea, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setPrompt(idea);
                      setSuggestions([]);
                    }}
                    className="px-3 py-2 glass-morphism border-white/5 hover:border-orange-500/20 rounded-xl text-left text-[11px] text-slate-400 hover:text-white transition-all max-w-full"
                  >
                    {idea}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            disabled={isGenerating || user.credits <= 0 || !settings.videoEnabled}
            onClick={handleGenerate}
            className={`w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all shadow-2xl ${
              isGenerating ? 'bg-slate-800 cursor-not-allowed' : 'bg-gradient-to-r from-orange-600 to-amber-500 hover:scale-[1.02] active:scale-[0.98] shadow-orange-500/30'
            }`}
          >
            {isGenerating ? <><i className="fa-solid fa-spinner-third animate-spin"></i> {statusMessage}</> : <><i className="fa-solid fa-bolt-auto"></i> Synthesize Vision</>}
          </button>
        </div>

        {/* Template Gallery */}
        <div className="glass-morphism rounded-[2.5rem] p-8 space-y-6 border-white/5">
          <h3 className="text-xl font-black flex items-center gap-3">
            <i className="fa-solid fa-layer-group text-orange-400"></i>
            Elite Presets
          </h3>
          <div className="space-y-4">
            {VIDEO_TEMPLATES.map(t => (
              <button 
                key={t.id}
                onClick={() => useTemplate(t.prompt)}
                className="w-full p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-orange-500/30 hover:bg-white/10 transition-all text-left flex items-center gap-4 group"
              >
                <div className="h-12 w-12 rounded-xl overflow-hidden flex-shrink-0 grayscale group-hover:grayscale-0 transition-all">
                  <img src={t.thumbnail} className="w-full h-full object-cover" alt={t.title} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-1">{t.category}</p>
                  <p className="text-sm font-bold text-slate-200">{t.title}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {videoUrl && (
        <div className="glass-morphism rounded-[3rem] p-8 space-y-6 animate-in zoom-in duration-500 border-orange-500/20">
          <video src={videoUrl} controls autoPlay loop className="w-full rounded-[2rem] border border-white/5 shadow-2xl"></video>
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Master Render Complete</p>
            <a href={videoUrl} download="omnigen-video.mp4" className="px-8 py-3 bg-white text-black rounded-xl font-black uppercase text-xs tracking-widest hover:bg-orange-50 transition-all">
              Download Asset
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoGenPage;
