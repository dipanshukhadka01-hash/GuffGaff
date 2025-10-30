/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        guff: {
          sky: '#3F8EFC',
          dusk: '#1E3A8A',
          peach: '#FF9F68',
          sand: '#FFF4EC',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
