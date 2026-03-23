// Tailwind CSS config — scoped to source files only for minimal output
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        navy: {
          DEFAULT: '#0F1B3C',
          50:  '#e8ebf3',
          100: '#c5cde3',
          600: '#1a2f6b',
          700: '#0F1B3C',
          800: '#0b1530',
          900: '#070e1e',
        },
      },
    },
  },
  plugins: [],
};

export default config;
