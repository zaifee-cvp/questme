// tailwind.config.ts
import type { Config } from 'tailwindcss'
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#f0fdf9',
          100: '#ccfbef',
          200: '#99f6e0',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#0ea895',
          600: '#0b7b6b',
          700: '#0a6659',
          800: '#085446',
          900: '#064035',
        },
      },
      keyframes: {
        'fade-in':  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'slide-up': { '0%': { opacity: '0', transform: 'translateY(10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        typing:     { '0%': { width: '0' }, '100%': { width: '100%' } },
      },
      animation: {
        'fade-in':  'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        typing:     'typing 1.5s steps(30, end)',
      },
    },
  },
  plugins: [],
}
export default config
