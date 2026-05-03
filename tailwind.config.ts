import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // FGL Brand Colors
        fgl: {
          purple: {
            50:  '#f5f3ff',
            100: '#ede9fe',
            200: '#ddd6fe',
            300: '#c4b5fd',
            400: '#a78bfa',
            500: '#8b5cf6',
            600: '#7c3aed',
            700: '#6d28d9',
            800: '#5b21b6',
            900: '#4c1d95',
            950: '#2e1065',
          },
          gold: {
            50:  '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309',
          },
          dark: {
            50:  '#1a0f3e',
            100: '#150c33',
            200: '#0f0a1e',
            300: '#0a0614',
            400: '#050308',
          },
          pink: '#f472b6',
          teal: '#14b8a6',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', 'Playfair Display', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'fgl-gradient':  'linear-gradient(135deg, #0f0a1e 0%, #1a0f3e 50%, #2d1b69 100%)',
        'fgl-card':      'linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(245,158,11,0.05) 100%)',
        'fgl-button':    'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)',
        'fgl-gold':      'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        'glass':         'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
      },
      boxShadow: {
        'fgl':       '0 0 40px rgba(124,58,237,0.3)',
        'fgl-sm':    '0 0 20px rgba(124,58,237,0.2)',
        'fgl-gold':  '0 0 30px rgba(245,158,11,0.3)',
        'glass':     '0 8px 32px rgba(0,0,0,0.4)',
        'card':      '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'float':         'float 6s ease-in-out infinite',
        'glow':          'glow 2s ease-in-out infinite alternate',
        'shimmer':       'shimmer 2s linear infinite',
        'slide-up':      'slideUp 0.4s ease-out',
        'slide-down':    'slideDown 0.4s ease-out',
        'fade-in':       'fadeIn 0.3s ease-out',
        'pulse-slow':    'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        glow: {
          'from': { boxShadow: '0 0 20px rgba(124,58,237,0.3)' },
          'to':   { boxShadow: '0 0 40px rgba(124,58,237,0.7)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideUp: {
          'from': { opacity: '0', transform: 'translateY(10px)' },
          'to':   { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          'from': { opacity: '0', transform: 'translateY(-10px)' },
          'to':   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to':   { opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
