/**
 * ChapterPage Component
 *
 * Displays individual automation chapters with:
 * - Dynamic title banner
 * - Workflow diagram with hover info
 * - Tools/Key Bank section
 * - Navigation and cart controls
 */

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useJourney } from '../../context/JourneyContext';
import { SuggestionsModal } from '../modals/SuggestionsModal';
import { getChapterSuggestions } from '../../utils/suggestions';
import { formatCurrency } from '../../utils/roiCalculations';

// Tool icons mapping
const toolIcons: Record<string, string> = {
  'Zapier': '⚡',
  'Zapier API': '⚡',
  'OpenAI API': '🤖',
  'GPT-4': '🧠',
  'Google Sheets': '📊',
  'Google Docs API': '📄',
  'Slack': '💬',
  'CRM Webhook': '🔗',
  'PandaDoc': '📝',
  'Data Warehouse': '🗄️',
  'Custom AI Agent': '🤖',
  'Custom Agent': '🤖',
  'Intercom': '💬',
  'Zendesk API': '🎫',
  'Knowledge Base': '📚',
  'Python ML Pipeline': '🐍',
  'BigQuery': '📈',
  'Tableau API': '📉',
  'Custom Models': '🔬',
  'n8n': '🔄',
  'Custom Orchestrator': '🎭',
  'Multi-API Integration': '🔌',
  'Monitoring': '👁️',
  'Gmail': '✉️',
};

