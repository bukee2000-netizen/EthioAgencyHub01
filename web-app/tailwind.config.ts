import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './config/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          900: '#064e3b'
        },
        ink: '#0f172a',
        'ink-dark': '#f1f5f9',
        surface: {
          DEFAULT: '#ffffff',
          dark: '#1e293b'
        },
        border: {
          DEFAULT: '#e2e8f0',
          dark: '#334155'
        }
      },
      boxShadow: {
        soft: '0 18px 45px rgba(15, 23, 42, 0.08)',
        'soft-dark': '0 18px 45px rgba(0, 0, 0, 0.3)'
      }
    }
  },
  plugins: []
};

export default config;
