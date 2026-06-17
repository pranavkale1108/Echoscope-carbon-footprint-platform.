import React, { useState, useEffect } from 'react';
import { PLEDGES } from '../utils/pledges';
import { calculateFootprint, calculateHealthScore } from '../utils/carbonCalculator';
import EcosystemVisualizer from './EcosystemVisualizer';
import { Award, Calendar, CheckSquare, RefreshCw, Share2, Sparkles, Trophy, Download } from 'lucide-react';

export default function Dashboard({ answers, activePledgeIds, anchor, onReset }) {
  // Load habit tracking stats from local storage or set defaults
  const [habitCheckedState, setHabitCheckedState] = useState(() => {
    try {
      const saved = localStorage.getItem('echoscope_daily_habits');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [streak, setStreak] = useState(() => {
    try {
      const saved = localStorage.getItem('echoscope_streak');
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });

  const [totalDaysChecked, setTotalDaysChecked] = useState(() => {
    try {
      const saved = localStorage.getItem('echoscope_total_days');
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });

  // Save changes to local storage
  useEffect(() => {
    localStorage.setItem('echoscope_daily_habits', JSON.stringify(habitCheckedState));
    localStorage.setItem('echoscope_streak', streak.toString());
    localStorage.setItem('echoscope_total_days', totalDaysChecked.toString());
  }, [habitCheckedState, streak, totalDaysChecked]);

  // Filter pledges to only show adopted ones
  const adoptedPledges = PLEDGES.filter(p => activePledgeIds.includes(p.id));

  // Core footprint details
  const baseFootprint = calculateFootprint(answers);
  
  // Calculate potential yearly footprint after pledges
  let pledgedReduction = 0;
  activePledgeIds.forEach(id => {
    const pledge = PLEDGES.find(p => p.id === id);
    if (pledge) pledgedReduction += pledge.co2Reduction;
  });

  const finalFootprint = Math.max(0.1, Math.round((baseFootprint - pledgedReduction) * 10) / 10);

  // Daily performance modifier
  // If user completes all adopted habits for today, they get a +6 health score boost
  const checkedCount = Object.values(habitCheckedState).filter(Boolean).length;
  const isPerfectDay = adoptedPledges.length > 0 && checkedCount === adoptedPledges.length;
  const dailyBoost = isPerfectDay ? 6 : Math.round((checkedCount / (adoptedPledges.length || 1)) * 4);

  const displayScore = Math.min(100, calculateHealthScore(finalFootprint) + dailyBoost);

  // Calculate cumulative CO2 prevented (kg)
  // (Pledge annual savings / 365) * days checked
  const co2PreventedDailyKg = (pledgedReduction * 1000) / 365;
  const totalCo2Prevented = Math.round(co2PreventedDailyKg * totalDaysChecked * 10) / 10;

  // Handle checking off a daily habit
  const handleToggleHabit = (id) => {
    setHabitCheckedState(prev => {
      const newState = { ...prev, [id]: !prev[id] };
      
      // Calculate new checked count
      const newCheckedCount = Object.values(newState).filter(Boolean).length;
      
      // If we just checked a habit and completed everything, increase streak and days checked
      if (newState[id]) {
        setTotalDaysChecked(d => d + 1);
        if (newCheckedCount === adoptedPledges.length) {
          setStreak(s => s + 1);
        }
      } else {
        // If we unchecked and broke a perfect day
        if (Object.values(prev).filter(Boolean).length === adoptedPledges.length) {
          setStreak(s => Math.max(0, s - 1));
        }
        setTotalDaysChecked(d => Math.max(0, d - 1));
      }

      return newState;
    });
  };

  // Reset checklist for a new day
  const handleNewDay = () => {
    setHabitCheckedState({});
  };

  // Canvas Image Exporter (Pledge Card)
  const handleExportCard = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');

    // 1. Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 630);
    bgGrad.addColorStop(0, '#0f172a'); // slate 900
    bgGrad.addColorStop(1, '#020617'); // slate 950
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 630);

    // 2. Translucent Border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 15;
    ctx.strokeRect(20, 20, 1160, 590);

    // 3. Grid Details
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 50; i < 1200; i += 80) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 630);
      ctx.stroke();
    }
    for (let j = 50; j < 630; j += 80) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(1200, j);
      ctx.stroke();
    }

    // 4. Header Titles
    ctx.fillStyle = '#60a5fa'; // blue-400
    ctx.font = 'bold 20px "Outfit", sans-serif';
    ctx.fillText('ECHOSCOPE ECO-COMMITMENT PLEDGE', 80, 80);

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 55px "Outfit", sans-serif';
    ctx.fillText('GUARDIAN OF THE BIOSPHERE', 80, 145);

    // 5. Environmental Anchor
    ctx.fillStyle = '#94a3b8'; // slate-400
    ctx.font = '300 22px "Inter", sans-serif';
    const anchorText = anchor === 'forest' ? 'The Whispering Forest' : anchor === 'glacier' ? 'The Silent Glacier' : 'The Glowing Reef';
    ctx.fillText(`Planetary Anchor: ${anchorText}`, 80, 200);

    // 6. Split Line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(80, 240);
    ctx.lineTo(1120, 240);
    ctx.stroke();

    // 7. Stats Box (Left)
    ctx.fillStyle = 'rgba(30, 41, 59, 0.4)';
    ctx.fillRect(80, 270, 400, 250);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.strokeRect(80, 270, 400, 250);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 14px "Inter", sans-serif';
    ctx.fillText('RESTORED ENVIRONMENTAL SCORE', 110, 310);
    
    ctx.fillStyle = '#10b981'; // emerald-500
    ctx.font = '800 65px "Outfit", sans-serif';
    ctx.fillText(`${displayScore}%`, 110, 385);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '16px "Inter", sans-serif';
    ctx.fillText(`CO₂ Footprint: ${finalFootprint} tons / yr`, 110, 440);
    ctx.fillText(`Annual Savings: ${pledgedReduction} tons`, 110, 470);

    // 8. Commitments List (Right)
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px "Outfit", sans-serif';
    ctx.fillText('My Active Commitments:', 540, 305);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'italic 16px "Inter", sans-serif';
    
    if (adoptedPledges.length === 0) {
      ctx.fillText('• No commitments selected yet.', 540, 350);
    } else {
      adoptedPledges.slice(0, 4).forEach((pledge, index) => {
        ctx.fillStyle = '#34d399'; // emerald-400 checkmark
        ctx.fillText('✓', 540, 350 + index * 45);
        ctx.fillStyle = '#e2e8f0';
        ctx.font = 'bold 16px "Inter", sans-serif';
        ctx.fillText(pledge.title, 565, 350 + index * 45);
        ctx.font = '300 14px "Inter", sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(pledge.description.substring(0, 75), 565, 370 + index * 45);
      });
    }

    // 9. Footer Brand Info
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.font = '14px "Inter", sans-serif';
    ctx.fillText('Generate yours at echoscope.earth', 80, 570);

    // Trigger download
    const link = document.createElement('a');
    link.download = `Echoscope_Pledge_${anchor}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 animate-fade-in">
      {/* Dashboard Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-white/5 pb-6">
        <div>
          <span className="text-[10px] tracking-widest font-extrabold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 uppercase">
            Active Companion
          </span>
          <h2 className="text-3xl font-extrabold font-outfit text-slate-100 mt-2">
            Your Living Mirror
          </h2>
        </div>

        {/* Dashboard Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExportCard}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 border border-white/5 hover:bg-slate-800 text-slate-200 hover:text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-blue-400" />
            Download Pledge Card
          </button>
          
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 border border-white/5 hover:border-red-500/30 text-slate-400 hover:text-red-400 rounded-xl text-xs font-bold tracking-wider uppercase transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Recalculate
          </button>
        </div>
      </div>

      {/* Main Grid: Visualizer Top/Left, Actions Bottom/Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Span: Dynamic SVG and Core Statistics */}
        <div className="lg:col-span-7 space-y-6">
          <EcosystemVisualizer anchor={anchor} score={displayScore} activePledges={activePledgeIds} />

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Stat 1: Prevented Carbon */}
            <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase block">
                Total CO₂ Prevented
              </span>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-emerald-400 font-outfit block">
                  {totalCo2Prevented} <span className="text-sm font-medium text-slate-400">kg</span>
                </span>
                <span className="text-[10px] text-slate-400 font-light block mt-1 leading-normal">
                  Avoided cumulative emissions from logged habits.
                </span>
              </div>
            </div>

            {/* Stat 2: Active Streak */}
            <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase block">
                Pledge Streak
              </span>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-blue-400 font-outfit block">
                  {streak} <span className="text-sm font-medium text-slate-400">Days</span>
                </span>
                {streak > 0 && <Trophy className="w-4 h-4 text-yellow-400 animate-bounce" />}
              </div>
              <span className="text-[10px] text-slate-400 font-light block mt-1 leading-normal">
                Consecutive days achieving all commitments.
              </span>
            </div>

            {/* Stat 3: Adjusted Footprint */}
            <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase block">
                Target Footprint
              </span>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-white font-outfit block">
                  {finalFootprint} <span className="text-sm font-medium text-slate-400">tons</span>
                </span>
                <span className="text-[10px] text-slate-400 font-light block mt-1 leading-normal">
                  Annualized CO₂ target based on selected pledges.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Span: Daily Checklist */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-100 font-outfit">
                  Daily Check-in
                </h3>
                <span className="text-[10px] font-light text-slate-400 block mt-0.5">
                  Log today's actions to nourish your ecosystem.
                </span>
              </div>
              
              <button 
                onClick={handleNewDay}
                className="text-[10px] font-extrabold uppercase text-slate-400 hover:text-white bg-slate-900 border border-white/5 px-2.5 py-1 rounded"
              >
                Reset Checklist
              </button>
            </div>

            {adoptedPledges.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm font-light">
                <p>No pledges adopted.</p>
                <button
                  onClick={onReset}
                  className="mt-3 text-xs font-bold text-blue-400 underline uppercase hover:text-blue-300"
                >
                  Adopt some now
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {adoptedPledges.map((pledge) => {
                  const isChecked = !!habitCheckedState[pledge.id];
                  return (
                    <button
                      key={pledge.id}
                      onClick={() => handleToggleHabit(pledge.id)}
                      className={`w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all ${
                        isChecked 
                          ? 'border-emerald-500 bg-emerald-500/5 text-slate-200' 
                          : 'border-white/5 bg-slate-900/30 hover:bg-slate-900/60 text-slate-300'
                      }`}
                    >
                      <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-all ${
                        isChecked 
                          ? 'bg-emerald-500 border-emerald-500 text-white' 
                          : 'border-slate-600'
                      }`}>
                        {isChecked && <CheckSquare className="w-3.5 h-3.5" />}
                      </div>

                      <div>
                        <span className={`text-sm font-bold block ${isChecked ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                          {pledge.title}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5 leading-relaxed font-light">
                          {pledge.description}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Checklist progress bar */}
            {adoptedPledges.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs font-medium text-slate-400">
                  <span>Today's Progress</span>
                  <span>{checkedCount} / {adoptedPledges.length} Done</span>
                </div>
                <div className="w-full h-2 bg-slate-900/60 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                    style={{ width: `${(checkedCount / adoptedPledges.length) * 100}%` }}
                  />
                </div>
                {isPerfectDay && (
                  <div className="text-[11px] font-bold text-emerald-400 text-center flex items-center justify-center gap-1 mt-1 animate-pulse">
                    <Sparkles className="w-3 h-3" /> Perfect Day! Ecosystem Health Boosted (+6%)
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Educational Insight Box */}
          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
              <Award className="w-4 h-4 text-indigo-400" />
              Impact Insight
            </h4>
            <p className="text-slate-300 text-xs font-light leading-relaxed">
              Every day you check off your commitments, Echoscope updates your cumulative savings. 
              Small habits, when maintained, permanently reshape the landscape. Share your Pledge Card with others to inspire collective restoration!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