export function ChapterPage() {
  const {
    currentChapter,
    currentChapterIndex,
    totalChapters,
    isInCart,
    addChapterToCart,
    goToNextChapter,
    goToPreviousChapter,
    navigateToView,
    dispatch,
  } = useJourney();

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hoveredInfo, setHoveredInfo] = useState<number | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  if (!currentChapter) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-ink-400 font-body">Chapter not found</p>
      </div>
    );
  }

  const isLastChapter = currentChapterIndex === totalChapters - 1;
  const isFirstChapter = currentChapterIndex === 0;
  const inCart = isInCart(currentChapter.id);

  const handleAddToCart = useCallback(() => {
    if (!inCart) {
      addChapterToCart(currentChapter);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  }, [inCart, currentChapter, addChapterToCart]);

  const handleNext = useCallback(() => {
    if (isLastChapter) {
      dispatch({ type: 'SET_TRANSITION', payload: 'page-turn-forward' });
      navigateToView('executive-summary', 'page-turn-forward');
    } else {
      goToNextChapter();
    }
  }, [isLastChapter, goToNextChapter, navigateToView, dispatch]);

  const handlePrevious = useCallback(() => {
    if (isFirstChapter) {
      dispatch({ type: 'SET_TRANSITION', payload: 'page-turn-back' });
      navigateToView('title-map', 'page-turn-back');
    } else {
      goToPreviousChapter();
    }
  }, [isFirstChapter, goToPreviousChapter, navigateToView, dispatch]);

  return (
    <div className="flex flex-col h-full min-h-[600px]">
      {/* Sticky Title Banner */}
      <motion.div
        className="sticky top-0 z-20 px-4 py-3 md:px-6 md:py-4"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        <div className="relative bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 rounded-lg shadow-lg overflow-hidden">
          {/* Scroll/parchment edges */}
          <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-amber-900 to-transparent" />
          <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-amber-900 to-transparent" />

          <div className="px-6 py-3 md:px-8 md:py-4 text-center">
            <motion.h1
              className="font-display text-xl md:text-2xl lg:text-3xl text-parchment-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={currentChapter.id}
            >
              {currentChapter.title}
            </motion.h1>
          </div>

          {/* Decorative curls */}
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-8 h-16 bg-amber-800 rounded-l-full" />
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-8 h-16 bg-amber-800 rounded-r-full" />
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 px-4 md:px-8 py-4 overflow-y-auto">
        {/* Diagram Section */}
        <motion.div
          className="relative bg-parchment-100 rounded-lg p-4 md:p-6 mb-6 border border-gold-400/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-serif text-lg text-ink-500 mb-4">Workflow Visualization</h2>

          {/* Diagram placeholder with hover info points */}
          <div className="relative aspect-video bg-gradient-to-br from-parchment-200 to-parchment-300 rounded-lg overflow-hidden">
            {/* Placeholder workflow diagram */}
            <svg className="w-full h-full" viewBox="0 0 400 200">
              {/* Flow background */}
              <defs>
                <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              {/* Connection lines */}
              <path
                d="M60 100 L140 100 L200 100 L260 100 L340 100"
                stroke="url(#flowGradient)"
                strokeWidth="4"
                fill="none"
                strokeDasharray="8 4"
              />

              {/* Process nodes */}
              {[
                { x: 60, y: 100, label: 'Input' },
                { x: 140, y: 100, label: 'Process' },
                { x: 220, y: 100, label: 'AI' },
                { x: 300, y: 100, label: 'Output' },
              ].map((node, i) => (
                <g key={i}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="30"
                    fill="#F6E7C1"
                    stroke="#D4AF37"
                    strokeWidth="2"
                  />
                  <text
                    x={node.x}
                    y={node.y + 5}
                    textAnchor="middle"
                    className="font-serif text-xs"
                    fill="#2B1B0E"
                  >
                    {node.label}
                  </text>
                </g>
              ))}

              {/* Arrows */}
              {[100, 180, 260].map((x, i) => (
                <polygon
                  key={i}
                  points={`${x},95 ${x + 15},100 ${x},105`}
                  fill="#D4AF37"
                />
              ))}
            </svg>

            {/* Hover info points */}
            {currentChapter.hoverInfo.map((_, index) => (
              <button
                key={index}
                className={`absolute w-6 h-6 rounded-full flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-gold-400 ${
                  hoveredInfo === index
                    ? 'bg-gold-500 scale-125'
                    : 'bg-gold-400/80 hover:bg-gold-500'
                }`}
                style={{
                  top: `${20 + index * 25}%`,
                  right: `${10 + index * 5}%`,
                }}
                onMouseEnter={() => setHoveredInfo(index)}
                onMouseLeave={() => setHoveredInfo(null)}
                onFocus={() => setHoveredInfo(index)}
                onBlur={() => setHoveredInfo(null)}
                aria-label={`Info point ${index + 1}`}
              >
                <span className="text-ink-600 text-xs font-bold">i</span>
              </button>
            ))}

            {/* Hover info tooltip */}
            {hoveredInfo !== null && (
              <motion.div
                className="absolute right-4 bottom-4 max-w-xs bg-ink-500/95 text-parchment-100 p-3 rounded-lg shadow-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-sm font-body">{currentChapter.hoverInfo[hoveredInfo]}</p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Summary One-liner */}
        <motion.div
          className="mb-6 p-4 bg-gold-400/10 rounded-lg border-l-4 border-gold-500"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="font-body text-ink-500 italic">
            "{currentChapter.summaryOneLiner}"
          </p>
        </motion.div>

        {/* Key Bank / Tools Section */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="font-serif text-lg text-ink-500 mb-3 flex items-center gap-2">
            <span className="text-gold-500">🔑</span> Key Bank
          </h3>
          <div className="flex flex-wrap gap-2">
            {currentChapter.tools.map((tool) => (
              <span
                key={tool}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-parchment-300 rounded-full text-sm font-body text-ink-500 border border-gold-400/30"
              >
                <span>{toolIcons[tool] || '🔧'}</span>
                {tool}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Pricing Info */}
        <motion.div
          className="grid grid-cols-2 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-parchment-100 p-4 rounded-lg border border-gold-400/20">
            <p className="text-xs text-ink-300 uppercase tracking-wide mb-1">Investment</p>
            <p className="font-display text-xl text-gold-600">{formatCurrency(currentChapter.pricing.costUSD)}</p>
            <p className="text-xs text-ink-400">{currentChapter.pricing.implHours}h implementation</p>
          </div>
          <div className="bg-parchment-100 p-4 rounded-lg border border-gold-400/20">
            <p className="text-xs text-ink-300 uppercase tracking-wide mb-1">Annual Savings</p>
            <p className="font-display text-xl text-green-600">{formatCurrency(currentChapter.savings.dollarsPerYear)}</p>
            <p className="text-xs text-ink-400">{currentChapter.savings.hoursPerWeek}h/week saved</p>
          </div>
        </motion.div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="sticky bottom-0 bg-gradient-to-t from-parchment-200 via-parchment-200 to-transparent pt-8 pb-4 px-4 md:px-8">
        <div className="flex items-center justify-between gap-2 md:gap-4">
          {/* Previous Button */}
          <button
            onClick={handlePrevious}
            className="px-4 py-2 md:px-6 md:py-3 bg-parchment-400 hover:bg-parchment-500 text-ink-500 font-serif rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400 flex items-center gap-2"
            aria-label={isFirstChapter ? 'Return to map' : 'Previous chapter'}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">{isFirstChapter ? 'Map' : 'Previous'}</span>
          </button>

          {/* Center Buttons */}
          <div className="flex items-center gap-2">
            {/* Suggestions Button */}
            <button
              onClick={() => setShowSuggestions(true)}
              className="px-3 py-2 md:px-4 md:py-3 bg-parchment-300 hover:bg-parchment-400 text-ink-500 font-serif rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400 flex items-center gap-2"
              aria-label="View suggestions"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span className="hidden md:inline">Suggestions</span>
            </button>

            {/* Add to Cart Button */}
            <motion.button
              onClick={handleAddToCart}
              disabled={inCart}
              className={`px-4 py-2 md:px-6 md:py-3 font-serif rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-gold-400 flex items-center gap-2 ${
                inCart
                  ? 'bg-green-600 text-white cursor-default'
                  : 'bg-gradient-to-b from-gold-400 to-gold-600 hover:from-gold-300 hover:to-gold-500 text-ink-600 shadow-md hover:shadow-glow-gold'
              }`}
              whileTap={!inCart ? { scale: 0.95 } : undefined}
              aria-label={inCart ? 'Already in cart' : 'Add to cart'}
            >
              {inCart ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="hidden sm:inline">In Cart</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="hidden sm:inline">Add to Cart</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Next Button */}
          <motion.button
            onClick={handleNext}
            className={`px-4 py-2 md:px-6 md:py-3 font-serif rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-gold-400 flex items-center gap-2 ${
              isLastChapter
                ? 'bg-gradient-to-b from-gold-300 to-gold-500 text-ink-600 shadow-lg animate-pulse-gold'
                : 'bg-parchment-400 hover:bg-parchment-500 text-ink-500'
            }`}
            whileHover={isLastChapter ? { scale: 1.05 } : undefined}
            aria-label={isLastChapter ? 'View ROI Summary' : 'Next chapter'}
          >
            <span className="hidden sm:inline">{isLastChapter ? 'Summary' : 'Next'}</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>

        {/* Progress indicator */}
        <div className="mt-4 flex justify-center gap-1">
          {Array.from({ length: totalChapters }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === currentChapterIndex
                  ? 'bg-gold-500'
                  : i < currentChapterIndex
                  ? 'bg-gold-400/50'
                  : 'bg-parchment-400'
              }`}
            />
          ))}
        </div>

        {/* Added to cart notification */}
        {addedToCart && (
          <motion.div
            className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            Added to cart!
          </motion.div>
        )}
      </div>

      {/* Suggestions Modal */}
      <SuggestionsModal
        isOpen={showSuggestions}
        title="Enhancement Suggestions"
        suggestions={getChapterSuggestions(currentChapter)}
        onClose={() => setShowSuggestions(false)}
      />
    </div>
  );
}

export default ChapterPage;
