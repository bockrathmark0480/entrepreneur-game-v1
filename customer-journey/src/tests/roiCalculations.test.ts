/**
 * Unit Tests for ROI Calculations
 *
 * Tests the core financial calculation functions used throughout the app.
 */

import { describe, it, expect } from 'vitest';
import {
  calculateAnnualHoursSaved,
  calculateAnnualDollarSavings,
  calculatePaybackPeriod,
  calculateNetROIForYear,
  calculateScalingWithoutOverhead,
  calculateAccumulatedSavings,
  calculateFullROI,
  formatCurrency,
  formatNumber,
  WORK_WEEKS_PER_YEAR,
  MAINTENANCE_RATE,
} from '../utils/roiCalculations';
import type { CartLineItem, ROIInputs, AccumulatedSavings } from '../types';

// ============================================================================
// calculateAnnualHoursSaved Tests
// ============================================================================

describe('calculateAnnualHoursSaved', () => {
  it('should calculate annual hours correctly at 100% adoption', () => {
    const hoursPerWeek = 10;
    const adoptionRate = 100;
    const expected = hoursPerWeek * WORK_WEEKS_PER_YEAR;
    expect(calculateAnnualHoursSaved(hoursPerWeek, adoptionRate)).toBe(expected);
  });

  it('should calculate annual hours correctly at 50% adoption', () => {
    const hoursPerWeek = 10;
    const adoptionRate = 50;
    const expected = hoursPerWeek * WORK_WEEKS_PER_YEAR * 0.5;
    expect(calculateAnnualHoursSaved(hoursPerWeek, adoptionRate)).toBe(expected);
  });

  it('should return 0 when hours per week is 0', () => {
    expect(calculateAnnualHoursSaved(0, 100)).toBe(0);
  });

  it('should return 0 when adoption rate is 0', () => {
    expect(calculateAnnualHoursSaved(10, 0)).toBe(0);
  });

  it('should handle decimal adoption rates', () => {
    const hoursPerWeek = 20;
    const adoptionRate = 70;
    const expected = hoursPerWeek * WORK_WEEKS_PER_YEAR * 0.7;
    expect(calculateAnnualHoursSaved(hoursPerWeek, adoptionRate)).toBe(expected);
  });
});

// ============================================================================
// calculateAnnualDollarSavings Tests
// ============================================================================

describe('calculateAnnualDollarSavings', () => {
  it('should multiply hours by hourly rate', () => {
    const annualHours = 500;
    const hourlyRate = 65;
    expect(calculateAnnualDollarSavings(annualHours, hourlyRate)).toBe(32500);
  });

  it('should return 0 when hours is 0', () => {
    expect(calculateAnnualDollarSavings(0, 65)).toBe(0);
  });

  it('should return 0 when hourly rate is 0', () => {
    expect(calculateAnnualDollarSavings(500, 0)).toBe(0);
  });

  it('should handle large values correctly', () => {
    const annualHours = 2000;
    const hourlyRate = 150;
    expect(calculateAnnualDollarSavings(annualHours, hourlyRate)).toBe(300000);
  });
});

// ============================================================================
// calculatePaybackPeriod Tests
// ============================================================================

describe('calculatePaybackPeriod', () => {
  it('should calculate payback period in months', () => {
    const implementationCost = 10000;
    const annualSavings = 30000;
    // Expected: (10000 / 30000) * 12 = 4 months
    expect(calculatePaybackPeriod(implementationCost, annualSavings)).toBe(4);
  });

  it('should return Infinity when annual savings is 0', () => {
    expect(calculatePaybackPeriod(10000, 0)).toBe(Infinity);
  });

  it('should return Infinity when annual savings is negative', () => {
    expect(calculatePaybackPeriod(10000, -5000)).toBe(Infinity);
  });

  it('should round to one decimal place', () => {
    const implementationCost = 10000;
    const annualSavings = 36000;
    // Expected: (10000 / 36000) * 12 = 3.333... -> 3.3
    expect(calculatePaybackPeriod(implementationCost, annualSavings)).toBe(3.3);
  });

  it('should handle zero implementation cost', () => {
    expect(calculatePaybackPeriod(0, 30000)).toBe(0);
  });
});

// ============================================================================
// calculateNetROIForYear Tests
// ============================================================================

describe('calculateNetROIForYear', () => {
  const annualSavings = 50000;
  const implementationCost = 20000;
  const maintenanceCost = implementationCost * MAINTENANCE_RATE;

  it('should calculate Year 1 ROI including implementation cost', () => {
    const expected = annualSavings - implementationCost - maintenanceCost;
    expect(calculateNetROIForYear(annualSavings, implementationCost, 1)).toBe(expected);
  });

  it('should calculate Year 2 ROI with adoption multiplier', () => {
    const expectedSavings = annualSavings * 1.15;
    const expected = expectedSavings - maintenanceCost;
    expect(calculateNetROIForYear(annualSavings, implementationCost, 2)).toBe(expected);
  });

  it('should calculate Year 3 ROI with higher adoption multiplier', () => {
    const expectedSavings = annualSavings * 1.25;
    const expected = expectedSavings - maintenanceCost;
    expect(calculateNetROIForYear(annualSavings, implementationCost, 3)).toBe(expected);
  });

  it('should return negative ROI for Year 1 when savings are less than costs', () => {
    const lowSavings = 5000;
    const result = calculateNetROIForYear(lowSavings, implementationCost, 1);
    expect(result).toBeLessThan(0);
  });
});

// ============================================================================
// calculateScalingWithoutOverhead Tests
// ============================================================================

