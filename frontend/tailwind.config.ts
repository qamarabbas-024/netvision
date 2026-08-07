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
      colors: {
        brand: {
          50: '#e6faff',
          100: '#b3f3ff',
          400: '#00d5ff',
          500: '#00f0ff',
          600: '#00b8cc',
          900: '#003a43',
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
          rose: '#f43f5e',
          amber: '#f59e0b',
        },
      },
      backgroundImage: {
        'net-grid': 'radial-gradient(circle, rgba(0, 240, 255, 0.07) 1px, transparent 1px)',
        'net-gradient': 'linear-gradient(to right, #00f0ff, #3b82f6, #8b5cf6)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(0, 240, 255, 0.3)',
        'glow-blue': '0 0 25px -5px rgba(59, 130, 246, 0.3)',
        'glow-purple': '0 0 25px -5px rgba(139, 92, 246, 0.3)',
      },
      animation: {
        'packet-flow': 'packetFlow 2s linear infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      },
      keyframes: {
        packetFlow: {
          '0%': { offsetDistance: '0%' },
          '100%': { offsetDistance: '100%' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
