/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          colombia: '#00AEEF',
          ecuador: '#FF7A50',
          chile: '#E72B5A',
          argentina: '#7A0A83',
          latam: '#4B075C',
          bg: '#110524',
          panel: 'rgba(30, 10, 60, 0.85)',
          text: '#ffffff',
          muted: '#dfd5ed',
        }
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}

