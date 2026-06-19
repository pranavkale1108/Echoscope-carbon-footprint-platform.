import React, { useState } from 'react';
import { Trees, Snowflake, FlameKindling, Navigation } from 'lucide-react';

export default function EcoAnchorSelector({ onSelect }) {
  const [selected, setSelected] = useState(null);

  const anchors = [
    {
      id: 'forest',
      title: 'The Whispering Forest',
      subtitle: 'Atmosphere & Land',
      icon: Trees,
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400 hover:shadow-emerald-500/10 hover:border-emerald-500/60',
      description: 'A sanctuary of towering pines and wildlife, highly sensitive to high greenhouse gas concentrations, wood combustion soot, and industrial smog.',
      impactStat: 'Absorbs carbon to breathe; suffocated by emissions.'
    },
    {
      id: 'glacier',
      title: 'The Silent Glacier',
      subtitle: 'Cryosphere & Climate',
      icon: Snowflake,
      color: 'from-sky-500/20 to-blue-500/10 border-sky-500/30 text-sky-400 hover:shadow-sky-500/10 hover:border-sky-500/60',
      description: 'An ancient dome of ice supporting polar bear families, melting rapidly under rising global temperatures and fine coal-dust deposits.',
      impactStat: 'Melts at 3m² per ton of CO₂ released into the atmosphere.'
    },
    {
      id: 'reef',
      title: 'The Glowing Reef',
      subtitle: 'Hydrosphere & Acidification',
      icon: FlameKindling, // stand-in for coral-like structure / marine warmth
      color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400 hover:shadow-cyan-500/10 hover:border-cyan-500/60',
      description: 'A biodiverse underwater community of colorful corals and sea life, prone to bleaching white as oceans absorb excess carbon heat.',
      impactStat: 'Vulnerable to acidifying water and thermal marine heatwaves.'
    }
  ];

  return (
    <section className="max-w-4xl mx-auto px-4 py-8 flex flex-col justify-center min-h-[80vh] animate-fade-in" aria-labelledby="anchor-selector-heading">
      {/* Hero Header */}
      <div className="text-center mb-10">
        <h1 id="anchor-selector-heading" className="text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 mb-4 font-outfit uppercase">
          Echoscope
        </h1>
        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
          Your carbon footprint is more than a metric—it is a physical weight borne by the planet. 
          Choose a planetary anchor below to mirror your lifestyle in a living, reactive ecosystem.
        </p>
      </div>

      {/* Selector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {anchors.map((item) => {
          const IconComponent = item.icon;
          const isSelected = selected === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setSelected(item.id)}
              aria-pressed={isSelected}
              aria-label={`Select ${item.title} anchor`}
              className={`flex flex-col text-left p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden group glass-panel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
                isSelected 
                  ? `ring-2 ring-blue-500 bg-slate-800/80 border-blue-500/60 shadow-lg shadow-blue-500/10 scale-[1.02]`
                  : item.color
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-slate-900/60 border border-white/5`}>
                  <IconComponent className="w-6 h-6" aria-hidden="true" />
                </div>
                {isSelected && (
                  <span className="text-[10px] tracking-widest font-extrabold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/30 uppercase">
                    Selected
                  </span>
                )}
              </div>

              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                {item.subtitle}
              </span>
              <h2 className="text-xl font-bold text-slate-100 font-outfit mb-3">
                {item.title}
              </h2>
              <p className="text-slate-300 text-sm font-light leading-relaxed mb-4 flex-grow">
                {item.description}
              </p>
              
              <div className="border-t border-white/5 pt-3 mt-auto">
                <span className="text-[11px] font-medium text-slate-400 block italic leading-snug">
                  {item.impactStat}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Action CTA */}
      <div className="text-center">
        <button
          onClick={() => selected && onSelect(selected)}
          disabled={!selected}
          className={`px-8 py-4 rounded-xl font-bold tracking-wider uppercase text-sm transition-all duration-300 flex items-center gap-2 mx-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
            selected
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-xl shadow-indigo-500/20 cursor-pointer scale-100 active:scale-95'
              : 'bg-slate-800/40 text-slate-500 border border-white/5 cursor-not-allowed'
          }`}
        >
          <Navigation className="w-4 h-4" aria-hidden="true" />
          Anchor Your Journey
        </button>
      </div>
    </section>
  );
}
