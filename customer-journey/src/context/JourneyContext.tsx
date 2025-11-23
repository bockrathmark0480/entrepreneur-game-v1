/**
 * Journey Context
 *
 * Central state management for the automation journey application.
 * Uses React Context + useReducer pattern with localStorage persistence.
 */

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
  type Dispatch,
} from 'react';
import type {
  JourneyState,
  JourneyAction,
  CartLineItem,
  ROIInputs,
  Package,
  PageTransition,
  AppView,
} from '../types';
import { automationJourneyConfig } from '../config/automationJourneyConfig';
import {
  calculateAccumulatedSavings,
  calculateFullROI,
} from '../utils/roiCalculations';
import {
  saveStateToStorage,
  loadStateFromStorage,
} from '../utils/localStorage';

// ============================================================================
// INITIAL STATE
// ============================================================================

const getDefaultROIInputs = (): ROIInputs => {
  const sliders = automationJourneyConfig.roi.sliders;
  return {
    avgHourlyCost: sliders.find((s) => s.id === 'avgHourlyCost')?.default ?? 65,
    hoursSavedPerWeek:
      sliders.find((s) => s.id === 'hoursSavedPerWeek')?.default ?? 20,
    automationUptakeRate:
      sliders.find((s) => s.id === 'automationUptakeRate')?.default ?? 70,
  };
};

const initialState: JourneyState = {
  currentView: 'landing-cover',
  currentChapterIndex: 0,
  selectedChapterIds: [],
  cartLineItems: [],
  accumulatedSavings: {
    totalHoursPerWeek: 0,
    totalDollarsPerYear: 0,
    totalImplHours: 0,
    totalCostUSD: 0,
  },
  roiInputs: getDefaultROIInputs(),
  selectedPackage: null,
  viewerName: '',
  isBookOpen: false,
  pendingTransition: 'none',
  paymentComplete: false,
};

// ============================================================================
// REDUCER
// ============================================================================

