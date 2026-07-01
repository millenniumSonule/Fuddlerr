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
          black: '#2A2420',
          charcoal: '#3E3935',
          stone: '#6B6359',
          muted: '#8B8177',
          secondary: '#9D9189',
          cream: '#F5EFE7',
          primary: '#FAF7F2',
          gold: '#C6972F',
          goldWarm: '#D8A949',
          goldLight: '#E8C563',
          espresso: '#F5EFE7',
          taupe: '#7A6B5D',
          earth: '#6B5D4F',
          forest: '#3D4A3A',
          forestLight: '#5A6B55',
          sage: '#7D8B6F',
          copper: '#A0714F',
          coralLight: '#D4B5A0',
          base: '#F5EFE7',
          primaryPop: '#C6972F',
          secondaryPop: '#D8A949',
          energyAccent: '#D8A949',
          nordicPastel: '#F5EFE7',
          textDark: '#2A2420',
          textSecondary: '#6B6359',
          warmBg: '#FBF8F3',
          warmGray: '#E8DFD5',
          warmText: '#3E3935',
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
