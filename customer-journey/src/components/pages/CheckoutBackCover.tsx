/**
 * CheckoutBackCover Component
 *
 * The back cover of the book - checkout page with cart summary,
 * demo payment form, and hero return celebration.
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJourney } from '../../context/JourneyContext';
import { formatCurrency } from '../../utils/roiCalculations';

export function CheckoutBackCover() {
  const { state, dispatch, navigateToView } = useJourney();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: '',
    email: '',
  });

  const cartTotal = state.cartLineItems.reduce((sum, item) => sum + item.costUSD, 0);
  const packagePrice = state.selectedPackage?.priceUSD ?? 0;
  const finalTotal = state.selectedPackage ? packagePrice : cartTotal;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayment = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    dispatch({ type: 'COMPLETE_PAYMENT' });
    setIsProcessing(false);
  }, [dispatch]);

  const handlePrevious = useCallback(() => {
    dispatch({ type: 'SET_TRANSITION', payload: 'page-turn-back' });
    navigateToView('executive-summary', 'page-turn-back');
  }, [dispatch, navigateToView]);

  const handleStartNewJourney = useCallback(() => {
    dispatch({ type: 'RESET_JOURNEY' });
    navigateToView('landing-cover', 'none');
  }, [dispatch, navigateToView]);

  // Payment Success Screen (Hero Return)
  if (state.paymentComplete) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
        {/* Celebration background effects */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Golden rays */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 w-1 h-full bg-gradient-to-b from-gold-400/40 to-transparent origin-bottom"
              style={{
                rotate: `${i * 30}deg`,
              }}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ delay: i * 0.05, duration: 0.8 }}
            />
          ))}

          {/* Floating particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-2 h-2 bg-gold-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                y: [-20, -100],
              }}
              transition={{
                delay: 0.5 + i * 0.1,
                duration: 2,
                repeat: Infinity,
                repeatDelay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Hero Return Content */}
        <motion.div
          className="relative z-10 max-w-lg mx-auto"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring', damping: 15 }}
        >
          {/* Trophy/Medal Icon */}
          <motion.div
            className="w-32 h-32 mx-auto mb-8 relative"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gold-300 to-gold-600 rounded-full shadow-glow-gold" />
            <div className="absolute inset-4 bg-gradient-to-br from-gold-200 to-gold-400 rounded-full flex items-center justify-center">
              <span className="text-5xl">🏆</span>
            </div>
          </motion.div>

          <motion.h1
            className="font-display text-3xl md:text-4xl text-ink-500 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Welcome Home, Hero!
          </motion.h1>

          <motion.p
            className="font-body text-lg text-ink-400 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            {state.viewerName || 'Brave adventurer'}, your quest for automation excellence has begun.
            The realm of efficiency awaits your command.
          </motion.p>

          <motion.div
            className="bg-parchment-100 rounded-lg p-6 mb-8 border border-gold-400/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <h2 className="font-serif text-lg text-ink-500 mb-4">Your Order Summary</h2>
            {state.selectedPackage ? (
              <div className="text-left">
                <p className="font-body text-ink-500">
                  <span className="font-semibold">{state.selectedPackage.tier} Package</span>
                </p>
                <p className="font-display text-2xl text-gold-600 mt-2">
                  {formatCurrency(state.selectedPackage.priceUSD)}
                </p>
              </div>
            ) : (
              <div className="text-left">
                <p className="font-body text-ink-500">
                  {state.cartLineItems.length} automation(s) selected
                </p>
                <p className="font-display text-2xl text-gold-600 mt-2">
                  {formatCurrency(cartTotal)}
                </p>
              </div>
            )}
          </motion.div>

          <motion.p
            className="font-body text-ink-400 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            Our team will reach out within 24 hours to begin your implementation journey.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
          >
            <a
              href="https://calendly.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-8 py-4 bg-gradient-to-b from-gold-400 to-gold-600 hover:from-gold-300 hover:to-gold-500 text-ink-600 font-display text-lg rounded-lg transition-all shadow-lg hover:shadow-glow-gold text-center"
            >
              Book Your Implementation Call
            </a>
            <button
              onClick={handleStartNewJourney}
              className="block w-full px-6 py-3 bg-parchment-400 hover:bg-parchment-500 text-ink-500 font-serif rounded-lg transition-colors"
            >
              Start a New Journey
            </button>
          </motion.div>
        </motion.div>

        {/* Audio indicator placeholder */}
        <div className="absolute bottom-4 right-4 text-ink-300 text-xs flex items-center gap-2">
          <span className="w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
          <span>Celebration fanfare</span>
        </div>
      </div>
    );
  }

  // Checkout Form
  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <motion.div
        className="px-4 md:px-8 py-6 text-center border-b border-gold-400/20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-2xl md:text-3xl text-ink-500 mb-2">
          Complete Your Quest
        </h1>
        <p className="font-body text-ink-400">
          Review your selections and proceed to payment
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Cart Summary */}
          <motion.section
            className="bg-parchment-100 rounded-lg p-6 border border-gold-400/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="font-serif text-lg text-ink-500 mb-4 flex items-center gap-2">
              <span className="text-gold-500">🛒</span> Order Summary
            </h2>

            {state.selectedPackage ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gold-400/20">
                  <div>
                    <p className="font-serif text-ink-500">{state.selectedPackage.tier} Package</p>
                    <p className="text-sm text-ink-400">
                      Includes: {state.selectedPackage.includedChapterIds.length} automations
                    </p>
                  </div>
                  <p className="font-display text-lg text-ink-600">
                    {formatCurrency(state.selectedPackage.priceUSD)}
                  </p>
                </div>
              </div>
            ) : state.cartLineItems.length > 0 ? (
              <div className="space-y-3">
                {state.cartLineItems.map((item) => (
                  <div
                    key={item.chapterId}
                    className="flex justify-between items-center py-2 border-b border-gold-400/20"
                  >
                    <div>
                      <p className="font-serif text-ink-500">{item.chapterTitle.replace(/Chapter \w+: /, '')}</p>
                      <p className="text-sm text-ink-400">{item.implHours}h implementation</p>
                    </div>
                    <p className="font-display text-ink-600">{formatCurrency(item.costUSD)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-ink-400 font-body italic">No items selected</p>
            )}

            {/* Totals */}
            <div className="mt-4 pt-4 border-t-2 border-gold-400/30">
              <div className="flex justify-between items-center">
                <p className="font-serif text-lg text-ink-500">Total</p>
                <p className="font-display text-2xl text-gold-600">{formatCurrency(finalTotal)}</p>
              </div>
            </div>
          </motion.section>

          {/* Payment Form */}
          <motion.section
            className="bg-parchment-100 rounded-lg p-6 border border-gold-400/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-serif text-lg text-ink-500 mb-4 flex items-center gap-2">
              <span className="text-gold-500">💳</span> Payment Details
            </h2>

            <p className="text-sm text-ink-400 mb-4 bg-gold-400/10 p-3 rounded-lg">
              <strong>Demo Mode:</strong> This is a demonstration. No actual payment will be processed.
            </p>

            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-body text-ink-500 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={paymentForm.name}
                  onChange={handleInputChange}
                  placeholder="John Smith"
                  required
                  className="w-full px-4 py-3 bg-parchment-50 border border-gold-400/30 rounded-lg font-body text-ink-500 placeholder-ink-300/50 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-body text-ink-500 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={paymentForm.email}
                  onChange={handleInputChange}
                  placeholder="john@company.com"
                  required
                  className="w-full px-4 py-3 bg-parchment-50 border border-gold-400/30 rounded-lg font-body text-ink-500 placeholder-ink-300/50 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
                />
              </div>

              <div>
                <label htmlFor="cardNumber" className="block text-sm font-body text-ink-500 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={paymentForm.cardNumber}
                  onChange={handleInputChange}
                  placeholder="4242 4242 4242 4242"
                  required
                  maxLength={19}
                  className="w-full px-4 py-3 bg-parchment-50 border border-gold-400/30 rounded-lg font-body text-ink-500 placeholder-ink-300/50 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiry" className="block text-sm font-body text-ink-500 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    id="expiry"
                    name="expiry"
                    value={paymentForm.expiry}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    required
                    maxLength={5}
                    className="w-full px-4 py-3 bg-parchment-50 border border-gold-400/30 rounded-lg font-body text-ink-500 placeholder-ink-300/50 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
                  />
                </div>
                <div>
                  <label htmlFor="cvc" className="block text-sm font-body text-ink-500 mb-1">
                    CVC
                  </label>
                  <input
                    type="text"
                    id="cvc"
                    name="cvc"
                    value={paymentForm.cvc}
                    onChange={handleInputChange}
                    placeholder="123"
                    required
                    maxLength={4}
                    className="w-full px-4 py-3 bg-parchment-50 border border-gold-400/30 rounded-lg font-body text-ink-500 placeholder-ink-300/50 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.button
                  type="submit"
                  disabled={isProcessing || finalTotal === 0}
                  className={`w-full px-8 py-4 rounded-lg font-display text-lg transition-all focus:outline-none focus:ring-2 focus:ring-gold-400 shadow-lg ${
                    isProcessing || finalTotal === 0
                      ? 'bg-parchment-400 text-ink-400 cursor-not-allowed'
                      : 'bg-gradient-to-b from-gold-400 to-gold-600 hover:from-gold-300 hover:to-gold-500 text-ink-600 hover:shadow-glow-gold'
                  }`}
                  whileHover={!isProcessing && finalTotal > 0 ? { scale: 1.02 } : undefined}
                  whileTap={!isProcessing && finalTotal > 0 ? { scale: 0.98 } : undefined}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    `Pay ${formatCurrency(finalTotal)}`
                  )}
                </motion.button>
              </AnimatePresence>
            </form>
          </motion.section>

          {/* Security Note */}
          <motion.p
            className="text-center text-xs text-ink-300 font-body"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            🔒 Your payment information is secure and encrypted.
          </motion.p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="sticky bottom-0 bg-gradient-to-t from-parchment-200 via-parchment-200 to-transparent pt-8 pb-4 px-4 md:px-8">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handlePrevious}
            className="px-4 py-2 md:px-6 md:py-3 bg-parchment-400 hover:bg-parchment-500 text-ink-500 font-serif rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Summary</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutBackCover;
