/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nudge': {
          brown: '#693d30',
          'brown-dark': '#160601',
          'brown-light': '#8B5A47',
          slate: '#1e293b',
          gray: '#334155',
          'gray-light': '#ADB6BE',
          background: '#F0F5FA',
          cream: '#FFF9F5',
        }
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
      },
      fontSize: {
        'nudge-h1': ['2.5rem', { lineHeight: '1.4' }],
        'nudge-h2': ['2rem', { lineHeight: '1.3' }],
        'nudge-h3': ['1.625rem', { lineHeight: '1.3' }],
        'nudge-h4': ['1.5rem', { lineHeight: '1.2' }],
        'nudge-h5': ['1.25rem', { lineHeight: '1.2' }],
        'nudge-body': ['1rem', { lineHeight: '1.65' }],
      },
      fontWeight: {
        'body': '400',
        'button': '500',
        'heading': '600',
      }
    },
  },
  plugins: [],
}