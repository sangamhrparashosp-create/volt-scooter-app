/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#10181A',
        surface: '#F3F7F5',
        teal: {
          DEFAULT: '#0B3D3A',
          700: '#082B29',
          50: '#E6EDEC',
        },
        volt: '#C8FF3D',
        slate: {
          DEFAULT: '#5B6B68',
          200: '#D7DFDD',
        },
        rust: '#E0562D',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        card: '20px',
      },
    },
  },
  plugins: [],
}
