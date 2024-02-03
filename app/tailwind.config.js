const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      // Define your custom primary color here
      colors: {
        primary: {
          DEFAULT: '#007459', // Change this color code to your desired primary color
        },
      },
      fontFamily: {
        sans: ['Outfit', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  daisyui: {
    themes: ['light', 'dark', 'cupcake', 'nord', 'lofi'],
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
};
