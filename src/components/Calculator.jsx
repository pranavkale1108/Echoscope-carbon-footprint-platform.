import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react';
import EcosystemVisualizer from './EcosystemVisualizer';
import { calculateFootprint, calculateHealthScore } from '../utils/carbonCalculator';

const QUESTIONS = [
  {
    id: 'diet',
    title: 'What fuels your body?',
    description: 'Food production accounts for over a quarter of global greenhouse gas emissions. Choose the card that best fits your daily nutrition.',
    options: [
      { value: 'meat-heavy', label: 'Meat-Loving', desc: 'Frequent red meat, poultry, and dairy on a daily basis.', emoji: '🥩' },
      { value: 'balanced', label: 'Balanced', desc: 'Moderate meat, poultry, and fish alongside vegetables.', emoji: '🥗' },
      { value: 'vegetarian', label: 'Vegetarian', desc: 'No meat or fish, but regular eggs, cheese, and dairy.', emoji: '🧀' },
      { value: 'vegan', label: 'Plant-Based', desc: 'Exclusively grains, legumes, vegetables, and fruit.', emoji: '🌱' }
    ]
  },
  {
    id: 'transport',
    title: 'How do you traverse local roads?',
    description: 'Daily commuting is a massive driver of individual emissions. Select your primary mode of ground transportation.',
    options: [
      { value: 'suv', label: 'Large SUV / Truck', desc: 'Standard large gasoline/diesel engine with high fuel consumption.', emoji: '🛻' },
      { value: 'car', label: 'Standard Sedan', desc: 'Average-sized combustion passenger vehicle.', emoji: '🚗' },
      { value: 'hybrid-ev', label: 'Hybrid / Electric', desc: 'Highly efficient hybrid vehicle or fully electric car.', emoji: '⚡' },
      { value: 'transit', label: 'Public Transit', desc: 'Bus, subway, commuter rail, or shared shuttle.', emoji: '🚌' },
      { value: 'active', label: 'Active Transit', desc: 'Walk, cycle, run, or use kick-scooters for almost all trips.', emoji: '🚲' }
    ]
  },
  {
    id: 'flights',
    title: 'How often do you take to the skies?',
    description: 'Aviation has an intense, short-term warming effect on the atmosphere. Count your typical flying frequency.',
    options: [
      { value: 'frequent', label: 'Frequent Flyer', desc: 'Multiple long-distance international flights or business travel.', emoji: '✈️' },
      { value: 'occasional', label: 'Occasional Flyer', desc: '1 to 2 holiday or leisure flights per year.', emoji: '🌴' },
      { value: 'rare', label: 'Rare Passenger', desc: 'Only fly domestically or once every few years.', emoji: '🧳' },
      { value: 'never', label: 'Grounded Travel', desc: 'Avoid flights entirely; choose trains, boats, or local holidays.', emoji: '🚆' }
    ]
  },
  {
    id: 'energy',
    title: 'How is your living space powered?',
    description: 'Electricity and heating sources determine the carbon intensity of your home. Select your energy grid mix.',
    options: [
      { value: 'coal-grid', label: 'Coal / Oil Heavy', desc: 'Traditional utility provider running on coal/fossil grids, oil heat.', emoji: '🏭' },
      { value: 'clean-grid', label: 'Mixed Grid / Gas', desc: 'Standard regional grid mix (fossil/renewables) with gas heating.', emoji: '🔥' },
      { value: 'renewable', label: '100% Green Tariff', desc: 'Solar, wind power tariff or home rooftop solar panels.', emoji: '☀️' }
    ]
  },
  {
    id: 'consumption',
    title: 'What is your relationship with physical goods?',
    description: 'Every product manufactured leaves a carbon trail of raw materials, logistics, and end-of-life disposal.',
    options: [
      { value: 'high', label: 'Acquisitive', desc: 'Regularly buy brand-new clothing, electronics, and rarely recycle.', emoji: '🛍️' },
      { value: 'moderate', label: 'Conscious', desc: 'Moderate buy-cycle, recycle packaging, average waste levels.', emoji: '📦' },
      { value: 'minimalist', label: 'Circular / Low-Waste', desc: 'Buy second-hand, compost food waste, repair, and reuse.', emoji: '♻️' }
    ]
  }
];

