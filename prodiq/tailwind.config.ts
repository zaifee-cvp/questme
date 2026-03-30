import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        questme: {
          accent: '#AAFF00',
          bg: '#080A0E',
          surface: '#0F1117',
          border: '#1E2028',
          muted: '#6B7280',
        }
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        sans: ['DM Sans', 'sans-serif'],
      }
    }
  },
  plugins: []
}
export default config
