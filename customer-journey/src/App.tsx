/**
 * Main Application Component
 *
 * Orchestrates the journey experience by rendering the appropriate
 * view based on application state within the BookLayout wrapper.
 */

import { Suspense, lazy, useEffect } from 'react';
import { JourneyProvider, useJourney } from './context/JourneyContext';
import { BookLayout } from './components/book/BookLayout';

// Lazy-load pages for better performance
const LandingCover = lazy(() => import('./components/pages/LandingCover'));
const TitleMap = lazy(() => import('./components/pages/TitleMap'));
const ChapterPage = lazy(() => import('./components/pages/ChapterPage'));
const ExecutiveSummaryROI = lazy(() => import('./components/pages/ExecutiveSummaryROI'));
const CheckoutBackCover = lazy(() => import('./components/pages/CheckoutBackCover'));

/**
 * Loading fallback with fantasy styling
 */
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-4 border-4 border-gold-400 border-t-transparent rounded-full animate-spin" />
        <p className="font-serif text-ink-400">Preparing the scroll...</p>
      </div>
    </div>
  );
}

/**
 * View Router Component
 *
 * Renders the appropriate page component based on current view state.
 */
function ViewRouter() {
  const { state } = useJourney();

  // Render appropriate view based on state
  const renderView = () => {
    switch (state.currentView) {
      case 'landing-cover':
        return <LandingCover />;
      case 'title-map':
        return <TitleMap />;
      case 'chapter':
        return <ChapterPage />;
      case 'executive-summary':
        return <ExecutiveSummaryROI />;
      case 'checkout':
        return <CheckoutBackCover />;
      default:
        return <LandingCover />;
    }
  };

  return (
    <Suspense fallback={<LoadingFallback />}>
      {renderView()}
    </Suspense>
  );
}

/**
 * Application Shell
 *
 * Wraps the view router with BookLayout for the book aesthetic.
 */
function AppShell() {
  const { state } = useJourney();

  // Set document title based on current view
  useEffect(() => {
    const titles: Record<string, string> = {
      'landing-cover': 'Begin Your Journey | MAB AI Strategies',
      'title-map': 'The Realm of Automation | MAB AI Strategies',
      'chapter': 'Automation Discovery | MAB AI Strategies',
      'executive-summary': 'Your ROI Treasure | MAB AI Strategies',
      'checkout': 'Complete Your Quest | MAB AI Strategies',
    };
    document.title = titles[state.currentView] || 'AI Automation Journey';
  }, [state.currentView]);

  // Determine if we show the full book frame
  const showBookFrame = state.currentView !== 'landing-cover' || state.isBookOpen;

  return (
    <BookLayout showBookFrame={showBookFrame}>
      <ViewRouter />
    </BookLayout>
  );
}

/**
 * Main App Component
 *
 * Provides the JourneyContext to the entire application.
 */
function App() {
  return (
    <JourneyProvider>
      <AppShell />
    </JourneyProvider>
  );
}

export default App;
