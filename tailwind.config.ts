import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        atelier: {
          bg: '#0E0B08',
          surface: '#171208',
          card: '#1E1710',
          line: '#3A2E20',
          text: '#F5EFE6',
          muted: '#B9A88F',
          gold: '#E5A50A',
          goldDim: '#8A6A1E',
          alert: '#E05A4E',
        },
        paper: {
          bg: '#F2E7CF',
          card: '#EADFC2',
          line: '#C4A87A',
          ink: '#3B2C1A',
          muted: '#7A6547',
        },
      },
      fontFamily: {
        display: ['"Noto Serif KR"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Noto Sans KR"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        'rise-in': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'caret-blink': { '0%,100%': { opacity: '1' }, '50%': { opacity: '0' } },
      },
      animation: {
        'rise-in': 'rise-in 0.6s cubic-bezier(0.16,1,0.3,1) both',
        'caret-blink': 'caret-blink 1s steps(1,end) infinite',
      },
      transitionTimingFunction: {
        atelier: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [animate],
} satisfies Config;
