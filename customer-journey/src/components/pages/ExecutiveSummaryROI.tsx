/**
 * ExecutiveSummaryROI Component
 *
 * The "Treasure" page displaying ROI calculations, KPI tiles,
 * package comparison, and checkout CTA.
 */

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useJourney } from '../../context/JourneyContext';
import { SuggestionsModal } from '../modals/SuggestionsModal';
import { getValueOptimizationSuggestions } from '../../utils/suggestions';
import { formatCurrency, formatNumber } from '../../utils/roiCalculations';

export function ExecutiveSummaryROI() {
  const {
    state,
    config,
    roiCalculation,
    updateROIInput,
    selectPackage,
    dispatch,
    navigateToView,
    totalChapters,
  } = useJourney();

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMethodology, setShowMethodology] = useState(false);

  const handlePrevious = useCallback(() => {
    dispatch({ type: 'SET_CHAPTER_INDEX', payload: totalChapters - 1 });
    dispatch({ type: 'SET_TRANSITION', payload: 'page-turn-back' });
    navigateToView('chapter', 'page-turn-back');
  }, [dispatch, navigateToView, totalChapters]);

  const handleProceedToCheckout = useCallback(() => {
    dispatch({ type: 'SET_TRANSITION', payload: 'treasure-erupt' });
    setTimeout(() => {
      navigateToView('checkout', 'treasure-erupt');
    }, 100);
  }, [dispatch, navigateToView]);

  const kpiTiles = [
    {
      label: 'Estimated Time Saved',
      value: `${formatNumber(roiCalculation.estimatedTimeSavedPerYear)} hrs`,
      subtitle: 'per year',
      icon: '⏱️',
      color: 'from-blue-500 to-blue-600',
    },
    {
      label: 'Estimated Annual ROI',
      value: formatCurrency(roiCalculation.estimatedAnnualROI),
      subtitle: 'in savings',
      icon: '💰',
      color: 'from-green-500 to-green-600',
    },
    {
      label: 'Payback Period',
      value: `${roiCalculation.estimatedPaybackPeriod} mo`,
      subtitle: 'to break even',
      icon: '📈',
      color: 'from-purple-500 to-purple-600',
    },
    {
      label: 'Implementation Time',
      value: `${roiCalculation.estimatedImplementationTime} hrs`,
      subtitle: 'total setup',
      icon: '🔧',
      color: 'from-orange-500 to-orange-600',
    },
  ];

  const keyBenefits = [
    'Reduce manual work by automating repetitive tasks',
    '24/7 operation without additional staffing costs',
    'Consistent quality and reduced human error',
    'Scale operations without proportional headcount increase',
    'Free up staff for higher-value strategic work',
  ];

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <motion.div
        className="px-4 md:px-8 py-6 text-center border-b border-gold-400/20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-2xl md:text-3xl lg:text-4xl text-ink-500 mb-2">
          Your Treasure Awaits
        </h1>
        <p className="font-body text-ink-400">
          Executive Summary & ROI Calculator
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-8">
        {/* KPI Tiles */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="font-serif text-lg text-ink-500 mb-4">Key Metrics</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiTiles.map((tile, index) => (
              <motion.div
                key={tile.label}
                className="bg-parchment-100 rounded-lg p-4 border border-gold-400/20 relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${tile.color}`} />
                <div className="text-2xl mb-2">{tile.icon}</div>
                <p className="text-xs text-ink-300 uppercase tracking-wide">{tile.label}</p>
                <p className="font-display text-xl md:text-2xl text-ink-600">{tile.value}</p>
                <p className="text-xs text-ink-400">{tile.subtitle}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Key Benefits */}
        <motion.section
          className="bg-parchment-100 rounded-lg p-6 border border-gold-400/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="font-serif text-lg text-ink-500 mb-4 flex items-center gap-2">
            <span className="text-gold-500">✨</span> Key Benefits
          </h2>
          <ul className="space-y-2">
            {keyBenefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-3 font-body text-ink-500">
                <span className="text-gold-500 mt-1">•</span>
                {benefit}
              </li>
            ))}
          </ul>
        </motion.section>

        {/* ROI Calculator */}
        <motion.section
          className="bg-parchment-100 rounded-lg p-6 border border-gold-400/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="font-serif text-lg text-ink-500 mb-4 flex items-center gap-2">
            <span className="text-gold-500">🧮</span> Customize Your ROI
          </h2>
          <div className="space-y-6">
            {config.roi.sliders.map((slider) => {
              const value = state.roiInputs[slider.id as keyof typeof state.roiInputs];
              return (
                <div key={slider.id}>
                  <div className="flex justify-between mb-2">
                    <label htmlFor={slider.id} className="font-body text-ink-500">
                      {slider.label}
                    </label>
                    <span className="font-display text-gold-600">
                      {slider.id === 'automationUptakeRate' ? `${value}%` : slider.id === 'avgHourlyCost' ? `$${value}` : value}
                    </span>
                  </div>
                  <input
                    type="range"
                    id={slider.id}
                    min={slider.min}
                    max={slider.max}
                    step={slider.step}
                    value={value}
                    onChange={(e) => updateROIInput(slider.id as keyof typeof state.roiInputs, parseInt(e.target.value))}
                    className="w-full h-2 bg-parchment-300 rounded-lg appearance-none cursor-pointer accent-gold-500"
                    aria-label={slider.label}
                  />
                  <div className="flex justify-between text-xs text-ink-300 mt-1">
                    <span>{slider.id === 'avgHourlyCost' ? `$${slider.min}` : slider.id === 'automationUptakeRate' ? `${slider.min}%` : slider.min}</span>
                    <span>{slider.id === 'avgHourlyCost' ? `$${slider.max}` : slider.id === 'automationUptakeRate' ? `${slider.max}%` : slider.max}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* Package Comparison */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="font-serif text-lg text-ink-500 mb-4">Choose Your Path</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {config.packages.map((pkg) => {
              const isSelected = state.selectedPackage?.tier === pkg.tier;
              return (
                <motion.div
                  key={pkg.tier}
                  className={`relative bg-parchment-100 rounded-lg p-5 border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-gold-500 shadow-glow-gold'
                      : 'border-gold-400/20 hover:border-gold-400/50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => selectPackage(pkg)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && selectPackage(pkg)}
                  aria-pressed={isSelected}
                >
                  {pkg.tier === 'Growth' && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gold-500 text-ink-600 text-xs font-bold rounded-full">
                      POPULAR
                    </div>
                  )}
                  <h3 className="font-display text-xl text-ink-500 mb-1">{pkg.tier}</h3>
                  <p className="font-display text-2xl text-gold-600 mb-2">{formatCurrency(pkg.priceUSD)}</p>
                  <p className="font-body text-sm text-ink-400 mb-4">{pkg.description}</p>
                  <ul className="space-y-2">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm font-body text-ink-500">
                        <span className="text-gold-500">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {isSelected && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-gold-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-ink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Net Annual ROI Table */}
        <motion.section
          className="bg-parchment-100 rounded-lg p-6 border border-gold-400/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="font-serif text-lg text-ink-500 mb-4">3-Year ROI Projection</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gold-400/30">
                  <th className="text-left py-2 font-serif text-ink-500">Year</th>
                  <th className="text-right py-2 font-serif text-ink-500">Net ROI</th>
                  <th className="text-right py-2 font-serif text-ink-500">Cumulative</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3].map((year) => {
                  const yearROI = year === 1
                    ? roiCalculation.netAnnualROIYear1
                    : year === 2
                    ? roiCalculation.netAnnualROIYear2
                    : roiCalculation.netAnnualROIYear3;
                  const cumulative = year === 1
                    ? roiCalculation.netAnnualROIYear1
                    : year === 2
                    ? roiCalculation.netAnnualROIYear1 + roiCalculation.netAnnualROIYear2
                    : roiCalculation.netAnnualROIYear1 + roiCalculation.netAnnualROIYear2 + roiCalculation.netAnnualROIYear3;

                  return (
                    <tr key={year} className="border-b border-gold-400/10">
                      <td className="py-3 font-body text-ink-500">Year {year}</td>
                      <td className={`py-3 text-right font-display ${yearROI >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(yearROI)}
                      </td>
                      <td className={`py-3 text-right font-display ${cumulative >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(cumulative)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Scaling without overhead */}
          <div className="mt-4 p-4 bg-gold-400/10 rounded-lg">
            <p className="font-body text-ink-500">
              <span className="font-semibold">Scaling without overhead:</span> By automating these processes, you avoid approximately {formatCurrency(roiCalculation.scalingWithoutOverhead)} in new hire costs annually.
            </p>
          </div>
        </motion.section>

        {/* Methodology Collapsible */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <button
            onClick={() => setShowMethodology(!showMethodology)}
            className="w-full flex items-center justify-between p-4 bg-parchment-100 rounded-lg border border-gold-400/20 hover:border-gold-400/40 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400"
            aria-expanded={showMethodology}
          >
            <span className="font-serif text-ink-500">Methodology & Assumptions</span>
            <svg
              className={`w-5 h-5 text-ink-400 transition-transform ${showMethodology ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showMethodology && (
            <motion.div
              className="mt-2 p-4 bg-parchment-100 rounded-lg border border-gold-400/20"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <ul className="space-y-2 text-sm font-body text-ink-400">
                {Object.entries(config.roi.assumptions).map(([key, value]) => (
                  <li key={key} className="flex items-start gap-2">
                    <span className="text-gold-500">•</span>
                    <span><strong className="text-ink-500">{key.replace(/([A-Z])/g, ' $1').trim()}:</strong> {value}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </motion.section>
      </div>

      {/* Bottom Navigation */}
      <div className="sticky bottom-0 bg-gradient-to-t from-parchment-200 via-parchment-200 to-transparent pt-8 pb-4 px-4 md:px-8">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handlePrevious}
            className="px-4 py-2 md:px-6 md:py-3 bg-parchment-400 hover:bg-parchment-500 text-ink-500 font-serif rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Previous</span>
          </button>

          <button
            onClick={() => setShowSuggestions(true)}
            className="px-3 py-2 md:px-4 md:py-3 bg-parchment-300 hover:bg-parchment-400 text-ink-500 font-serif rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span className="hidden md:inline">Value Tips</span>
          </button>

          <motion.button
            onClick={handleProceedToCheckout}
            className="px-6 py-3 md:px-8 md:py-4 bg-gradient-to-b from-gold-300 to-gold-500 hover:from-gold-200 hover:to-gold-400 text-ink-600 font-display text-lg rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-gold-400 shadow-lg hover:shadow-glow-gold flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Proceed to Checkout</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Suggestions Modal */}
      <SuggestionsModal
        isOpen={showSuggestions}
        title="Value Optimization"
        suggestions={getValueOptimizationSuggestions()}
        onClose={() => setShowSuggestions(false)}
      />
    </div>
  );
}

export default ExecutiveSummaryROI;
