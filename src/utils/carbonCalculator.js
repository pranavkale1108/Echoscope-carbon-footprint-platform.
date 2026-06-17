// Carbon Footprint Calculations & Emotional Equivalents

// Impact scores in Metric Tons of CO2 per year
export const CATEGORY_IMPACTS = {
  diet: {
    'meat-heavy': 3.2,
    'balanced': 1.9,
    'vegetarian': 1.1,
    'vegan': 0.6
  },
  transport: {
    'suv': 4.6,
    'car': 2.4,
    'hybrid-ev': 0.9,
    'transit': 0.3,
    'active': 0.0
  },
  flights: {
    'frequent': 6.2,
    'occasional': 1.6,
    'rare': 0.5,
    'never': 0.0
  },
  energy: {
    'coal-grid': 4.2,
    'clean-grid': 1.8,
    'renewable': 0.2
  },
  consumption: {
    'high': 2.6,
    'moderate': 1.1,
    'minimalist': 0.3
  }
};

export const calculateFootprint = (answers) => {
  let total = 0;
  
  Object.keys(CATEGORY_IMPACTS).forEach(category => {
    const value = answers[category];
    if (value && CATEGORY_IMPACTS[category][value] !== undefined) {
      total += CATEGORY_IMPACTS[category][value];
    } else {
      // Use fallback default average
      const keys = Object.keys(CATEGORY_IMPACTS[category]);
      total += CATEGORY_IMPACTS[category][keys[1]]; // usually the second option is the average
    }
  });

  // Keep precision to 1 decimal place
  return Math.round(total * 10) / 10;
};

// Calculate Eco-Health Score from 5 (worst) to 99 (best)
export const calculateHealthScore = (footprint) => {
  // 2.0 tons or less is the sustainable target (yields score ~90+)
  // 18.0 tons or more is very high (yields score ~10 or less)
  const maxFootprint = 18.0;
  const minFootprint = 1.5;
  
  if (footprint <= minFootprint) return 99;
  if (footprint >= maxFootprint) return 5;
  
  const percentage = (footprint - minFootprint) / (maxFootprint - minFootprint);
  const score = 99 - percentage * (99 - 5);
  return Math.round(score);
};

// Emotional Metaphor Conversions
export const getEmotionalMetaphors = (footprint) => {
  // 1 ton of CO2 melts 3 square meters of Arctic Sea Ice in summer
  const iceMelted = Math.round(footprint * 3.0 * 10) / 10;

  // 1 mature tree absorbs about 22kg (0.022 tons) of CO2 per year
  const treesNeeded = Math.round(footprint / 0.022);

  // Heat trapped by 1 ton of CO2 is equivalent to running a space heater (1.5 kW)
  // for roughly 1,000 hours in terms of net atmospheric warming effect
  const heaterHours = Math.round(footprint * 1000);

  // A round-trip flight from New York to London emits about 1.6 tons of CO2
  const flightEquivalents = Math.round((footprint / 1.6) * 10) / 10;

  return {
    iceMelted,       // sq meters
    treesNeeded,     // count of trees
    heaterHours,     // hours
    flightEquivalents // flights
  };
};

export const getAverages = () => {
  return {
    usa: 16.0,
    europe: 6.4,
    global: 4.7,
    sustainable: 2.0
  };
};
