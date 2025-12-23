
import React from 'react';

const Academy: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <header className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10 mb-4">
          <i className="fa-solid fa-graduation-cap accent-text"></i>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Neural Academy</span>
        </div>
        <h1 className="text-6xl font-black tracking-tighter">Become the <span className="bw-gradient-text">Architect</span></h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
          The neural network is a tool, and you are the architect. Master the science of prompts to forge high-contrast cinematic masterpieces.
        </p>
      </header>

      {/* Curriculum Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Module 1: Prompting */}
        <div className="glass-morphism p-10 rounded-[3rem] space-y-6 border-white/10 relative group hover:accent-border transition-all">
          <div className="h-14 w-14 rounded-2xl accent-bg flex items-center justify-center text-white text-2xl shadow-xl accent-shadow">
            <i className="fa-solid fa-pen-nib"></i>
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tight">The Anatomy of a Prompt</h3>
          <p className="text-sm text-slate-500 leading-relaxed font-medium">
            AI doesn't just read words; it interprets concepts. For the best B&W results, use the <span className="text-white">Triple-Axis Framework</span>:
          </p>
          <ul className="space-y-4 text-xs font-bold text-slate-300">
            <li className="flex gap-3 items-start">
              <span className="accent-text">01</span>
              <div>
                <span className="text-white uppercase">Subject:</span> Exactly what is in the frame.
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <span className="accent-text">02</span>
              <div>
                <span className="text-white uppercase">Atmos:</span> The light, shadow, and depth.
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <span className="accent-text">03</span>
              <div>
                <span className="text-white uppercase">Technical:</span> Lens type, resolution, and style.
              </div>
            </li>
          </ul>
        </div>

        {/* Module 2: Image Forge */}
        <div className="glass-morphism p-10 rounded-[3rem] space-y-6 border-white/10 relative group hover:accent-border transition-all">
          <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center text-black text-2xl shadow-xl">
            <i className="fa-solid fa-wand-sparkles"></i>
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tight">Mastering Vision</h3>
          <p className="text-sm text-slate-500 leading-relaxed font-medium">
            Artifi Ai thrives on high-contrast. When forging images, prompt for "Chiaroscuro" or "Noir Lighting" to get that deep crimson-fused shadow depth.
          </p>
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">Pro Architect Tip</p>
            <p className="text-[11px] italic text-slate-300">"Avoid generic terms like 'beautiful'. Instead, use 'brutalist architecture, extreme silhouettes, obsidian reflections'."</p>
          </div>
        </div>

        {/* Module 3: Motion Forge */}
        <div className="glass-morphism p-10 rounded-[3rem] space-y-6 border-white/10 relative group hover:accent-border transition-all">
          <div className="h-14 w-14 rounded-2xl bg-slate-800 flex items-center justify-center text-white text-2xl shadow-xl">
            <i className="fa-solid fa-film"></i>
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tight">Cinematic Motion</h3>
          <p className="text-sm text-slate-500 leading-relaxed font-medium">
            Motion requires momentum. When creating videos, describe the camera path: "slow dolly zoom," "low angle pan," or "static focus with smoke movement."
          </p>
          <div className="flex gap-2 pt-4">
            <span className="px-3 py-1 bg-white/5 rounded-full text-[8px] font-black uppercase tracking-widest text-slate-400 border border-white/10">Dynamic Pan</span>
            <span className="px-3 py-1 bg-white/5 rounded-full text-[8px] font-black uppercase tracking-widest text-slate-400 border border-white/10">Lens Flare</span>
          </div>
        </div>
      </div>

      {/* Interactive Glossary Section */}
      <section className="glass-morphism rounded-[4rem] p-12 border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-glow blur-[120px] -mr-48 -mt-48 opacity-20"></div>
        <div className="max-w-4xl space-y-8 relative z-10">
          <h2 className="text-3xl font-black uppercase tracking-tight">Artifi Glossary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="space-y-2">
              <h4 className="text-sm font-black text-white uppercase tracking-widest">Synthetic OPS</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">The unit of neural power required to forge an asset. More complex renders (like 4K Video) require more OPS.</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-black text-white uppercase tracking-widest">Temporal Forge</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">The 24-hour cycle of the app. Every cycle, the Deep Red accent shifts and the Daily Discovery resets.</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-black text-white uppercase tracking-widest">Neural Node</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">The dedicated compute instance assigned to your account during an active session.</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-black text-white uppercase tracking-widest">Keyframe Memory</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">The static image used as the blueprint for video motion. Better keyframes lead to smoother cinematic output.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <div className="text-center pb-20">
        <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-[10px] mb-8">Ready to Initialize?</p>
        <div className="flex justify-center gap-6">
          <button className="px-10 py-5 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">Start Forging</button>
          <button className="px-10 py-5 glass-morphism text-white rounded-2xl font-black text-sm uppercase tracking-widest border border-white/10 hover:bg-white/5 transition-all">View Showcase</button>
        </div>
      </div>
    </div>
  );
};

export default Academy;
