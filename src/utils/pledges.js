// Predefined pledges for behavioral change with ecological impact metrics

export const PLEDGES = [
  {
    id: "meatless-mondays",
    category: "diet",
    title: "Meat-Free Mondays",
    description: "Commit to plant-based meals at least one full day every week.",
    co2Reduction: 0.4, // tons/year
    scoreBoost: 5,
    icon: "UtensilsCrossed",
    visualImpact: {
      forest: "Wildflowers and soft grasses begin carpetting the forest floor.",
      glacier: "Slows soot deposition, keeping the glacier snow crust clean.",
      reef: "Reduces agricultural nitrogen runoff, easing algae blooms."
    }
  },
  {
    id: "commute-swap",
    category: "transport",
    title: "Active Commuter",
    description: "Replace at least 2 days of solo car driving with public transit, cycling, or walking.",
    co2Reduction: 0.9,
    scoreBoost: 8,
    icon: "Bike",
    visualImpact: {
      forest: "Lifts the gray carbon haze, revealing a clear sky overhead.",
      glacier: "Lowers surrounding air temperature, reducing glacial river runoff.",
      reef: "Reduces dissolved engine combustion chemicals from water columns."
    }
  },
  {
    id: "flight-fast",
    category: "flights",
    title: "Staycation Advocate",
    description: "Commit to replacing one long-haul or international flight this year with local rail travel.",
    co2Reduction: 1.3,
    scoreBoost: 11,
    icon: "PlaneTakeoff",
    visualImpact: {
      forest: "Encourages migrating birds to nest in the evergreen branches.",
      glacier: "Re-hardens top snow layers, strengthening ice shelf structures.",
      reef: "Minimizes high-altitude contrail thermal forcing on sea temperatures."
    }
  },
  {
    id: "green-power",
    category: "energy",
    title: "Renewable Power Tariff",
    description: "Switch your home electric utility plan to a certified 100% wind/solar source.",
    co2Reduction: 2.1,
    scoreBoost: 16,
    icon: "Zap",
    visualImpact: {
      forest: "Decommissions the coal smokestack, replacing it with a clean wind turbine.",
      glacier: "Prevents carbon particle rain, stabilizing the ice glacier's core.",
      reef: "Protects deep marine habitats from high global-warming ocean heatwaves."
    }
  },
  {
    id: "zero-waste",
    category: "consumption",
    title: "Conscious Consumer",
    description: "Prioritize second-hand buying, compost food waste, and eliminate single-use plastics.",
    co2Reduction: 0.7,
    scoreBoost: 6,
    icon: "ShoppingBag",
    visualImpact: {
      forest: "Cleans up plastic debris, litter, and toxic run-off from the forest floor.",
      glacier: "Curbs landfill methane emissions that trigger accelerated ice fractures.",
      reef: "Clears toxic microplastics and floating trash bags from the coral lagoon."
    }
  }
];
