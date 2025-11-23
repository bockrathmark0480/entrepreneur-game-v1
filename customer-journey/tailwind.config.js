/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          50: '#FDF8EF',
          100: '#FAF0DC',
          200: '#F6E7C1',
          300: '#ECD9A3',
          400: '#DCC480',
          500: '#C4A95C',
          600: '#A68940',
          700: '#7A6430',
          800: '#4E4020',
          900: '#2B2210',
        },
        ink: {
          50: '#E8E4E0',
          100: '#C9C0B8',
          200: '#A69A8E',
          300: '#7D6F60',
          400: '#5A4A3A',
          500: '#2B1B0E',
          600: '#24170C',
          700: '#1D130A',
          800: '#160F07',
          900: '#0F0A05',
        },
        gold: {
          50: '#FBF5E8',
          100: '#F5E8C8',
          200: '#EDD8A0',
          300: '#E4C878',
          400: '#D4AF37',
          500: '#B8942D',
          600: '#967823',
          700: '#745D1B',
          800: '#524213',
          900: '#30270B',
        },
        crimson: {
          500: '#8B0000',
          600: '#6B0000',
        },
      },
      fontFamily: {
        serif: ['Cinzel', 'Georgia', 'Times New Roman', 'serif'],
        display: ['Cinzel Decorative', 'Cinzel', 'Georgia', 'serif'],
        body: ['Crimson Text', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'parchment-texture': "url('/assets/textures/parchment.svg')",
        'leather-texture': "url('/assets/textures/leather.svg')",
      },
      boxShadow: {
        'book': '0 0 30px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(0, 0, 0, 0.2)',
        'page': '2px 0 10px rgba(0, 0, 0, 0.3)',
        'glow-gold': '0 0 20px rgba(212, 175, 55, 0.5)',
        'glow-fire': '0 0 30px rgba(255, 100, 0, 0.4)',
      },
      animation: {
        'flame-flicker': 'flicker 3s ease-in-out infinite',
        'banner-wave': 'wave 4s ease-in-out infinite',
        'ember-float': 'float 5s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        wave: {
          '0%, 100%': { transform: 'skewX(-2deg)' },
          '50%': { transform: 'skewX(2deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) scale(1)', opacity: '0.7' },
          '50%': { transform: 'translateY(-20px) scale(1.1)', opacity: '1' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(212, 175, 55, 0.5)' },
          '50%': { boxShadow: '0 0 30px rgba(212, 175, 55, 0.8)' },
        },
      },
    },
  },
  plugins: [],
}
