'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
}

export interface TabsProps {
  items: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ items, activeTab, onChange, className }) => {
  return (
    <div className={cn('flex items-center gap-2 p-1.5 glass-panel rounded-2xl border border-[#272732]', className)}>
      {items.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 relative',
              isActive
                ? 'bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 shadow-glow-cyan'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            )}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined ? (
              <span className={cn('px-1.5 py-0.5 rounded-full text-[10px]', isActive ? 'bg-[#00f0ff]/20 text-[#00f0ff]' : 'bg-zinc-800 text-zinc-400')}>
                {tab.badge}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
};
