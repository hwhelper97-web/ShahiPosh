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
      },
      backgroundImage: {
        'radial-vignette': 'radial-gradient(circle, transparent 0%, rgba(0,0,0,0.8) 100%)',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'marquee': 'marquee 30s linear infinite',
        'marquee-reverse': 'marquee-reverse 30s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        }
      }
    }
  },
  plugins: []
} satisfies Config;
