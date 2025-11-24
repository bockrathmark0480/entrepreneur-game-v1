/**
 * BookLayout Component
 *
 * The main layout wrapper that renders pages within an ancient book frame.
 * Handles page-turn animations and the overall book aesthetic.
 */

import { type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJourney } from '../../context/JourneyContext';
import type { PageTransition } from '../../types';

interface BookLayoutProps {
  children: ReactNode;
  showBookFrame?: boolean;
}

// Animation variants for different page transitions
const pageVariants = {
  initial: (transition: PageTransition) => {
    switch (transition) {
      case 'page-turn-forward':
        return { rotateY: -90, opacity: 0, x: 100 };
      case 'page-turn-back':
        return { rotateY: 90, opacity: 0, x: -100 };
      case 'open-book':
        return { scale: 0.8, opacity: 0 };
      case 'map-burn':
        return { scale: 1.1, opacity: 0, filter: 'brightness(2)' };
      case 'treasure-erupt':
        return { y: 50, opacity: 0, scale: 0.9 };
      case 'hero-return':
        return { scale: 1.2, opacity: 0 };
      default:
        return { opacity: 0 };
    }
  },
  animate: {
    rotateY: 0,
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    filter: 'brightness(1)',
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
  exit: (transition: PageTransition) => {
    switch (transition) {
      case 'page-turn-forward':
        return {
          rotateY: 90,
          opacity: 0,
          x: -100,
          transition: { duration: 0.4 },
        };
      case 'page-turn-back':
        return {
          rotateY: -90,
          opacity: 0,
          x: 100,
          transition: { duration: 0.4 },
        };
      case 'map-burn':
        return {
          scale: 0.9,
          opacity: 0,
          filter: 'brightness(3) saturate(2)',
          transition: { duration: 0.8 },
        };
      case 'treasure-erupt':
        return {
          y: -50,
          opacity: 0,
          scale: 1.1,
          transition: { duration: 0.5 },
        };
      default:
        return {
          opacity: 0,
          transition: { duration: 0.3 },
        };
    }
  },
};

export function BookLayout({ children, showBookFrame = true }: BookLayoutProps) {
  const { state } = useJourney();
  const { pendingTransition, isBookOpen } = state;

  if (!showBookFrame) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-ink-700 via-ink-600 to-ink-800 flex items-center justify-center p-4 md:p-8">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Book Container */}
      <motion.div
        className={`
          relative w-full max-w-5xl mx-auto
          ${isBookOpen ? 'aspect-[4/3] md:aspect-[3/2]' : 'aspect-[3/4] md:aspect-[2/3]'}
          bg-gradient-to-br from-amber-900 via-amber-800 to-amber-950
          rounded-lg shadow-book
          transition-all duration-700
        `}
        initial={false}
        animate={{
          rotateY: isBookOpen ? 0 : -5,
        }}
        style={{
          perspective: '2000px',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Book spine effect */}
        <div className="absolute left-0 top-0 bottom-0 w-4 md:w-6 bg-gradient-to-r from-amber-950 via-amber-900 to-transparent rounded-l-lg" />

        {/* Book edge texture */}
        <div className="absolute right-0 top-2 bottom-2 w-2 bg-gradient-to-l from-amber-100/20 to-transparent" />

        {/* Page content area */}
        <div className="absolute inset-4 md:inset-6 rounded overflow-hidden bg-parchment-200">
          {/* Parchment texture overlay */}
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Age stains effect */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-amber-600/20 to-transparent rounded-full blur-xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-radial from-amber-700/15 to-transparent rounded-full blur-2xl" />

          {/* Page content with animations */}
          <AnimatePresence mode="wait" custom={pendingTransition}>
            <motion.div
              key={state.currentView + state.currentChapterIndex}
              custom={pendingTransition}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="relative w-full h-full overflow-y-auto overflow-x-hidden"
              style={{
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden',
              }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Corner decorations */}
        <CornerDecoration position="top-left" />
        <CornerDecoration position="top-right" />
        <CornerDecoration position="bottom-left" />
        <CornerDecoration position="bottom-right" />
      </motion.div>
    </div>
  );
}

// Decorative corner element
function CornerDecoration({
  position,
}: {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}) {
  const positionClasses = {
    'top-left': 'top-1 left-1',
    'top-right': 'top-1 right-1 rotate-90',
    'bottom-left': 'bottom-1 left-1 -rotate-90',
    'bottom-right': 'bottom-1 right-1 rotate-180',
  };

  return (
    <div className={`absolute ${positionClasses[position]} w-8 h-8 md:w-12 md:h-12`}>
      <svg viewBox="0 0 40 40" className="w-full h-full text-gold-500/60">
        <path
          d="M0 0 L15 0 Q10 5 10 15 L10 10 Q5 10 0 15 L0 0"
          fill="currentColor"
        />
        <path
          d="M0 0 L10 0 Q7 3 7 10 L7 7 Q3 7 0 10 L0 0"
          fill="currentColor"
          opacity="0.5"
          transform="translate(2, 2)"
        />
      </svg>
    </div>
  );
}

export default BookLayout;
