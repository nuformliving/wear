/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#f5f0eb',
        'cream-light': '#faf7f4',
        blush: '#c4a28a',
        'blush-light': '#e8d5cc',
        'blush-dark': '#a88070',
        charcoal: '#2c2c2c',
        'warm-gray': '#8a7f7a',
        'border-light': '#e0d8d0',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Montserrat', 'sans-serif'],
      },
      letterSpacing: {
        ultra: '0.5em',
      },
    },
  },
  plugins: [],
}
