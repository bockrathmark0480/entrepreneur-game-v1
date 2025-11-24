/**
 * LocalStorage Utilities
 *
 * Handles persistence of journey state with debouncing and error handling.
 */

import type { JourneyState } from '../types';

const STORAGE_KEY = 'mab-ai-journey-state';
const DEBOUNCE_MS = 500;

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Save state to localStorage with debouncing
 *
 * @param state - Current journey state
 */
export function saveStateToStorage(state: JourneyState): void {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    try {
      // Only persist relevant fields (not transient state)
      const persistedState = {
        selectedChapterIds: state.selectedChapterIds,
        cartLineItems: state.cartLineItems,
        accumulatedSavings: state.accumulatedSavings,
        roiInputs: state.roiInputs,
        selectedPackage: state.selectedPackage,
        viewerName: state.viewerName,
        currentChapterIndex: state.currentChapterIndex,
        paymentComplete: state.paymentComplete,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(persistedState));
    } catch (error) {
      console.warn('Failed to save state to localStorage:', error);
    }
  }, DEBOUNCE_MS);
}

/**
 * Load state from localStorage
 *
 * @returns Partial journey state or null if not found
 */
export function loadStateFromStorage(): Partial<JourneyState> | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);

    // Validate essential structure
    if (typeof parsed !== 'object' || parsed === null) {
      return null;
    }

    return parsed;
  } catch (error) {
    console.warn('Failed to load state from localStorage:', error);
    return null;
  }
}

/**
 * Clear stored state
 */
export function clearStoredState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear localStorage:', error);
  }
}

/**
 * Check if localStorage is available
 */
export function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}
