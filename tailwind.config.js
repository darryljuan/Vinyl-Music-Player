/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // charcoal / warm cream / walnut / brass — see spec section 11
        walnut: {
          950: '#1c1512',
          900: '#241a15',
          800: '#33241c',
        },
        cream: {
          50: '#faf6ef',
          100: '#f2ead9',
        },
        brass: {
          400: '#d4a24c',
          500: '#c08a35',
          600: '#a8752b',
        },
      },
      boxShadow: {
        vinyl: 'inset 0 0 60px rgba(0,0,0,0.6), 0 10px 40px rgba(0,0,0,0.5)',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
    },
  },
  plugins: [],
}
