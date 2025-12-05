/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 40px rgba(56, 189, 248, 0.35)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle at top, rgba(56, 189, 248, 0.18), transparent 70%)',
      },
    },
  },
  plugins: [],
};