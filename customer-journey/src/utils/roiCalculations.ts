/**
 * ROI Calculation Utilities
 *
 * All financial calculations for the automation journey.
 * These functions are pure and testable.
 */

import type {
  ROICalculation,
  ROIInputs,
  AccumulatedSavings,
  CartLineItem,
  ChapterSavings,
} from '../types';

// ============================================================================
// CONSTANTS
// ============================================================================

/** Number of working weeks per year (accounting for holidays/PTO) */
export const WORK_WEEKS_PER_YEAR = 50;

/** Annual maintenance cost as percentage of implementation */
export const MAINTENANCE_RATE = 0.15;

/** Year 2 adoption improvement multiplier */
export const YEAR_2_ADOPTION_MULTIPLIER = 1.15;

/** Year 3 adoption improvement multiplier */
export const YEAR_3_ADOPTION_MULTIPLIER = 1.25;

/** Estimated fully-loaded cost of a new hire per year */
export const FULLY_LOADED_HIRE_COST = 85000;

// ============================================================================
// CORE CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calculate total hours saved per year based on weekly savings and adoption rate
 *
 * @param hoursPerWeek - Hours saved per week from automations
 * @param adoptionRate - Percentage of adoption (0-100)
 * @returns Annual hours saved
 */
export function calculateAnnualHoursSaved(
  hoursPerWeek: number,
  adoptionRate: number
): number {
  const effectiveRate = adoptionRate / 100;
  return hoursPerWeek * WORK_WEEKS_PER_YEAR * effectiveRate;
}

/**
 * Calculate annual dollar savings from time saved
 *
 * @param annualHoursSaved - Total hours saved per year
 * @param hourlyRate - Average hourly cost
 * @returns Annual dollar savings
 */
export function calculateAnnualDollarSavings(
  annualHoursSaved: number,
  hourlyRate: number
): number {
  return annualHoursSaved * hourlyRate;
}

/**
 * Calculate payback period in months
 *
 * @param totalImplementationCost - Total cost of implementation
 * @param annualSavings - Annual dollar savings
 * @returns Payback period in months
 */
export function calculatePaybackPeriod(
  totalImplementationCost: number,
  annualSavings: number
): number {
  if (annualSavings <= 0) return Infinity;
  const months = (totalImplementationCost / annualSavings) * 12;
  return Math.round(months * 10) / 10; // Round to 1 decimal
}

/**
 * Calculate net ROI for a specific year
 *
 * @param annualSavings - Base annual savings
 * @param implementationCost - One-time implementation cost
 * @param year - Year number (1, 2, or 3)
 * @returns Net ROI for that year
 */
export function calculateNetROIForYear(
  annualSavings: number,
  implementationCost: number,
  year: 1 | 2 | 3
): number {
  const maintenanceCost = implementationCost * MAINTENANCE_RATE;

  let adoptionMultiplier = 1;
  if (year === 2) adoptionMultiplier = YEAR_2_ADOPTION_MULTIPLIER;
  if (year === 3) adoptionMultiplier = YEAR_3_ADOPTION_MULTIPLIER;

  const effectiveSavings = annualSavings * adoptionMultiplier;

  if (year === 1) {
    // Year 1 includes implementation cost
    return effectiveSavings - implementationCost - maintenanceCost;
  }

  // Years 2+ only have maintenance
  return effectiveSavings - maintenanceCost;
}

/**
 * Calculate scaling without overhead savings
 * (How much you save by not hiring additional staff)
 *
 * @param hoursPerWeek - Hours saved per week
 * @returns Dollar value of avoided hiring
 */
export function calculateScalingWithoutOverhead(hoursPerWeek: number): number {
  // Assuming 40-hour work week, calculate FTE equivalent
  const fteEquivalent = (hoursPerWeek * WORK_WEEKS_PER_YEAR) / (40 * 50);
  return Math.round(fteEquivalent * FULLY_LOADED_HIRE_COST);
}

// ============================================================================
// AGGREGATE CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calculate accumulated savings from cart items
 *
 * @param cartItems - Array of cart line items
 * @returns Accumulated savings totals
 */
export function calculateAccumulatedSavings(
  cartItems: CartLineItem[]
): AccumulatedSavings {
  return cartItems.reduce(
    (acc, item) => ({
      totalHoursPerWeek: acc.totalHoursPerWeek + item.savings.hoursPerWeek,
      totalDollarsPerYear: acc.totalDollarsPerYear + item.savings.dollarsPerYear,
      totalImplHours: acc.totalImplHours + item.implHours,
      totalCostUSD: acc.totalCostUSD + item.costUSD,
    }),
    {
      totalHoursPerWeek: 0,
      totalDollarsPerYear: 0,
      totalImplHours: 0,
      totalCostUSD: 0,
    }
  );
}

/**
 * Calculate full ROI metrics based on inputs and savings
 *
 * @param inputs - ROI slider inputs
 * @param savings - Accumulated savings from cart
 * @returns Complete ROI calculation object
 */
export function calculateFullROI(
  inputs: ROIInputs,
  savings: AccumulatedSavings
): ROICalculation {
  const annualHoursSaved = calculateAnnualHoursSaved(
    inputs.hoursSavedPerWeek,
    inputs.automationUptakeRate
  );

  const annualDollarSavings = calculateAnnualDollarSavings(
    annualHoursSaved,
    inputs.avgHourlyCost
  );

  const paybackPeriod = calculatePaybackPeriod(
    savings.totalCostUSD,
    annualDollarSavings
  );

  return {
    estimatedTimeSavedPerYear: Math.round(annualHoursSaved),
    estimatedAnnualROI: Math.round(annualDollarSavings),
    estimatedPaybackPeriod: paybackPeriod,
    estimatedImplementationTime: savings.totalImplHours,
    netAnnualROIYear1: Math.round(
      calculateNetROIForYear(annualDollarSavings, savings.totalCostUSD, 1)
    ),
    netAnnualROIYear2: Math.round(
      calculateNetROIForYear(annualDollarSavings, savings.totalCostUSD, 2)
    ),
    netAnnualROIYear3: Math.round(
      calculateNetROIForYear(annualDollarSavings, savings.totalCostUSD, 3)
    ),
    scalingWithoutOverhead: calculateScalingWithoutOverhead(
      inputs.hoursSavedPerWeek
    ),
  };
}

/**
 * Format currency for display
 *
 * @param amount - Dollar amount
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format number with commas
 *
 * @param num - Number to format
 * @returns Formatted number string
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Convert chapter savings to cart line item savings format
 */
export function chapterToCartSavings(savings: ChapterSavings): ChapterSavings {
  return {
    hoursPerWeek: savings.hoursPerWeek,
    dollarsPerYear: savings.dollarsPerYear,
  };
}
