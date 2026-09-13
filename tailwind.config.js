/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        are: {
          primary: '#321B29',
          gold: '#D89A27',
          paprika: '#B9472E',
          indigo: '#294B73',
          ivory: '#FFF8EC',
          black: '#151313',
        },
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        label: ['"Montserrat"', 'sans-serif'],
      },
      keyframes: {
        kenburns: {
          '0%': { transform: 'scale(1) translate(0, 0)' },
          '100%': { transform: 'scale(1.15) translate(-2%, -2%)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseRing: {
          '0%': { boxShadow: '0 0 0 0 rgba(37, 211, 102, 0.5)' },
          '70%': { boxShadow: '0 0 0 15px rgba(37, 211, 102, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(37, 211, 102, 0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        kenburns: 'kenburns 8s ease-out forwards',
        marquee: 'marquee 30s linear infinite',
        pulseRing: 'pulseRing 2s infinite',
        fadeInUp: 'fadeInUp 0.8s ease-out forwards',
        slideInRight: 'slideInRight 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
};
