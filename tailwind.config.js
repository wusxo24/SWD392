/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Ensure this points to your source code
    './app/**/*.{js,tsx,ts,jsx}',
    './components/**/*.{js,tsx,ts,jsx}'
    // Do the same with `components`, `hooks`, `styles`, or any other top-level directories
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Noto Sans', 'sans-serif'],
      },
      colors: {
        'gradient-start': '#50FF5699',
        'gradient-end': '#058BBB99',
      },
    },
  },
  plugins: [],
};