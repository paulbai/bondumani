/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./art/index.html",
    "./resort/index.html",
    "./src/**/*.{js,ts,html}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fraunces Variable"', 'Fraunces', 'serif'],
        script: ['"Instrument Serif"', 'serif'],
        sans: ['"Geist Variable"', 'Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono Variable"', '"Geist Mono"', 'ui-monospace', 'monospace']
      },
      colors: {
        cream: '#f4efe3',
        ink: '#0d0d10',
        purple: {
          DEFAULT: '#4b1f7a',
          deep: '#2a0f4c',
          hi: '#7c3aed'
        },
        yellow: {
          DEFAULT: '#f5c518',
          deep: '#e2a809'
        },
        green: {
          DEFAULT: '#1c4733',
          deep: '#0f2a1e',
          hi: '#2e6d4d',
          mist: '#a7c8b4'
        }
      }
    }
  },
  plugins: []
}
