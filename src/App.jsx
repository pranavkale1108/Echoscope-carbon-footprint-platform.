import React, { useState, useEffect } from 'react';
import EcoAnchorSelector from './components/EcoAnchorSelector';
import Calculator from './components/Calculator';
import ResultsSection from './components/ResultsSection';
import PledgeBuilder from './components/PledgeBuilder';
import Dashboard from './components/Dashboard';
import { calculateFootprint } from './utils/carbonCalculator';
import { Trees, Compass, HelpCircle } from 'lucide-react';

export default function App() {
  const [phase, setPhase] = useState(() => {
    try {
      return localStorage.getItem('echoscope_phase') || 'LANDING';
    } catch {
      return 'LANDING';
    }
  });

  const [anchor, setAnchor] = useState(() => {
    try {
      return localStorage.getItem('echoscope_anchor') || null;
    } catch {
      return null;
    }
  });

  const [answers, setAnswers] = useState(() => {
    try {
      const saved = localStorage.getItem('echoscope_answers');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [footprint, setFootprint] = useState(() => {
    try {
      const saved = localStorage.getItem('echoscope_footprint');
      return saved ? parseFloat(saved) : 0;
    } catch {
      return 0;
    }
  });

  const [activePledges, setActivePledges] = useState(() => {
    try {
      const saved = localStorage.getItem('echoscope_active_pledges');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync state changes to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('echoscope_phase', phase);
      if (anchor) localStorage.setItem('echoscope_anchor', anchor);
      if (answers) localStorage.setItem('echoscope_answers', JSON.stringify(answers));
      if (footprint) localStorage.setItem('echoscope_footprint', footprint.toString());
      localStorage.setItem('echoscope_active_pledges', JSON.stringify(activePledges));
    } catch (e) {
      console.warn("Could not save state to localStorage", e);
    }
  }, [phase, anchor, answers, footprint, activePledges]);

  const handleSelectAnchor = (selectedAnchor) => {
    setAnchor(selectedAnchor);
    setPhase('CALCULATING');
  };

  const handleCalculatorComplete = (calculatorAnswers) => {
    setAnswers(calculatorAnswers);
    const calculated = calculateFootprint(calculatorAnswers);
    setFootprint(calculated);
    setPhase('RESULTS');
  };

  const handleResultsNext = () => {
    setPhase('PLEDGING');
  };

  const handlePledgeComplete = (selectedPledges) => {
    setActivePledges(selectedPledges);
    setPhase('DASHBOARD');
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset your profile and restart your carbon assessment?")) {
      // Clear state
      setPhase('LANDING');
      setAnchor(null);
      setAnswers(null);
      setFootprint(0);
      setActivePledges([]);
      
      // Clear localStorage
      try {
        localStorage.removeItem('echoscope_phase');
        localStorage.removeItem('echoscope_anchor');
        localStorage.removeItem('echoscope_answers');
        localStorage.removeItem('echoscope_footprint');
        localStorage.removeItem('echoscope_active_pledges');
        localStorage.removeItem('echoscope_daily_habits');
        localStorage.removeItem('echoscope_streak');
        localStorage.removeItem('echoscope_total_days');
      } catch (e) {
        console.warn("Could not clear localStorage", e);
      }
    }
  };

  // Render sub-page based on active phase
  const renderPhase = () => {
    switch (phase) {
      case 'LANDING':
        return <EcoAnchorSelector onSelect={handleSelectAnchor} />;
      case 'CALCULATING':
        return <Calculator anchor={anchor} onComplete={handleCalculatorComplete} />;
      case 'RESULTS':
        return <ResultsSection footprint={footprint} anchor={anchor} onNext={handleResultsNext} />;
      case 'PLEDGING':
        return <PledgeBuilder initialAnswers={answers} anchor={anchor} onComplete={handlePledgeComplete} />;
      case 'DASHBOARD':
        return (
          <Dashboard 
            answers={answers} 
            activePledgeIds={activePledges} 
            anchor={anchor} 
            onReset={handleReset} 
          />
        );
      default:
        return <EcoAnchorSelector onSelect={handleSelectAnchor} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden font-sans">
      
      {/* Decorative Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Global Header */}
      <header className="w-full border-b border-white/5 bg-slate-950/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={phase !== 'LANDING' ? handleReset : undefined} 
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white group-hover:scale-105 transition-transform duration-200">
              <Trees className="w-4 h-4" />
            </div>
            <span className="font-outfit font-extrabold tracking-tight text-white text-base">
              ECHOSCOPE
            </span>
          </button>

          {/* Current location banner */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            <span className="uppercase tracking-widest font-semibold text-[10px]">
              {phase === 'LANDING' && 'Initialization'}
              {phase === 'CALCULATING' && 'Assessment'}
              {phase === 'RESULTS' && 'Reflection'}
              {phase === 'PLEDGING' && 'Pledge Workshop'}
              {phase === 'DASHBOARD' && 'Companion Dashboard'}
            </span>
          </div>

          {/* Info Modal / Trigger link */}
          <a
            href="https://www.un.org/en/climatechange/science/causes-effects-climate-change" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Climate Science</span>
          </a>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col justify-center py-6 relative z-10">
        {renderPhase()}
      </main>

      {/* Global Footer */}
      <footer className="w-full py-6 border-t border-white/5 text-center text-xs text-slate-500 relative z-10 bg-slate-950/40">
        <p className="max-w-xl mx-auto leading-relaxed px-4">
          Echoscope translates individual footprint metrics into immediate ecosystem indicators. 
          All calculations are modeled on average annualized global offsets. 
          Make a pledge today to restore the canvas.
        </p>
      </footer>
    </div>
  );
}
