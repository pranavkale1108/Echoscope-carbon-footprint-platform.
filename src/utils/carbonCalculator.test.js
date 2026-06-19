import { describe, it, expect } from 'vitest';
import {
  calculateFootprint,
  calculateHealthScore,
  getEmotionalMetaphors,
  getAverages
} from './carbonCalculator';

describe('Carbon Calculator Utility Tests', () => {

  // Test 1: Core logic of calculateFootprint with valid answers
  describe('calculateFootprint - Core Logic & Valid Inputs', () => {
    it('should correctly calculate the carbon footprint for a low-impact/vegan lifestyle', () => {
      const answers = {
        diet: 'vegan',
        transport: 'active',
        flights: 'never',
        energy: 'renewable',
        consumption: 'minimalist'
      };
      
      // Expected: 0.6 (vegan) + 0.0 (active) + 0.0 (never) + 0.2 (renewable) + 0.3 (minimalist) = 1.1 tons
      const result = calculateFootprint(answers);
      expect(result).toBe(1.1);
    });

    it('should correctly calculate the carbon footprint for a high-impact lifestyle', () => {
      const answers = {
        diet: 'meat-heavy',
        transport: 'suv',
        flights: 'frequent',
        energy: 'coal-grid',
        consumption: 'high'
      };

      // Expected: 3.2 (meat-heavy) + 4.6 (suv) + 6.2 (frequent) + 4.2 (coal-grid) + 2.6 (high) = 20.8 tons
      const result = calculateFootprint(answers);
      expect(result).toBe(20.8);
    });
  });

  // Test 2: Core logic of calculateHealthScore with various inputs and bounds
  describe('calculateHealthScore - Bounds and Clamping', () => {
    it('should return a health score of 99 for footprints at or below the minimum sustainable target (1.5 tons)', () => {
      expect(calculateHealthScore(1.5)).toBe(99);
      expect(calculateHealthScore(1.0)).toBe(99);
      expect(calculateHealthScore(0.0)).toBe(99);
    });

    it('should return a health score of 5 for footprints at or above the maximum target (18.0 tons)', () => {
      expect(calculateHealthScore(18.0)).toBe(5);
      expect(calculateHealthScore(25.0)).toBe(5);
    });

    it('should return a proportional score for footprints between the minimum and maximum', () => {
      // Midpoint: 9.75 tons should yield a score around 52
      // percentage = (9.75 - 1.5) / (18 - 1.5) = 8.25 / 16.5 = 0.5
      // score = 99 - 0.5 * (99 - 5) = 99 - 47 = 52
      expect(calculateHealthScore(9.75)).toBe(52);
      
      // A sustainable target like 2.0 tons
      // percentage = (2 - 1.5) / 16.5 = 0.5 / 16.5 = 0.0303
      // score = 99 - 0.0303 * 94 = 99 - 2.85 = 96.15 -> round to 96
      expect(calculateHealthScore(2.0)).toBe(96);
    });
  });

  // Test 3: Core logic of getEmotionalMetaphors
  describe('getEmotionalMetaphors - Conversions', () => {
    it('should calculate correct emotional metaphors for a footprint of 10.0 tons', () => {
      const metaphors = getEmotionalMetaphors(10.0);
      
      // iceMelted = Math.round(10.0 * 3.0 * 10) / 10 = 30.0
      expect(metaphors.iceMelted).toBe(30.0);
      
      // treesNeeded = Math.round(10.0 / 0.022) = 455
      expect(metaphors.treesNeeded).toBe(455);
      
      // heaterHours = Math.round(10.0 * 1000) = 10000
      expect(metaphors.heaterHours).toBe(10000);
      
      // flightEquivalents = Math.round((10.0 / 1.6) * 10) / 10 = 6.3
      expect(metaphors.flightEquivalents).toBe(6.3);
    });
  });

  // Test 4: Edge case and error handling (fallback for missing or invalid answers)
  describe('calculateFootprint - Edge Cases & Error Handling', () => {
    it('should fall back to default average values if answers is an empty object', () => {
      const answers = {};
      
      // Expected fallbacks (second option from CATEGORY_IMPACTS for each category):
      // diet: balanced -> 1.9
      // transport: car -> 2.4
      // flights: occasional -> 1.6
      // energy: clean-grid -> 1.8
      // consumption: moderate -> 1.1
      // Total fallback footprint: 1.9 + 2.4 + 1.6 + 1.8 + 1.1 = 8.8
      const result = calculateFootprint(answers);
      expect(result).toBe(8.8);
    });

    it('should fall back to defaults only for invalid or missing categories while respecting valid inputs', () => {
      const answers = {
        diet: 'vegan', // valid: 0.6
        transport: 'invalid-transport', // invalid: fallback to car (2.4)
        // flights: missing -> fallback to occasional (1.6)
        energy: 'clean-grid', // valid: 1.8
        consumption: 'minimalist' // valid: 0.3
      };
      
      // Expected total: 0.6 + 2.4 + 1.6 + 1.8 + 0.3 = 6.7 tons
      const result = calculateFootprint(answers);
      expect(result).toBe(6.7);
    });
  });

  // Test 5: Averages verification
  describe('getAverages', () => {
    it('should return correct baseline values', () => {
      expect(getAverages()).toEqual({
        usa: 16.0,
        europe: 6.4,
        global: 4.7,
        sustainable: 2.0
      });
    });
  });
});