describe('calculateScalingWithoutOverhead', () => {
  it('should calculate FTE equivalent cost savings', () => {
    // 40 hours/week = 1 FTE
    const hoursPerWeek = 40;
    // FTE equivalent = (40 * 50) / (40 * 50) = 1
    // Expected: 1 * 85000 = 85000
    expect(calculateScalingWithoutOverhead(hoursPerWeek)).toBe(85000);
  });

  it('should calculate partial FTE savings', () => {
    // 20 hours/week = 0.5 FTE
    const hoursPerWeek = 20;
    // Expected: 0.5 * 85000 = 42500
    expect(calculateScalingWithoutOverhead(hoursPerWeek)).toBe(42500);
  });

  it('should return 0 when hours per week is 0', () => {
    expect(calculateScalingWithoutOverhead(0)).toBe(0);
  });
});

// ============================================================================
// calculateAccumulatedSavings Tests
// ============================================================================

describe('calculateAccumulatedSavings', () => {
  const mockCartItems: CartLineItem[] = [
    {
      chapterId: 'chapter-1',
      chapterTitle: 'Test Chapter 1',
      costUSD: 2500,
      implHours: 8,
      savings: { hoursPerWeek: 6, dollarsPerYear: 15600 },
    },
    {
      chapterId: 'chapter-2',
      chapterTitle: 'Test Chapter 2',
      costUSD: 3500,
      implHours: 12,
      savings: { hoursPerWeek: 8, dollarsPerYear: 20800 },
    },
  ];

  it('should sum up all savings correctly', () => {
    const result = calculateAccumulatedSavings(mockCartItems);
    expect(result.totalHoursPerWeek).toBe(14);
    expect(result.totalDollarsPerYear).toBe(36400);
    expect(result.totalImplHours).toBe(20);
    expect(result.totalCostUSD).toBe(6000);
  });

  it('should return zeros for empty cart', () => {
    const result = calculateAccumulatedSavings([]);
    expect(result.totalHoursPerWeek).toBe(0);
    expect(result.totalDollarsPerYear).toBe(0);
    expect(result.totalImplHours).toBe(0);
    expect(result.totalCostUSD).toBe(0);
  });

  it('should handle single item correctly', () => {
    const result = calculateAccumulatedSavings([mockCartItems[0]]);
    expect(result.totalHoursPerWeek).toBe(6);
    expect(result.totalCostUSD).toBe(2500);
  });
});

// ============================================================================
// calculateFullROI Tests
// ============================================================================

describe('calculateFullROI', () => {
  const mockInputs: ROIInputs = {
    avgHourlyCost: 65,
    hoursSavedPerWeek: 20,
    automationUptakeRate: 70,
  };

  const mockSavings: AccumulatedSavings = {
    totalHoursPerWeek: 20,
    totalDollarsPerYear: 50000,
    totalImplHours: 40,
    totalCostUSD: 15000,
  };

  it('should return all required fields', () => {
    const result = calculateFullROI(mockInputs, mockSavings);

    expect(result).toHaveProperty('estimatedTimeSavedPerYear');
    expect(result).toHaveProperty('estimatedAnnualROI');
    expect(result).toHaveProperty('estimatedPaybackPeriod');
    expect(result).toHaveProperty('estimatedImplementationTime');
    expect(result).toHaveProperty('netAnnualROIYear1');
    expect(result).toHaveProperty('netAnnualROIYear2');
    expect(result).toHaveProperty('netAnnualROIYear3');
    expect(result).toHaveProperty('scalingWithoutOverhead');
  });

  it('should calculate time saved correctly', () => {
    const result = calculateFullROI(mockInputs, mockSavings);
    // Expected: 20 hours/week * 50 weeks * 0.7 adoption = 700 hours
    expect(result.estimatedTimeSavedPerYear).toBe(700);
  });

  it('should calculate annual ROI correctly', () => {
    const result = calculateFullROI(mockInputs, mockSavings);
    // Expected: 700 hours * $65/hour = $45,500
    expect(result.estimatedAnnualROI).toBe(45500);
  });

  it('should return implementation time from savings', () => {
    const result = calculateFullROI(mockInputs, mockSavings);
    expect(result.estimatedImplementationTime).toBe(40);
  });

  it('should show increasing ROI over years 2 and 3', () => {
    const result = calculateFullROI(mockInputs, mockSavings);
    expect(result.netAnnualROIYear2).toBeGreaterThan(result.netAnnualROIYear1);
    expect(result.netAnnualROIYear3).toBeGreaterThan(result.netAnnualROIYear2);
  });
});

// ============================================================================
// Format Utility Tests
// ============================================================================

describe('formatCurrency', () => {
  it('should format positive numbers as USD', () => {
    expect(formatCurrency(1000)).toBe('$1,000');
  });

  it('should format large numbers with commas', () => {
    expect(formatCurrency(1234567)).toBe('$1,234,567');
  });

  it('should format negative numbers', () => {
    expect(formatCurrency(-5000)).toBe('-$5,000');
  });

  it('should handle zero', () => {
    expect(formatCurrency(0)).toBe('$0');
  });

  it('should round decimals', () => {
    expect(formatCurrency(1234.56)).toBe('$1,235');
  });
});

describe('formatNumber', () => {
  it('should format numbers with commas', () => {
    expect(formatNumber(1000)).toBe('1,000');
  });

  it('should format large numbers correctly', () => {
    expect(formatNumber(1234567)).toBe('1,234,567');
  });

  it('should handle small numbers', () => {
    expect(formatNumber(42)).toBe('42');
  });

  it('should handle zero', () => {
    expect(formatNumber(0)).toBe('0');
  });
});