function journeyReducer(
  state: JourneyState,
  action: JourneyAction
): JourneyState {
  switch (action.type) {
    case 'SET_VIEW':
      return {
        ...state,
        currentView: action.payload,
        pendingTransition: 'none',
      };

    case 'SET_CHAPTER_INDEX':
      return {
        ...state,
        currentChapterIndex: action.payload,
      };

    case 'ADD_TO_CART': {
      // Prevent duplicates
      if (state.cartLineItems.some((item) => item.chapterId === action.payload.chapterId)) {
        return state;
      }
      const newCart = [...state.cartLineItems, action.payload];
      const newSavings = calculateAccumulatedSavings(newCart);
      return {
        ...state,
        cartLineItems: newCart,
        selectedChapterIds: [...state.selectedChapterIds, action.payload.chapterId],
        accumulatedSavings: newSavings,
      };
    }

    case 'REMOVE_FROM_CART': {
      const newCart = state.cartLineItems.filter(
        (item) => item.chapterId !== action.payload
      );
      const newSavings = calculateAccumulatedSavings(newCart);
      return {
        ...state,
        cartLineItems: newCart,
        selectedChapterIds: state.selectedChapterIds.filter(
          (id) => id !== action.payload
        ),
        accumulatedSavings: newSavings,
      };
    }

    case 'SELECT_PACKAGE':
      return {
        ...state,
        selectedPackage: action.payload,
      };

    case 'UPDATE_ROI_INPUTS':
      return {
        ...state,
        roiInputs: {
          ...state.roiInputs,
          ...action.payload,
        },
      };

    case 'SET_VIEWER_NAME':
      return {
        ...state,
        viewerName: action.payload,
      };

    case 'OPEN_BOOK':
      return {
        ...state,
        isBookOpen: true,
        pendingTransition: 'open-book',
      };

    case 'SET_TRANSITION':
      return {
        ...state,
        pendingTransition: action.payload,
      };

    case 'COMPLETE_PAYMENT':
      return {
        ...state,
        paymentComplete: true,
      };

    case 'RESET_JOURNEY':
      return {
        ...initialState,
        viewerName: state.viewerName, // Keep viewer name
      };

    case 'HYDRATE':
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
}

// ============================================================================
// CONTEXT
// ============================================================================

interface JourneyContextValue {
  state: JourneyState;
  dispatch: Dispatch<JourneyAction>;
  // Computed values
  chapters: typeof automationJourneyConfig.chapters;
  currentChapter: (typeof automationJourneyConfig.chapters)[number] | undefined;
  currentChapterIndex: number;
  totalChapters: number;
  roiCalculation: ReturnType<typeof calculateFullROI>;
  config: typeof automationJourneyConfig;
  // Helper actions
  navigateToView: (view: AppView, transition?: PageTransition) => void;
  addChapterToCart: (chapter: (typeof automationJourneyConfig.chapters)[number]) => void;
  removeFromCart: (chapterId: string) => void;
  selectPackage: (pkg: Package) => void;
  updateROIInput: (id: keyof ROIInputs, value: number) => void;
  goToNextChapter: () => void;
  goToPreviousChapter: () => void;
  isInCart: (chapterId: string) => boolean;
}

const JourneyContext = createContext<JourneyContextValue | null>(null);

// ============================================================================
// PROVIDER
// ============================================================================

interface JourneyProviderProps {
  children: ReactNode;
}

export function JourneyProvider({ children }: JourneyProviderProps) {
  const [state, dispatch] = useReducer(journeyReducer, initialState);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = loadStateFromStorage();
    if (stored) {
      dispatch({ type: 'HYDRATE', payload: stored });
    }
  }, []);

  // Persist to localStorage on state changes
  useEffect(() => {
    saveStateToStorage(state);
  }, [state]);

  // Memoized computed values
  const chapters = automationJourneyConfig.chapters;
  const totalChapters = chapters.length;

  const currentChapter = useMemo(
    () => chapters[state.currentChapterIndex],
    [chapters, state.currentChapterIndex]
  );

  const roiCalculation = useMemo(
    () => calculateFullROI(state.roiInputs, state.accumulatedSavings),
    [state.roiInputs, state.accumulatedSavings]
  );

  // Helper actions
  const navigateToView = useCallback(
    (view: AppView, transition: PageTransition = 'none') => {
      dispatch({ type: 'SET_TRANSITION', payload: transition });
      // Small delay to allow animation to start
      setTimeout(() => {
        dispatch({ type: 'SET_VIEW', payload: view });
      }, 50);
    },
    []
  );

  const addChapterToCart = useCallback(
    (chapter: (typeof automationJourneyConfig.chapters)[number]) => {
      const lineItem: CartLineItem = {
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        costUSD: chapter.pricing.costUSD,
        implHours: chapter.pricing.implHours,
        savings: chapter.savings,
      };
      dispatch({ type: 'ADD_TO_CART', payload: lineItem });
    },
    []
  );

  const removeFromCart = useCallback((chapterId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: chapterId });
  }, []);

  const selectPackage = useCallback((pkg: Package) => {
    dispatch({ type: 'SELECT_PACKAGE', payload: pkg });
  }, []);

  const updateROIInput = useCallback((id: keyof ROIInputs, value: number) => {
    dispatch({ type: 'UPDATE_ROI_INPUTS', payload: { [id]: value } });
  }, []);

  const goToNextChapter = useCallback(() => {
    if (state.currentChapterIndex < totalChapters - 1) {
      dispatch({
        type: 'SET_CHAPTER_INDEX',
        payload: state.currentChapterIndex + 1,
      });
      dispatch({ type: 'SET_TRANSITION', payload: 'page-turn-forward' });
    }
  }, [state.currentChapterIndex, totalChapters]);

  const goToPreviousChapter = useCallback(() => {
    if (state.currentChapterIndex > 0) {
      dispatch({
        type: 'SET_CHAPTER_INDEX',
        payload: state.currentChapterIndex - 1,
      });
      dispatch({ type: 'SET_TRANSITION', payload: 'page-turn-back' });
    }
  }, [state.currentChapterIndex]);

  const isInCart = useCallback(
    (chapterId: string) =>
      state.cartLineItems.some((item) => item.chapterId === chapterId),
    [state.cartLineItems]
  );

  const value: JourneyContextValue = {
    state,
    dispatch,
    chapters,
    currentChapter,
    currentChapterIndex: state.currentChapterIndex,
    totalChapters,
    roiCalculation,
    config: automationJourneyConfig,
    navigateToView,
    addChapterToCart,
    removeFromCart,
    selectPackage,
    updateROIInput,
    goToNextChapter,
    goToPreviousChapter,
    isInCart,
  };

  return (
    <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>
  );
}

// ============================================================================
// HOOK
// ============================================================================

export function useJourney(): JourneyContextValue {
  const context = useContext(JourneyContext);
  if (!context) {
    throw new Error('useJourney must be used within a JourneyProvider');
  }
  return context;
}

export default JourneyContext;
