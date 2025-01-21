/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          '50': '#fef2f3',
          '100': '#ffe1e2',
          '200': '#ffc8cb',
          '300': '#ffa2a6',
          '400': '#fd6c73',
          '500': '#f53e46',
          '600': '#e32029',
          '700': '#bf161e',
          '800': '#9e161c',
          '900': '#83191e',
          '950': '#47080b',
        },
      },
    },
  },
  plugins: [],
  darkMode: 'selector',
}
