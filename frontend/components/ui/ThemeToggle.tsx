'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export type ThemeMode =
  | 'obsidian'
  | 'midnight-slate'
  | 'oled-deepspace'
  | 'matrix-terminal'
  | 'solar-cream'
  | 'dark'
  | 'light';

interface ThemeContextType {
  theme: 'dark' | 'light';
  currentTheme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentThemeState] = useState<ThemeMode>('obsidian');

  useEffect(() => {
    // Load persisted theme
    const saved = localStorage.getItem('netvision_theme') as ThemeMode | null;
    if (saved) {
      setCurrentThemeState(saved);
      applyTheme(saved);
    } else {
      applyTheme('obsidian');
    }
  }, []);

  const applyTheme = (t: ThemeMode) => {
    const root = document.documentElement;
    root.setAttribute('data-theme', t);

    // Map light vs dark
    if (t === 'solar-cream' || t === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
  };

  const setTheme = (t: ThemeMode) => {
    setCurrentThemeState(t);
    localStorage.setItem('netvision_theme', t);
    applyTheme(t);
  };

  const toggleTheme = () => {
    if (currentTheme === 'solar-cream' || currentTheme === 'light') {
      setTheme('obsidian');
    } else {
      setTheme('solar-cream');
    }
  };

  const isLight = currentTheme === 'solar-cream' || currentTheme === 'light';

  return (
    <ThemeContext.Provider
      value={{
        theme: isLight ? 'light' : 'dark',
        currentTheme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="p-2 rounded-xl bg-[var(--surface-3)] border border-[var(--border-hairline)] hover:border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      aria-label="Toggle light/dark mode"
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-amber-400" />
      ) : (
        <Moon className="w-4 h-4 text-indigo-400" />
      )}
    </button>
  );
};
