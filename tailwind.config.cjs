/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      colors: {
        'bluesky': {
          50: '#e6f5ff',
          100: '#cce9ff',
          200: '#99d2ff',
          300: '#66bbff',
          400: '#3388FF',
          500: '#0070FF',
          600: '#0057c6',
          700: '#004199',
          800: '#002b66',
          900: '#001533',
        }
      }
    },
  },
  plugins: [],
}
