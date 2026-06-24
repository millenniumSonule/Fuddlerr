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
          cream: '#F5F1EB',
          sand: '#E8DFD4',
          taupe: '#C4B8A8',
          stone: '#8C7F72',
          earth: '#5C4E3D',
          charcoal: '#2B2825',
          espresso: '#1A1714',
          gold: '#B8914A',
          goldLight: '#D4B87A',
          copper: '#A66C4E',
          forest: '#3D4A3A',
          forestLight: '#5A6B55',
          sage: '#7D8B6F',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'fade-in-slow': 'fadeIn 1.2s ease-out forwards',
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
      },
    },
  },
  plugins: [],
};
