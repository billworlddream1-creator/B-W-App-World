
import React from 'react';
import { PRICING_PLANS } from '../constants';

interface PricingProps {
  onUpgrade: (planId: string) => void;
  currentPlan: string;
}

const PricingPage: React.FC<PricingProps> = ({ onUpgrade, currentPlan }) => {
  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-700 py-6">
      <header className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-5xl font-black tracking-tighter primary-gradient-text">Power Your Ambition</h1>
        <p className="text-slate-400 text-lg font-medium leading-relaxed">Scaling creative output requires high-performance energy. Choose the compute allocation that fits your workflow.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {PRICING_PLANS.map((plan) => (
          <div 
            key={plan.id}
            className={`glass-morphism p-10 rounded-[3rem] flex flex-col transition-all duration-500 relative group overflow-hidden ${
              currentPlan === plan.id 
                ? 'border-indigo-500/50 bg-indigo-600/5 shadow-[0_20px_50px_rgba(99,102,241,0.2)]' 
                : 'border-white/5 hover:border-indigo-500/30 hover:bg-white/5'
            }`}
          >
            {plan.id === 'monthly' && (
              <div className="absolute top-6 right-6 px-3 py-1 bg-indigo-600 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-lg">
                Elite Choice
              </div>
            )}

            <div className="mb-10">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-indigo-400 mb-6">{plan.name}</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black tracking-tighter">${plan.price}</span>
                <span className="text-slate-500 text-sm font-bold lowercase tracking-normal">/{plan.interval}</span>
              </div>
            </div>

            <div className="flex-1 space-y-6 mb-10">
              <div className="p-5 bg-white/5 rounded-3xl border border-white/5 flex items-center gap-4 group-hover:bg-indigo-600/10 group-hover:border-indigo-500/20 transition-all">
                <div className="h-10 w-10 rounded-2xl bg-indigo-600/20 flex items-center justify-center text-indigo-400">
                  <i className="fa-solid fa-bolt-lightning text-lg"></i>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Compute Cycle</p>
                  <p className="text-base font-black tracking-tight">{plan.credits} Units</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm font-medium">
                    <div className="h-5 w-5 rounded-full bg-indigo-600/10 flex items-center justify-center text-indigo-400 text-[10px]">
                      <i className="fa-solid fa-check"></i>
                    </div>
                    <span className="text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              disabled={currentPlan === plan.id}
              onClick={() => onUpgrade(plan.id)}
              className={`w-full py-5 rounded-[1.5rem] font-black text-sm tracking-widest uppercase transition-all shadow-xl ${
                currentPlan === plan.id
                  ? 'bg-white/5 text-slate-500 cursor-default'
                  : 'bg-white text-black hover:bg-indigo-50 hover:scale-105 active:scale-95'
              }`}
            >
              {currentPlan === plan.id ? 'Current Plan' : 'Select Plan'}
            </button>
            
            <div className="mt-6 text-center">
              <p className="text-[9px] font-bold text-slate-500 flex items-center justify-center gap-2 uppercase tracking-widest">
                <i className="fa-brands fa-cc-visa text-xs"></i>
                <i className="fa-brands fa-cc-mastercard text-xs"></i>
                Encrypted Checkout
              </p>
            </div>
          </div>
        ))}
      </div>

      <section className="glass-morphism p-12 rounded-[3.5rem] mt-20 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600/10 via-transparent to-cyan-500/5 -z-10"></div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl space-y-4">
            <h2 className="text-3xl font-black tracking-tight">Enterprise Nexus</h2>
            <p className="text-slate-400 text-lg font-medium leading-relaxed">For production studios requiring high-volume throughput, custom API integrations, and dedicated compute nodes.</p>
          </div>
          <button className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[1.5rem] font-black text-lg transition-all shadow-2xl shadow-indigo-600/30 whitespace-nowrap active:scale-95">
            Contact Architecture
          </button>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
