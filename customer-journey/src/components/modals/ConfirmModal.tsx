/**
 * ConfirmModal Component
 *
 * Reusable confirmation dialog with fantasy styling.
 */

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Yes, proceed',
  cancelText = 'No, return',
}: ConfirmModalProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  // Focus trap and keyboard handling
  useEffect(() => {
    if (isOpen) {
      confirmRef.current?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onCancel();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onCancel]);

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
            onClick={onCancel}
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
            aria-labelledby="modal-title"
          >
            <motion.div
              className="relative bg-parchment-200 rounded-lg shadow-2xl max-w-md w-full overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* Decorative top border */}
              <div className="h-2 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500" />

              {/* Content */}
              <div className="p-6 md:p-8">
                {/* Decorative icon */}
                <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-ink-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                  </svg>
                </div>

                <h2
                  id="modal-title"
                  className="font-display text-xl md:text-2xl text-ink-500 text-center mb-3"
                >
                  {title}
                </h2>

                <p className="font-body text-ink-400 text-center mb-6">
                  {message}
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    onClick={onCancel}
                    className="flex-1 px-6 py-3 bg-parchment-400 hover:bg-parchment-500 text-ink-500 font-serif rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400"
                  >
                    {cancelText}
                  </button>
                  <button
                    ref={confirmRef}
                    onClick={onConfirm}
                    className="flex-1 px-6 py-3 bg-gradient-to-b from-gold-400 to-gold-600 hover:from-gold-300 hover:to-gold-500 text-ink-600 font-serif font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-gold-400 shadow-md hover:shadow-glow-gold"
                  >
                    {confirmText}
                  </button>
                </div>
              </div>

              {/* Corner decorations */}
              <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-gold-500/40" />
              <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-gold-500/40" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-gold-500/40" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-gold-500/40" />
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ConfirmModal;
