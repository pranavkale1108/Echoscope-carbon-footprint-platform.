import React, { useState, useEffect } from 'react';
import AuthScreen from './components/AuthScreen';
import EcoAnchorSelector from './components/EcoAnchorSelector';
import Calculator from './components/Calculator';
import ResultsSection from './components/ResultsSection';
import PledgeBuilder from './components/PledgeBuilder';
import Dashboard from './components/Dashboard';
import { calculateFootprint } from './utils/carbonCalculator';
import { auth, isFirebaseConfigured } from './config/firebase';
import { Trees, Compass, HelpCircle, LogOut, User } from 'lucide-react';

export default function App() {
  const [phase, setPhase] = useState('AUTH');
  const [currentUser, setCurrentUser] = useState(null);
  const [authBypassed, setAuthBypassed] = useState(false);
  const [idToken, setIdToken] = useState(null);

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

  // Listen for Firebase auth state changes
  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
          setCurrentUser(user);
          const token = await user.getIdToken();
          setIdToken(token);
          setAuthBypassed(false);
          
          // Restore saved phase or go to Landing
          const savedPhase = localStorage.getItem('echoscope_phase');
          setPhase(savedPhase && savedPhase !== 'AUTH' ? savedPhase : 'LANDING');
        } else {
          setCurrentUser(null);
          setIdToken(null);
          setPhase('AUTH');
        }
      });
      return unsubscribe;
    } else {
      // If Firebase is not configured, start at Auth screen for local bypass
      setPhase('AUTH');
    }
  }, []);

  // Sync state changes to LocalStorage
  useEffect(() => {
    try {
      if (phase !== 'AUTH') {
        localStorage.setItem('echoscope_phase', phase);
      }
      if (anchor) localStorage.setItem('echoscope_anchor', anchor);
      if (answers) localStorage.setItem('echoscope_answers', JSON.stringify(answers));
      if (footprint) localStorage.setItem('echoscope_footprint', footprint.toString());
      localStorage.setItem('echoscope_active_pledges', JSON.stringify(activePledges));
    } catch (e) {
      console.warn("Could not save state to localStorage", e);
    }
  }, [phase, anchor, answers, footprint, activePledges]);

  const handleAuthSuccess = async (user) => {
    setCurrentUser(user);
    const token = await user.getIdToken();
    setIdToken(token);
    setPhase('LANDING');
  };

  const handleBypassSuccess = (mockUser) => {
    setCurrentUser(mockUser);
    setAuthBypassed(true);
    setIdToken('mock_bypass_token');
    setPhase('LANDING');
  };

  const handleSignOut = async () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      // Clear storage
      try {
        localStorage.clear();
      } catch (e) {
        console.warn(e);
      }

      // Reset local variables
      setAnchor(null);
      setAnswers(null);
      setFootprint(0);
      setActivePledges([]);

      if (authBypassed) {
        setCurrentUser(null);
        setAuthBypassed(false);
        setIdToken(null);
        setPhase('AUTH');
      } else if (auth) {
        await auth.signOut();
      }
    }
  };

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
    if (window.confirm("Are you sure you want to reset your carbon profile? This will not log you out.")) {
      setAnchor(null);
      setAnswers(null);
      setFootprint(0);
      setActivePledges([]);
      setPhase('LANDING');
      try {
        localStorage.removeItem('echoscope_anchor');
        localStorage.removeItem('echoscope_answers');
        localStorage.removeItem('echoscope_footprint');
        localStorage.removeItem('echoscope_active_pledges');
        localStorage.removeItem('echoscope_daily_habits');
        localStorage.removeItem('echoscope_streak');
        localStorage.removeItem('echoscope_total_days');
      } catch (e) {
        console.warn(e);
      }
    }
  };

  // Render sub-page based on active phase
  const renderPhase = () => {
    switch (phase) {
      case 'AUTH':
        return (
          <AuthScreen 
            onAuthSuccess={handleAuthSuccess} 
            onBypassSuccess={handleBypassSuccess} 
          />
        );
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
            idToken={idToken}
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
            onClick={phase !== 'AUTH' && phase !== 'LANDING' ? handleReset : undefined} 
            className="flex items-center gap-2 group cursor-pointer"
            disabled={phase === 'AUTH'}
          >
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white group-hover:scale-105 transition-transform duration-200">
              <Trees className="w-4 h-4" />
            </div>
            <span className="font-outfit font-extrabold tracking-tight text-white text-base">
              ECHOSCOPE
            </span>
          </button>

          {/* Current location banner */}
          {phase !== 'AUTH' && (
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
          )}

          {/* User profile & sign-out options */}
          {currentUser ? (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>{currentUser.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-white/5 hover:border-red-500/20 text-slate-400 hover:text-red-400 rounded-lg text-xs font-semibold uppercase transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <a
              href="https://www.un.org/en/climatechange/science/causes-effects-climate-change" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Climate Science</span>
            </a>
          )}
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
