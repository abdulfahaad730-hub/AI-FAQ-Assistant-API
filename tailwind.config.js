/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#030712',
          card: 'rgba(15, 23, 42, 0.65)',
          'card-hover': 'rgba(30, 41, 59, 0.75)',
          border: 'rgba(0, 217, 255, 0.15)',
          'border-hover': 'rgba(0, 217, 255, 0.5)',
          'border-purple': 'rgba(124, 58, 237, 0.3)',
        },
        cyan: {
          neon: '#00D9FF',
          glow: 'rgba(0, 217, 255, 0.35)',
          dark: '#008ba3',
        },
        purple: {
          neon: '#7C3AED',
          glow: 'rgba(124, 58, 237, 0.35)',
          light: '#A855F7',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(0, 217, 255, 0.35), 0 0 40px rgba(0, 217, 255, 0.15)',
        'neon-purple': '0 0 20px rgba(124, 58, 237, 0.35), 0 0 40px rgba(124, 58, 237, 0.15)',
        'neon-cyan-sm': '0 0 10px rgba(0, 217, 255, 0.3)',
        'neon-purple-sm': '0 0 10px rgba(124, 58, 237, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-line': 'glowLine 3s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        glowLine: {
          '0%': { opacity: '0.3', filter: 'drop-shadow(0 0 2px rgba(0,217,255,0.4))' },
          '100%': { opacity: '0.8', filter: 'drop-shadow(0 0 10px rgba(0,217,255,0.9))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
