/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        flow: {
          dark: '#0B1120',
          card: '#111827',
          cardLight: '#1E293B',
          accent: '#22C55E', // emerald-500
          sky: '#38BDF8', // sky-400
          warning: '#F59E0B', // amber-500
          danger: '#EF4444', // red-500
          text: '#F8FAFC',
          muted: '#94A3B8',
          border: '#334155'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-green': '0 0 25px -5px rgba(34, 197, 94, 0.25)',
        'glow-sky': '0 0 25px -5px rgba(56, 189, 248, 0.25)',
      }
    },
  },
  plugins: [],
}
