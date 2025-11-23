/**
 * TitleMap Component
 *
 * Interactive fantasy map showing chapter locations.
 * Users click locations to confirm navigation to chapters.
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJourney } from '../../context/JourneyContext';
import { ConfirmModal } from '../modals/ConfirmModal';
import type { Chapter } from '../../types';

// Map location icons
const LocationIcon = ({ isVisited, isHovered }: { isVisited: boolean; isHovered: boolean }) => (
  <svg viewBox="0 0 40 50" className="w-full h-full">
    <defs>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <path
      d="M20 0 C9 0 0 9 0 20 C0 35 20 50 20 50 C20 50 40 35 40 20 C40 9 31 0 20 0"
      fill={isVisited ? '#D4AF37' : isHovered ? '#E4C878' : '#8B4513'}
      filter={isHovered ? 'url(#glow)' : undefined}
      className="transition-all duration-300"
    />
    <circle cx="20" cy="18" r="8" fill={isVisited ? '#2B1B0E' : '#F6E7C1'} />
    {isVisited && (
      <path
        d="M15 18 L18 21 L25 14"
        stroke="#D4AF37"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )}
  </svg>
);

export function TitleMap() {
  const { chapters, isInCart, dispatch, navigateToView } = useJourney();
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [hoveredChapter, setHoveredChapter] = useState<string | null>(null);

  const handleLocationClick = useCallback((chapter: Chapter) => {
    setSelectedChapter(chapter);
  }, []);

  const handleConfirm = useCallback(() => {
    if (selectedChapter) {
      const chapterIndex = chapters.findIndex((c) => c.id === selectedChapter.id);
      dispatch({ type: 'SET_CHAPTER_INDEX', payload: chapterIndex });
      dispatch({ type: 'SET_TRANSITION', payload: 'map-burn' });
      setTimeout(() => {
        navigateToView('chapter', 'map-burn');
      }, 100);
    }
    setSelectedChapter(null);
  }, [selectedChapter, chapters, dispatch, navigateToView]);

  const handleCancel = useCallback(() => {
    setSelectedChapter(null);
  }, []);

  return (
    <div className="relative w-full h-full min-h-[500px] p-4 md:p-8">
      {/* Map Title */}
      <motion.div
        className="text-center mb-4 md:mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-2xl md:text-4xl text-ink-500 mb-2">
          The Realm of Automation
        </h1>
        <p className="font-body text-ink-400 text-sm md:text-base">
          Select a destination to begin your journey
        </p>
      </motion.div>

      {/* Map Container */}
      <div className="relative w-full aspect-[16/10] max-h-[60vh] mx-auto">
        {/* Map Background */}
        <div className="absolute inset-0 rounded-lg overflow-hidden">
          {/* Base parchment */}
          <div className="absolute inset-0 bg-gradient-to-br from-parchment-300 via-parchment-200 to-parchment-400" />

          {/* Terrain features */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 60" preserveAspectRatio="none">
            {/* Mountains */}
            <path
              d="M0 40 L10 25 L15 35 L25 15 L35 30 L40 20 L50 35 L55 25 L65 40 L70 30 L80 45 L90 35 L100 40 L100 60 L0 60 Z"
              fill="url(#mountainGradient)"
              opacity="0.3"
            />
            {/* Hills */}
            <ellipse cx="20" cy="35" rx="15" ry="8" fill="#8B7355" opacity="0.2" />
            <ellipse cx="70" cy="40" rx="20" ry="10" fill="#8B7355" opacity="0.15" />
            {/* Forest dots */}
            {[...Array(20)].map((_, i) => (
              <circle
                key={i}
                cx={10 + (i % 5) * 20 + Math.random() * 10}
                cy={45 + Math.floor(i / 5) * 5 + Math.random() * 5}
                r={1 + Math.random()}
                fill="#4A5D23"
                opacity={0.3 + Math.random() * 0.2}
              />
            ))}
            {/* Path/Road */}
            <path
              d="M10 50 Q30 45 40 30 Q50 20 70 25 Q85 30 95 20"
              stroke="#8B7355"
              strokeWidth="2"
              fill="none"
              strokeDasharray="4 2"
              opacity="0.4"
            />
            <defs>
              <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#6B7280" />
                <stop offset="100%" stopColor="#4B5563" />
              </linearGradient>
            </defs>
          </svg>

          {/* Compass Rose */}
          <div className="absolute bottom-4 right-4 w-16 h-16 md:w-24 md:h-24 opacity-40">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="45" stroke="#8B4513" strokeWidth="2" fill="none" />
              <path d="M50 10 L55 45 L50 50 L45 45 Z" fill="#8B4513" />
              <path d="M50 90 L55 55 L50 50 L45 55 Z" fill="#D4AF37" />
              <path d="M10 50 L45 45 L50 50 L45 55 Z" fill="#8B4513" />
              <path d="M90 50 L55 45 L50 50 L55 55 Z" fill="#D4AF37" />
              <text x="50" y="8" textAnchor="middle" fontSize="8" fill="#8B4513">N</text>
            </svg>
          </div>

          {/* Map edge aging effect */}
          <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(139,69,19,0.3)]" />
        </div>

        {/* Chapter Locations */}
        {chapters.map((chapter, index) => {
          const position = chapter.mapPosition || { x: 20 + index * 15, y: 30 + (index % 2) * 20 };
          const isVisited = isInCart(chapter.id);
          const isHovered = hoveredChapter === chapter.id;

          return (
            <motion.button
              key={chapter.id}
              className="absolute transform -translate-x-1/2 -translate-y-full focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 rounded"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.15 + 0.3 }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleLocationClick(chapter)}
              onMouseEnter={() => setHoveredChapter(chapter.id)}
              onMouseLeave={() => setHoveredChapter(null)}
              onFocus={() => setHoveredChapter(chapter.id)}
              onBlur={() => setHoveredChapter(null)}
              aria-label={`Navigate to ${chapter.title}`}
            >
              <div className="w-8 h-10 md:w-10 md:h-12">
                <LocationIcon isVisited={isVisited} isHovered={isHovered} />
              </div>

              {/* Chapter label */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 whitespace-nowrap bg-ink-500/95 text-parchment-100 px-3 py-2 rounded-lg shadow-lg z-10"
                  >
                    <p className="font-serif text-sm font-semibold">{chapter.title.replace(/Chapter \w+: /, '')}</p>
                    <p className="text-xs text-parchment-300 mt-1">{chapter.summaryOneLiner.slice(0, 50)}...</p>
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 border-8 border-transparent border-b-ink-500/95" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Chapter number badge */}
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gold-500 rounded-full flex items-center justify-center text-ink-600 text-xs font-bold shadow">
                {index + 1}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Legend */}
      <motion.div
        className="mt-6 flex justify-center gap-6 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center gap-2">
          <div className="w-4 h-5">
            <LocationIcon isVisited={false} isHovered={false} />
          </div>
          <span className="text-ink-400 font-body">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-5">
            <LocationIcon isVisited={true} isHovered={false} />
          </div>
          <span className="text-ink-400 font-body">In Cart</span>
        </div>
      </motion.div>

      {/* Audio placeholder indicator */}
      <div className="absolute top-4 right-4 text-ink-300 text-xs flex items-center gap-2" aria-hidden="true">
        <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
        <span className="font-body">Ambient sounds</span>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={selectedChapter !== null}
        title="Begin This Chapter?"
        message={selectedChapter ? `You are about to explore "${selectedChapter.title.replace(/Chapter \w+: /, '')}". Continue?` : ''}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default TitleMap;
