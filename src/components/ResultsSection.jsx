import React from 'react';
import { ArrowRight, Flame, Snowflake, Compass, Trees, HeartHandshake } from 'lucide-react';
import { getEmotionalMetaphors, getAverages, calculateHealthScore } from '../utils/carbonCalculator';

export default function ResultsSection({ footprint, anchor, onNext }) {
  const { iceMelted, treesNeeded, heaterHours, flightEquivalents } = getEmotionalMetaphors(footprint);
  const averages = getAverages();
  const healthScore = calculateHealthScore(footprint);

  const averageItems = [
    { label: 'Your Footprint', value: footprint, color: 'bg-gradient-to-r from-red-500 to-amber-500', bold: true },
    { label: 'USA Average', value: averages.usa, color: 'bg-slate-700' },
    { label: 'European Average', value: averages.europe, color: 'bg-slate-700' },
    { label: 'Global Average', value: averages.global, color: 'bg-slate-700' },
    { label: 'Sustainable Target', value: averages.sustainable, color: 'bg-gradient-to-r from-emerald-500 to-teal-500', accent: true }
  ];

  // Find max value for percentage scaling in the bar chart
  const maxValue = Math.max(...averageItems.map(item => item.value));

  return (
    <section className="max-w-4xl mx-auto px-4 py-8 animate-fade-in" aria-labelledby="results-title">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="text-xs font-bold text-red-400 uppercase tracking-widest block mb-2">
          THE ANALYSIS
        </span>
        <h1 id="results-title" className="text-4xl md:text-5xl font-extrabold tracking-tight text-white font-outfit mb-4">
          The Weight of Your Footprint
        </h1>
        <p className="text-slate-400 font-light max-w-xl mx-auto leading-relaxed text-sm">
          Below is a breakdown of your lifestyle's impact. Before we look at solutions, let's understand what your habits demand from the environment.
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Left: Tonnage Circle & Comparison Chart */}
        <div className="glass-panel p-6 md:p-8 rounded-2xl flex flex-col justify-between">
          <div>
            <span className="text-[10px] tracking-widest font-extrabold text-slate-400 uppercase block mb-6">
              CO₂ EMISSIONS SCORECARD
            </span>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 rounded-full bg-slate-900 border border-red-500/25 flex flex-col items-center justify-center relative shadow-lg shadow-red-500/5" aria-label={`Footprint: ${footprint} Tons per year`}>
                <span className="text-3xl font-extrabold text-red-400 font-outfit">{footprint}</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400">Tons / Yr</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-100 font-outfit">Your Eco-Score: {healthScore}/100</h2>
                <p className="text-slate-400 text-xs font-light leading-relaxed mt-1">
                  {healthScore > 75 
                    ? "Excellent! Your footprint is close to the planet's sustainable carrying capacity."
                    : healthScore > 45 
                      ? "Average. There is significant room to optimize your lifestyle and reduce impact."
                      : "Critical. Your habits require carbon outputs that local biomes cannot sustain."}
                </p>
              </div>
            </div>

            {/* Custom Bar Chart */}
            <div className="space-y-4">
              <span className="text-[10px] tracking-widest font-bold text-slate-400 uppercase block mb-2">
                Comparative Footprint (Tons CO₂)
              </span>
              {averageItems.map((item, idx) => {
                const widthPercent = (item.value / maxValue) * 100;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className={item.bold ? "text-white font-bold" : "text-slate-400"}>
                        {item.label}
                      </span>
                      <span className={item.bold ? "text-red-400 font-bold" : item.accent ? "text-emerald-400 font-bold" : "text-slate-300"}>
                        {item.value} tons
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-900/60 rounded-full overflow-hidden border border-white/5" aria-hidden="true">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${item.color}`}
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Emotional Metaphors */}
        <div className="glass-panel p-6 md:p-8 rounded-2xl flex flex-col justify-between">
          <div>
            <span className="text-[10px] tracking-widest font-extrabold text-slate-400 uppercase block mb-6">
              PERSONAL BIOSPHERE BURDEN
            </span>

            <div className="grid grid-cols-1 gap-6">
              {/* Metaphor 1: Arctic Sea Ice */}
              <div className="flex gap-4">
                <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 h-fit">
                  <Snowflake className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Arctic Sea Ice Dissolved</h3>
                  <span className="text-2xl font-bold font-outfit text-slate-100 mt-0.5 block">{iceMelted} m²</span>
                  <p className="text-slate-300 text-xs font-light leading-relaxed mt-1">
                    Your annual carbon emissions directly trigger the summer melt of {iceMelted} square meters of marine glaciers.
                  </p>
                </div>
              </div>

              {/* Metaphor 2: Deforestation / Trees */}
              <div className="flex gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 h-fit">
                  <Trees className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Offset Forest Required</h3>
                  <span className="text-2xl font-bold font-outfit text-slate-100 mt-0.5 block">{treesNeeded} Trees</span>
                  <p className="text-slate-300 text-xs font-light leading-relaxed mt-1">
                    To absorb the carbon your lifestyle emits, {treesNeeded} mature trees must filter the atmosphere for a full year.
                  </p>
                </div>
              </div>

              {/* Metaphor 3: Space Heater / Thermal Output */}
              <div className="flex gap-4">
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 h-fit">
                  <Flame className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Space Heater Equivalent</h3>
                  <span className="text-2xl font-bold font-outfit text-slate-100 mt-0.5 block">{heaterHours.toLocaleString()} Hours</span>
                  <p className="text-slate-300 text-xs font-light leading-relaxed mt-1">
                    The heat trapped in our oceans and atmosphere from your greenhouse footprint matches running a household space heater continuously for {heaterHours.toLocaleString()} hours.
                  </p>
                </div>
              </div>

              {/* Metaphor 4: Flight */}
              <div className="flex gap-4">
                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 h-fit">
                  <Compass className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">NYC-London Flights Equivalent</h3>
                  <span className="text-2xl font-bold font-outfit text-slate-100 mt-0.5 block">{flightEquivalents} Flights</span>
                  <p className="text-slate-300 text-xs font-light leading-relaxed mt-1">
                    Your lifestyle emissions are equivalent to flying transatlantic {flightEquivalents} times a year.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="glass-panel-light p-6 md:p-8 rounded-2xl text-center border border-white/5">
        <h2 className="text-xl md:text-2xl font-bold font-outfit text-white mb-2">
          You hold the power to restore the landscape.
        </h2>
        <p className="text-slate-400 text-xs md:text-sm font-light max-w-xl mx-auto leading-relaxed mb-6">
          Knowing your impact is the first step. Next, enter the pledge workshop to commit to simple lifestyle modifications. Watch your visual ecosystem heal in real-time.
        </p>
        <button
          onClick={onNext}
          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold tracking-wider uppercase text-xs rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2 mx-auto cursor-pointer scale-100 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          <HeartHandshake className="w-4 h-4" aria-hidden="true" />
          Enter Pledge Workshop
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
