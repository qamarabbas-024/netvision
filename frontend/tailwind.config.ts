import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'Fira Code', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        brand: {
          50: '#ecfeff',
          100: '#cffaff',
          400: '#22d3ee',
          500: '#00f0ff',
          600: '#0891b2',
          900: '#164e63',
        },
        net: {
          bg: '#09090b',
          card: '#121217',
          surface: '#181820',
          border: '#272732',
          cyan: '#00f0ff',
          blue: '#3b82f6',
          purple: '#8b5cf6',
          emerald: '#10b981',
          rose: '#ef4444',
          amber: '#f59e0b',
        },
      },
      backgroundImage: {
        'net-grid': 'linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)',
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.4)',
        'elevated': '0 4px 12px -2px rgba(0, 0, 0, 0.6), 0 2px 4px -1px rgba(0, 0, 0, 0.4)',
        'focus-cyan': '0 0 0 2px rgba(0, 240, 255, 0.25)',
      },
      animation: {
        'packet-flow': 'packetFlow 2s linear infinite',
      },
      keyframes: {
        packetFlow: {
          '0%': { offsetDistance: '0%' },
          '100%': { offsetDistance: '100%' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
