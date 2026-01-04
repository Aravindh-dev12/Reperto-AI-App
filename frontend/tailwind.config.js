/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7C3AED',   // purple
        border: '#E5E7EB',
        bg: '#FFFFFF'
      }
    },
  },
  plugins: [],
};
