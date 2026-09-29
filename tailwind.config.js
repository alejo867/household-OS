/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      colors: {
        bg: 'rgb(var(--color-bg) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        surface2: 'rgb(var(--color-surface2) / <alpha-value>)',
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        moss: {
          50: '#f2f6f0',
          100: '#e0e9db',
          200: '#c3d4ba',
          300: '#a0bc93',
          400: '#7fa26e',
          500: '#5c7a5e',
          600: '#496048',
          700: '#3b4d3a',
          800: '#2f3d2f',
          900: '#263126'
        },
        clay: {
          50: '#fdf3ec',
          100: '#f9e0cc',
          200: '#f0c9a0',
          300: '#e3a670',
          400: '#d3854e',
          500: '#c4633b',
          600: '#a34f2f',
          700: '#803f27',
          800: '#5f2f1f',
          900: '#432117'
        }
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        blob: '60% 40% 55% 45% / 45% 55% 45% 55%'
      },
      boxShadow: {
        soft: '0 2px 8px -2px rgb(0 0 0 / 0.06), 0 8px 24px -8px rgb(0 0 0 / 0.08)',
        softer: '0 1px 3px rgb(0 0 0 / 0.04)'
      }
    }
  },
  plugins: []
}
