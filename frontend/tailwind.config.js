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
        premium: {
          dark: 'rgb(var(--premium-dark) / <alpha-value>)',
          card: 'rgb(var(--premium-card) / <alpha-value>)',
          glass: 'rgba(30, 41, 59, 0.7)',
          border: 'rgb(var(--premium-border) / <alpha-value>)',
          accent: 'rgb(var(--premium-accent) / <alpha-value>)',
          accentHover: 'rgb(var(--premium-accentHover) / <alpha-value>)',
          text: 'rgb(var(--premium-text) / <alpha-value>)',
          textSecondary: 'rgb(var(--premium-text) / <alpha-value>)',
          textMuted: 'rgb(var(--premium-textMuted) / <alpha-value>)',
          success: 'rgb(var(--premium-success) / <alpha-value>)',
          warning: 'rgb(var(--premium-warning) / <alpha-value>)',
          error: 'rgb(var(--premium-error) / <alpha-value>)',
        },
        brand: 'rgb(var(--brand) / <alpha-value>)',
        'brand-hover': 'rgb(var(--brand-hover) / <alpha-value>)',
        'on-brand': 'rgb(var(--on-brand) / <alpha-value>)',
        'danger-bg': 'rgb(var(--danger-bg) / <alpha-value>)',
        danger: 'rgb(var(--danger) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'premium': '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
        'premium-lg': '0 20px 40px -10px rgba(0, 0, 0, 0.6)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}