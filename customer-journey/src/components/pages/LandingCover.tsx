/**
 * LandingCover Component
 *
 * The front cover of the book - first thing users see.
 * Features animated banner, greeting, and "Begin" CTA.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useJourney } from '../../context/JourneyContext';

export function LandingCover() {
  const { state, dispatch, config, navigateToView } = useJourney();
  const [nameInput, setNameInput] = useState(state.viewerName || '');

  const displayName = state.viewerName || 'Traveler';

  const handleBegin = () => {
    if (nameInput.trim()) {
      dispatch({ type: 'SET_VIEWER_NAME', payload: nameInput.trim() });
    }
    dispatch({ type: 'OPEN_BOOK' });
    setTimeout(() => {
      navigateToView('title-map', 'open-book');
    }, 800);
  };

  return (
    <div className="relative min-h-full flex flex-col items-center justify-center p-6 md:p-12 text-center bg-gradient-to-b from-amber-900 via-amber-800 to-amber-950">
      {/* Leather texture overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='leather'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.04' numOctaves='4'/%3E%3CfeDisplacementMap in='SourceGraphic' scale='3'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23leather)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Animated Banner */}
      <motion.div
        className="relative mb-8"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <motion.div
          className="relative bg-gradient-to-r from-crimson-600 via-crimson-500 to-crimson-600 px-8 py-4 shadow-lg"
          animate={{
            skewX: [0, 1, -1, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            clipPath: 'polygon(5% 0%, 95% 0%, 100% 50%, 95% 100%, 5% 100%, 0% 50%)',
          }}
        >
          <p className="text-parchment-100 font-serif text-sm md:text-base tracking-wide">
            This adventure is brought to you by
          </p>
          <p className="text-gold-400 font-display text-lg md:text-xl font-bold mt-1">
            {config.brand.companyName}
          </p>
        </motion.div>

        {/* Banner tails */}
        <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-6 h-12 bg-crimson-700 transform -skew-y-12" />
        <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-6 h-12 bg-crimson-700 transform skew-y-12" />
      </motion.div>

      {/* Main Title Area */}
      <motion.div
        className="relative z-10 max-w-xl mx-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {/* Decorative frame */}
        <div className="absolute -inset-4 border-2 border-gold-500/30 rounded-lg" />
        <div className="absolute -inset-6 border border-gold-500/20 rounded-lg" />

        <div className="bg-parchment-200/90 backdrop-blur-sm rounded-lg p-8 md:p-12 shadow-2xl">
          {/* Greeting */}
          <motion.h1
            className="font-display text-3xl md:text-4xl lg:text-5xl text-ink-500 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="text-gold-600">{displayName}</span>,
          </motion.h1>

          <motion.p
            className="font-body text-lg md:text-xl text-ink-400 leading-relaxed mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Your AI automation journey starts here.
          </motion.p>

          <motion.p
            className="font-serif text-base md:text-lg text-ink-300 italic mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            Make haste — the competition is catching up!
          </motion.p>

          {/* Name Input */}
          {!state.viewerName && (
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              <label htmlFor="name-input" className="sr-only">
                Enter your name
              </label>
              <input
                id="name-input"
                type="text"
                placeholder="Enter your name to begin..."
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleBegin()}
                className="w-full max-w-xs mx-auto block px-4 py-3 bg-parchment-100 border-2 border-gold-400/50 rounded-lg font-body text-ink-500 placeholder-ink-300/50 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30 transition-all"
                aria-label="Your name"
              />
            </motion.div>
          )}

          {/* Begin Button */}
          <motion.button
            onClick={handleBegin}
            className="group relative px-12 py-4 bg-gradient-to-b from-gold-400 to-gold-600 text-ink-600 font-display text-xl md:text-2xl rounded-lg shadow-lg hover:shadow-glow-gold focus:outline-none focus:ring-4 focus:ring-gold-400/50 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            aria-label="Begin your automation journey"
          >
            <span className="relative z-10">Begin</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-gold-300 to-gold-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              layoutId="button-glow"
            />
          </motion.button>

          {/* Logo */}
          <motion.div
            className="mt-8 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="font-display text-ink-600 text-lg md:text-xl font-bold">
                MAB
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Decorative embers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-orange-400 rounded-full blur-sm"
            style={{
              left: `${20 + i * 15}%`,
              bottom: '10%',
            }}
            animate={{
              y: [-20, -100],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default LandingCover;
