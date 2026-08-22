'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, Sparkles, Terminal, Moon, Sun, Monitor } from 'lucide-react';
import { useTheme, ThemeMode } from './ThemeToggle';

export interface ThemeOption {
  id: ThemeMode;
  name: string;
  badge: string;
  description: string;
  colors: [string, string, string];
  icon: React.ReactNode;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'obsidian',
    name: 'Obsidian Cyber',
    badge: 'DEFAULT',
    description: 'Deep Zinc & Electric Cyan precision',
    colors: ['#09090b', '#00f0ff', '#a855f7'],
    icon: <Sparkles className="w-3.5 h-3.5 text-[#00f0ff]" />,
  },
  {
    id: 'midnight-slate',
    name: 'Midnight Slate',
    badge: 'COMMAND',
    description: 'Command Center Ice Blue & Navy',
    colors: ['#0b0f19', '#38bdf8', '#2563eb'],
    icon: <Moon className="w-3.5 h-3.5 text-[#38bdf8]" />,
  },
  {
    id: 'oled-deepspace',
    name: 'OLED Deep Space',
    badge: 'HIGH-CONTRAST',
    description: 'Pure Pitch Black & Neon Indigo',
    colors: ['#000000', '#6366f1', '#ffffff'],
    icon: <Monitor className="w-3.5 h-3.5 text-[#6366f1]" />,
  },
  {
    id: 'matrix-terminal',
    name: 'Matrix Terminal',
    badge: 'CRT',
    description: 'Phosphor Green Terminal Console',
    colors: ['#0d1117', '#3fb950', '#2ea043'],
    icon: <Terminal className="w-3.5 h-3.5 text-[#3fb950]" />,
  },
  {
    id: 'solar-cream',
    name: 'Solar Cream',
    badge: 'EDITORIAL',
    description: 'Warm Alabaster & Sunlight Clarity',
    colors: ['#fbf9f4', '#0284c7', '#ea580c'],
    icon: <Sun className="w-3.5 h-3.5 text-[#ea580c]" />,
  },
];

export const ThemeSwitcher: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { currentTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeOption = THEME_OPTIONS.find((t) => t.id === currentTheme) || THEME_OPTIONS[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[var(--surface-3)] border border-[var(--border-hairline)] hover:border-[var(--border-subtle)] transition-all cursor-pointer text-xs font-mono"
        title="Switch Interface Palette Theme"
        aria-label="Switch Interface Theme"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-1">
          <span
            className="w-2.5 h-2.5 rounded-full border border-black/30 shrink-0"
            style={{ backgroundColor: activeOption.colors[1] }}
          />
        </div>
        {!compact && (
          <span className="text-[11px] font-semibold text-[var(--foreground)] truncate max-w-[90px]">
            {activeOption.name.split(' ')[0]}
          </span>
        )}
        <Palette className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[var(--surface-2)] border border-[var(--border-subtle)] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 font-sans">
          <div className="px-2.5 py-1.5 border-b border-[var(--border-hairline)] mb-1.5 flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-bold">
              Theme Palette
            </span>
            <span className="text-[9px] font-mono px-1 rounded bg-[var(--surface-3)] text-[var(--accent-cyan)]">
              5 CURATED
            </span>
          </div>

          <div className="flex flex-col gap-1">
            {THEME_OPTIONS.map((opt) => {
              const isSelected = currentTheme === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setTheme(opt.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--surface-3)] border border-[var(--accent-cyan)]/40 shadow-sm'
                      : 'hover:bg-[var(--surface-1)] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {/* Color Swatch Dots */}
                    <div className="flex items-center -space-x-1 shrink-0">
                      <span
                        className="w-3 h-3 rounded-full border border-black/40 z-20"
                        style={{ backgroundColor: opt.colors[1] }}
                      />
                      <span
                        className="w-3 h-3 rounded-full border border-black/40 z-10"
                        style={{ backgroundColor: opt.colors[2] }}
                      />
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-[var(--foreground)]">
                          {opt.name}
                        </span>
                        {opt.badge && (
                          <span className="text-[8px] font-mono px-1 rounded bg-[var(--surface-0)] text-[var(--text-muted)]">
                            {opt.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[var(--text-muted)] truncate max-w-[140px]">
                        {opt.description}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-[var(--accent-cyan)] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
