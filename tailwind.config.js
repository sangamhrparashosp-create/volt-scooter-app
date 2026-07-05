/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#221F1D',
        surface: '#FAF7F2',
        teal: {
          DEFAULT: '#1F4E4A',
          700: '#163B38',
          50: '#E9EFEE',
        },
        volt: '#F2A93B',
        slate: {
          DEFAULT: '#6B6560',
          200: '#E5DFD7',
        },
        rust: '#D65A3A',
      },
      fontFamily: {
        display: ['"Baloo 2"', 'sans-serif'],
        body: ['Hind', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        card: '20px',
      },
    },
  },
  plugins: [],
}
