/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'neon-yellow': '#e4ff00',
        'dark-bg': '#0a0a0f',
        'dark-card': '#12121a',
        'rank-s': '#ff4d4d',
        'rank-a': '#ff9933',
        'rank-b': '#33cc33',
        'rank-c': '#3399ff',
        'rank-d': '#9966ff',
        'rank-e': '#808080',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neon': '0 8px 24px rgba(228, 255, 0, 0.15)',
      },
      screens: {
        'xs': '320px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1440px',
      },
    },
  },
  plugins: [],
};