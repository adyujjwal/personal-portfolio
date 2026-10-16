/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#050507',
          900: '#0a0a0f',
          800: '#111118',
          700: '#1a1a24',
          600: '#262630',
        },
        bone: {
          100: '#f5f5f2',
          200: '#e7e7e2',
          300: '#b8b8b2',
          400: '#8a8a84',
        },
        accent: {
          DEFAULT: '#6ea8ff',
          soft: '#9ec1ff',
          deep: '#2d5bd7',
        },
        walmart: '#0071dc',
        sap: '#0a6ed1',
      },
      fontFamily: {
        display: ['"Clash Display"', 'system-ui', 'sans-serif'],
        sans: ['Satoshi', 'Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        content: '1760px',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