export default function Calculator({ anchor, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    diet: 'balanced',
    transport: 'car',
    flights: 'occasional',
    energy: 'clean-grid',
    consumption: 'moderate'
  });

  const question = QUESTIONS[currentStep];

  const handleSelectOption = (value) => {
    const updatedAnswers = { ...answers, [question.id]: value };
    setAnswers(updatedAnswers);
    
    // Auto-advance with a brief delay for a polished feel
    if (currentStep < QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 300);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // Intermediate calculations for live feedback
  const tempFootprint = calculateFootprint(answers);
  const tempScore = calculateHealthScore(tempFootprint);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 animate-fade-in">
      {/* Upper Navigation Indicator */}
      <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
        <div>
          <span className="text-[10px] tracking-widest font-extrabold text-blue-400 uppercase">
            Step {currentStep + 1} of {QUESTIONS.length}
          </span>
          <h2 className="text-2xl font-bold font-outfit text-slate-100 mt-1">
            Analyzing Habits
          </h2>
        </div>
        
        {/* Step dots */}
        <div className="flex gap-2">
          {QUESTIONS.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentStep 
                  ? 'w-8 bg-blue-500' 
                  : idx < currentStep 
                    ? 'w-2 bg-indigo-500/60' 
                    : 'w-2 bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Grid: Questionnaire Left, Live Visualizer Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Question Box */}
        <div className="lg:col-span-7 flex flex-col justify-between min-h-[420px] glass-panel p-6 md:p-8 rounded-2xl relative">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
              HABIT PROFILE
            </span>
            <h3 className="text-2xl md:text-3xl font-bold font-outfit text-slate-100 mb-3 leading-tight">
              {question.title}
            </h3>
            <p className="text-slate-300 text-sm font-light leading-relaxed mb-6">
              {question.description}
            </p>

            {/* Options list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {question.options.map((opt) => {
                const isSelected = answers[question.id] === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleSelectOption(opt.value)}
                    className={`flex items-start text-left p-4 rounded-xl border transition-all duration-300 group relative ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500/10 text-slate-100'
                        : 'border-white/5 bg-slate-900/40 hover:bg-slate-800/40 hover:border-white/10 text-slate-300'
                    }`}
                  >
                    <span className="text-2xl mr-3" role="img" aria-label={opt.label}>
                      {opt.emoji}
                    </span>
                    <div className="flex-grow">
                      <span className="font-bold text-sm block mb-1 group-hover:text-white">
                        {opt.label}
                      </span>
                      <span className="text-[11px] font-light text-slate-400 block leading-normal">
                        {opt.desc}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Controls */}
          <div className="flex justify-between items-center border-t border-white/5 pt-6 mt-4">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all ${
                currentStep === 0
                  ? 'text-slate-600 cursor-not-allowed opacity-50'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            {currentStep < QUESTIONS.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg text-xs font-bold tracking-wider uppercase transition-all"
              >
                Skip Question
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => onComplete(answers)}
                className="flex items-center gap-1.5 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg text-xs font-extrabold tracking-wider uppercase shadow-lg shadow-emerald-500/10 transition-all scale-100 active:scale-95 animate-pulse"
              >
                <Sparkles className="w-4 h-4" />
                Reveal My Impact
              </button>
            )}
          </div>
        </div>

        {/* Right: Live Interactive Ecosystem Visualizer */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <EcosystemVisualizer anchor={anchor} score={tempScore} />
          
          {/* Live Footprint Metric Panel */}
          <div className="glass-panel p-5 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] tracking-widest font-extrabold text-slate-400 uppercase block mb-1">
                Estimated Current Footprint
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white font-outfit">
                  {tempFootprint}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  tons CO₂ / year
                </span>
              </div>
            </div>
            
            {/* Quick Average Gauge */}
            <div className="text-right">
              <span className="text-[10px] tracking-widest font-semibold text-slate-400 block mb-1">
                Global Average
              </span>
              <span className="text-sm font-bold text-blue-300">
                4.7 tons
              </span>
            </div>
          </div>

          <div className="bg-slate-900/30 border border-white/5 rounded-xl p-4 text-xs font-light text-slate-400 leading-relaxed">
            <span className="font-semibold text-slate-300 block mb-1">🌿 Real-time Carbon Echo:</span>
            As you toggle cards, watch how your selections dynamically shape the environment. 
            High footprint behaviors introduce dark smog, melt glaciers, or bleach coral, while low-carbon choices keep the biome alive and healthy.
          </div>
        </div>
      </div>
    </div>
  );
}
