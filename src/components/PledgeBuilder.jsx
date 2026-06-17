import React, { useState } from 'react';
import { PLEDGES } from '../utils/pledges';
import EcosystemVisualizer from './EcosystemVisualizer';
import { calculateFootprint, calculateHealthScore } from '../utils/carbonCalculator';
import { UtensilsCrossed, Bike, PlaneTakeoff, Zap, ShoppingBag, Sparkles, Check } from 'lucide-react';

// Icon mapper for Lucide icons defined in pledges
const ICON_MAP = {
  UtensilsCrossed: UtensilsCrossed,
  Bike: Bike,
  PlaneTakeoff: PlaneTakeoff,
  Zap: Zap,
  ShoppingBag: ShoppingBag
};

export default function PledgeBuilder({ initialAnswers, anchor, onComplete }) {
  const [activePledges, setActivePledges] = useState([]);

  const handleTogglePledge = (pledgeId) => {
    setActivePledges(prev => 
      prev.includes(pledgeId) 
        ? prev.filter(id => id !== pledgeId) 
        : [...prev, pledgeId]
    );
  };

  const initialFootprint = calculateFootprint(initialAnswers);
  
  // Calculate reduced footprint
  let reducedFootprint = initialFootprint;
  activePledges.forEach(pledgeId => {
    const pledge = PLEDGES.find(p => p.id === pledgeId);
    if (pledge) {
      reducedFootprint -= pledge.co2Reduction;
    }
  });
  reducedFootprint = Math.max(0.1, Math.round(reducedFootprint * 10) / 10);

  const restoredScore = calculateHealthScore(reducedFootprint);
  const totalSaving = Math.round((initialFootprint - reducedFootprint) * 10) / 10;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
            RESTORATION WORKSHOP
          </span>
          <h2 className="text-2xl md:text-3xl font-bold font-outfit text-slate-100 mt-1">
            Rebuild Your Environment
          </h2>
        </div>
        
        {/* Total saving badge */}
        {totalSaving > 0 && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 animate-pulse">
            <Sparkles className="w-4 h-4" />
            Saving {totalSaving} Tons CO₂ / Yr
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Pledge Selection Stack */}
        <div className="lg:col-span-7 space-y-4">
          <p className="text-slate-300 text-sm font-light leading-relaxed mb-4">
            Select the carbon-reduction habits you are willing to adopt. Watch the preview ecosystem to see how your commitment physically restores the biome.
          </p>

          <div className="space-y-4">
            {PLEDGES.map(pledge => {
              const IconComponent = ICON_MAP[pledge.icon] || Sparkles;
              const isActive = activePledges.includes(pledge.id);
              
              return (
                <button
                  key={pledge.id}
                  onClick={() => handleTogglePledge(pledge.id)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-start gap-4 relative group overflow-hidden ${
                    isActive
                      ? 'border-emerald-500 bg-emerald-500/10 text-white'
                      : 'border-white/5 bg-slate-900/40 hover:bg-slate-800/40 hover:border-white/10 text-slate-300'
                  }`}
                >
                  {/* Icon */}
                  <div className={`p-3 rounded-xl ${
                    isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                  }`}>
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {/* Descriptions */}
                  <div className="flex-grow pr-8">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-sm tracking-wide group-hover:text-white">
                        {pledge.title}
                      </h4>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-800 border border-white/5 text-slate-400">
                        -{pledge.co2Reduction} tons CO₂
                      </span>
                    </div>
                    
                    <p className="text-slate-300 text-xs font-light leading-relaxed mt-1.5">
                      {pledge.description}
                    </p>
                    
                    {/* Visual restoration effect text */}
                    <div className="mt-2.5 pt-2.5 border-t border-white/5 flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                        Ecosystem Restoration:
                      </span>
                      <span className="text-[11px] font-light text-slate-300 italic leading-tight">
                        {pledge.visualImpact[anchor]}
                      </span>
                    </div>
                  </div>

                  {/* Selected indicator */}
                  <div className={`absolute top-5 right-5 w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                    isActive 
                      ? 'bg-emerald-500 border-emerald-500 text-white scale-100' 
                      : 'border-slate-700 text-transparent scale-90 group-hover:border-slate-500'
                  }`}>
                    <Check className="w-3.5 h-3.5" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Live Restoration Preview */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <EcosystemVisualizer anchor={anchor} score={restoredScore} activePledges={activePledges} />

          {/* Restoration Comparison Statistics */}
          <div className="glass-panel p-5 rounded-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-white/5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Restoration Stats</span>
              <span className="text-[10px] font-extrabold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded uppercase border border-blue-500/20">
                Pledged: {activePledges.length} / {PLEDGES.length}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] tracking-widest font-semibold text-slate-400 block mb-1">
                  Adjusted Footprint
                </span>
                <span className="text-2xl font-extrabold text-white font-outfit">
                  {reducedFootprint} <span className="text-xs font-light text-slate-400">tons</span>
                </span>
              </div>

              <div>
                <span className="text-[10px] tracking-widest font-semibold text-slate-400 block mb-1">
                  Eco-Health Recovery
                </span>
                <span className="text-2xl font-extrabold text-emerald-400 font-outfit">
                  {restoredScore}%
                </span>
              </div>
            </div>

            <div className="text-[11px] font-light text-slate-400 leading-normal">
              {activePledges.length === 0 ? (
                "Select one or more commitments above. Watch the forest grow green, glaciers freeze, or corals colorize in response to your pledge."
              ) : (
                "Excellent! You have initiated the restoration. Click the seal button below to activate your tracking companion dashboard."
              )}
            </div>
          </div>

          {/* Proceed Button */}
          <button
            onClick={() => onComplete(activePledges)}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold tracking-wider uppercase text-xs rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer scale-100 active:scale-95"
          >
            Seal Commitments & Open Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
