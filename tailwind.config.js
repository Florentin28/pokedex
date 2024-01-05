/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {
            scale: ['hover'],

    },
    animation: {
      'tada': 'tada 1s ease-in-out',
    },
  },
  purge: false, // Désactive la purge Tailwind
  plugins: [],
}
