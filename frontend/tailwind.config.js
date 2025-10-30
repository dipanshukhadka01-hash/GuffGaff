/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        secondary: '#FB923C',
        night: '#0F172A',
        sand: '#FEF3C7'
      }
    }
  },
  plugins: []
};
