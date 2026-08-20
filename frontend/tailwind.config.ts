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
        surface: {
          0: '#121316', // Canvas Base
          1: '#16181f', // Section / Recessed Group
          2: '#1b1e26', // Panel / Card / Workbench
          3: '#14151a', // Recessed Well / Tool / Terminal
        },
        net: {
          bg: '#121316',
          card: '#1b1e26',
          surface: '#20232b',
          border: '#2a2e39',
          cyan: '#38bdf8',
          blue: '#2563eb',
          purple: '#818cf8',
          emerald: '#10b981',
          rose: '#ef4444',
          amber: '#f59e0b',
        },
      },
      backgroundImage: {
        'net-grid': 'linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)',
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.5)',
        'elevated': '0 4px 14px -2px rgba(0, 0, 0, 0.7), 0 2px 4px -1px rgba(0, 0, 0, 0.5)',
        'instrument': 'inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 1px 2px rgba(0, 0, 0, 0.6)',
        'well': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.6)',
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
