/**
 * Core type definitions for the AI Automation Journey Application
 * These types define the shape of configuration and application state
 */

// ============================================================================
// Configuration Types
// ============================================================================

export interface BrandConfig {
  companyName: string;
  logoUrl: string;
  colorScheme: {
    parchment: string;
    ink: string;
    gold: string;
  };
}

export interface ViewerConfig {
  firstNamePlaceholder: string;
}

export interface ChapterDiagram {
  type: 'svg' | 'png' | 'mermaid';
  src: string;
}

export interface ChapterPricing {
  costUSD: number;
  implHours: number;
}

export interface ChapterSavings {
  hoursPerWeek: number;
  dollarsPerYear: number;
}

export interface Chapter {
  id: string;
  title: string;
  summaryOneLiner: string;
  diagram: ChapterDiagram;
  hoverInfo: string[];
  tools: string[];
  pricing: ChapterPricing;
  savings: ChapterSavings;
  mapPosition?: { x: number; y: number }; // Position on the map (percentage)
}

export interface ROISlider {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  default: number;
}

export interface ROIConfig {
  assumptions: Record<string, string>;
  sliders: ROISlider[];
}

export interface Package {
  tier: 'Core' | 'Growth' | 'Scale';
  includedChapterIds: string[];
  priceUSD: number;
  description: string;
  features: string[];
}

export interface AutomationJourneyConfig {
  brand: BrandConfig;
  viewer: ViewerConfig;
  chapters: Chapter[];
  roi: ROIConfig;
  packages: Package[];
}

// ============================================================================
// Application State Types
// ============================================================================

export interface CartLineItem {
  chapterId: string;
  chapterTitle: string;
  costUSD: number;
  implHours: number;
  savings: ChapterSavings;
}

export interface ROIInputs {
  avgHourlyCost: number;
  hoursSavedPerWeek: number;
  automationUptakeRate: number;
}

export interface AccumulatedSavings {
  totalHoursPerWeek: number;
  totalDollarsPerYear: number;
  totalImplHours: number;
  totalCostUSD: number;
}

export type AppView =
  | 'landing-cover'
  | 'title-map'
  | 'chapter'
  | 'executive-summary'
  | 'checkout';

export type PageTransition =
  | 'none'
  | 'open-book'
  | 'page-turn-forward'
  | 'page-turn-back'
  | 'map-burn'
  | 'treasure-erupt'
  | 'hero-return';

export interface JourneyState {
  currentView: AppView;
  currentChapterIndex: number;
  selectedChapterIds: string[];
  cartLineItems: CartLineItem[];
  accumulatedSavings: AccumulatedSavings;
  roiInputs: ROIInputs;
  selectedPackage: Package | null;
  viewerName: string;
  isBookOpen: boolean;
  pendingTransition: PageTransition;
  paymentComplete: boolean;
}

export type JourneyAction =
  | { type: 'SET_VIEW'; payload: AppView }
  | { type: 'SET_CHAPTER_INDEX'; payload: number }
  | { type: 'ADD_TO_CART'; payload: CartLineItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'SELECT_PACKAGE'; payload: Package }
  | { type: 'UPDATE_ROI_INPUTS'; payload: Partial<ROIInputs> }
  | { type: 'SET_VIEWER_NAME'; payload: string }
  | { type: 'OPEN_BOOK' }
  | { type: 'SET_TRANSITION'; payload: PageTransition }
  | { type: 'COMPLETE_PAYMENT' }
  | { type: 'RESET_JOURNEY' }
  | { type: 'HYDRATE'; payload: Partial<JourneyState> };

// ============================================================================
// ROI Calculation Types
// ============================================================================

export interface ROICalculation {
  estimatedTimeSavedPerYear: number; // hours
  estimatedAnnualROI: number; // dollars
  estimatedPaybackPeriod: number; // months
  estimatedImplementationTime: number; // hours
  netAnnualROIYear1: number;
  netAnnualROIYear2: number;
  netAnnualROIYear3: number;
  scalingWithoutOverhead: number; // dollars saved by not hiring
}

export interface Suggestion {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
}
