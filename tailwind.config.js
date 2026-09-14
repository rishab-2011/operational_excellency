/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#07080A', 900: '#0C0E11', 850: '#111418',
          800: '#171B20', 750: '#1E232A', 700: '#272D35',
          600: '#343B45', 500: '#4A525E',
        },
        paper: {
          50: '#FCFBF8', 100: '#F5F3EE', 200: '#EAE7DF',
          300: '#DCD8CE', 400: '#C6C1B4',
        },
        accent: {
          DEFAULT: '#C87F43', bright: '#D89355', deep: '#9A5A26',
          ink: '#8A4E1F', wash: 'rgba(200,127,67,0.10)',
        },
        /* Two tones per signal: the light-surface tone is darkened and the
           dark-surface tone lightened so both clear 4.5:1 for normal text. */
        signal: {
          pos: '#93C4A0', warn: '#E0B76B', neg: '#E29184', info: '#96C3D6',
          'pos-ink': '#3F6B4C', 'warn-ink': '#8A6320', 'neg-ink': '#9B4A3E', 'info-ink': '#3D6273',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        serif: ['Newsreader', 'Iowan Old Style', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.08em' }],
        'display': ['clamp(2.75rem, 8vw, 6.5rem)', { lineHeight: '0.95', letterSpacing: '-0.035em' }],
        'display-sm': ['clamp(2rem, 5.2vw, 3.75rem)', { lineHeight: '1.02', letterSpacing: '-0.03em' }],
        'lede': ['clamp(1.0625rem, 1.6vw, 1.375rem)', { lineHeight: '1.55', letterSpacing: '-0.011em' }],
      },
      maxWidth: { measure: '68ch', wide: '84rem', mid: '52rem' },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.16, 1, 0.3, 1)',
        inout: 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      keyframes: {
        'fade-up': { '0%': { opacity: '0', transform: 'translateY(14px)' }, '100%': { opacity: '1', transform: 'none' } },
        'draw': { '0%': { strokeDashoffset: '1' }, '100%': { strokeDashoffset: '0' } },
        'pulse-soft': { '0%,100%': { opacity: '0.55' }, '50%': { opacity: '1' } },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both',
        'pulse-soft': 'pulse-soft 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
