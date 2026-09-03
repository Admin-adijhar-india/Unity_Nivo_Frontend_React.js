/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          light: '#f1d279',
          DEFAULT: '#d4af37',
          dark: '#b39025',
          deep: '#8f701b'
        },
        darkbg: {
          light: '#0e241f',
          DEFAULT: '#040d12',
          deep: '#02070a',
          card: '#08171d',
          cardHover: '#0b2029'
        },
        emerald: {
          950: '#022c22'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(circle, var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
