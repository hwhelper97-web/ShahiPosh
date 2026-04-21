import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        foreground: '#111111',
        primary: {
          DEFAULT: '#111111',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#f5f5f5',
          foreground: '#111111',
        },
        accent: {
          DEFAULT: '#d4af37',
          foreground: '#111111',
        },
        muted: {
          DEFAULT: '#f8f8f8',
          foreground: '#666666',
        },
        border: '#e5e5e5',
      }
    }
  },
  plugins: []
} satisfies Config;
