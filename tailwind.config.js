/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['selector', '[data-theme="dark"]'],
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
        ring: 'rgb(var(--color-ring) / <alpha-value>)',
        moss: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf0cd',
          300: '#86e0a5',
          400: '#4ac97a',
          500: '#22ac5c',
          600: '#168c4a',
          700: '#12703d',
          800: '#145933',
          900: '#12482b'
        },
        clay: {
          50: '#fff1eb',
          100: '#ffdfd1',
          200: '#ffc3a8',
          300: '#ff9a70',
          400: '#fa6c42',
          500: '#ed4c2a',
          600: '#d0371c',
          700: '#ac2a16',
          800: '#8a2416',
          900: '#6e2016'
        },
        sky: {
          50: '#eff8ff',
          100: '#dbeeff',
          200: '#b8ddff',
          300: '#8fc4ff',
          400: '#5fa2fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a'
        },
        berry: {
          50: '#fdf0f8',
          100: '#fbdeef',
          200: '#f6b8e0',
          300: '#ec8fcc',
          400: '#e879b8',
          500: '#db4aa5',
          600: '#be3389',
          700: '#9c2870',
          800: '#7c2159',
          900: '#631a47'
        },
        sun: {
          50: '#fffaeb',
          100: '#ffefc2',
          200: '#ffdd85',
          300: '#ffd66e',
          400: '#ffbe3c',
          500: '#f5a623',
          600: '#d68514',
          700: '#b06910',
          800: '#8a5310',
          900: '#6f4310'
        }
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        blob: '60% 40% 55% 45% / 45% 55% 45% 55%'
      },
      boxShadow: {
        soft: '0 2px 8px -2px rgb(0 0 0 / 0.08), 0 8px 24px -8px rgb(0 0 0 / 0.12)',
        softer: '0 1px 3px rgb(0 0 0 / 0.05)',
        glow: '0 0 0 4px rgb(var(--color-ring) / 0.18)'
      }
    }
  },
  plugins: []
}
