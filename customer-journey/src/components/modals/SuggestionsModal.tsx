/**
 * SuggestionsModal Component
 *
 * Displays AI-generated suggestions for chapters or value optimization.
 */

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Suggestion } from '../../types';
import { getImpactColor } from '../../utils/suggestions';

interface SuggestionsModalProps {
  isOpen: boolean;
  title: string;
  suggestions: Suggestion[];
  onClose: () => void;
}

export function SuggestionsModal({
  isOpen,
  title,
  suggestions,
  onClose,
}: SuggestionsModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      closeRef.current?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-ink-600/80 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="suggestions-title"
          >
            <motion.div
              className="relative bg-parchment-200 rounded-lg shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* Header */}
              <div className="p-6 pb-4 border-b border-gold-400/30">
                <div className="flex items-center justify-between">
                  <h2
                    id="suggestions-title"
                    className="font-display text-xl md:text-2xl text-ink-500"
                  >
                    {title}
                  </h2>
                  <button
                    ref={closeRef}
                    onClick={onClose}
                    className="p-2 text-ink-400 hover:text-ink-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400 rounded"
                    aria-label="Close suggestions"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="font-body text-ink-400 text-sm mt-2">
                  AI-powered recommendations to enhance your automation strategy
                </p>
              </div>

              {/* Suggestions List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={suggestion.id}
                    className="bg-parchment-100 rounded-lg p-4 border border-gold-400/20 hover:border-gold-400/40 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded ${getImpactColor(suggestion.impact)}`}>
                            {suggestion.impact.toUpperCase()}
                          </span>
                        </div>
                        <h3 className="font-serif text-lg text-ink-500 mb-1">
                          {suggestion.title}
                        </h3>
                        <p className="font-body text-sm text-ink-400">
                          {suggestion.description}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400/20 to-gold-600/20 flex items-center justify-center">
                          <svg className="w-5 h-5 text-gold-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gold-400/30 bg-parchment-300/50">
                <p className="text-xs text-ink-300 text-center font-body">
                  These suggestions are generated based on your selected automations.
                  Contact us for personalized recommendations.
                </p>
              </div>

              {/* Corner decorations */}
              <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-gold-500/40" />
              <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-gold-500/40" />
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default SuggestionsModal;
