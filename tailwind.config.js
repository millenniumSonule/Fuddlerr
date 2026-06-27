/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      colors: {
        brand: {
          black: '#0F0F0F',
          charcoal: '#171717',
          stone: '#222222',
          muted: '#7E7E7E',
          secondary: '#B7B7B7',
          cream: '#EFE4D2',
          primary: '#F6F2EC',
          gold: '#C6972F',
          goldWarm: '#D8A949',
          goldLight: '#E8C563',
          espresso: '#0F0F0F',
          taupe: '#8B7355',
          earth: '#5C4A3D',
          forest: '#3D4A3A',
          forestLight: '#5A6B55',
          sage: '#7D8B6F',
          copper: '#8B6F47',
          coralLight: '#D4B5A0',
          base: '#0F0F0F',
          primaryPop: '#C6972F',
          secondaryPop: '#D8A949',
          energyAccent: '#D8A949',
          nordicPastel: '#EFE4D2',
          textDark: '#F6F2EC',
          textSecondary: '#B7B7B7',
        },
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        springBounce: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.08)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'fade-in-slow': 'fadeIn 1.2s ease-out forwards',
        'spring-bounce': 'springBounce 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'pulse-glow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
