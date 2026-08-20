'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  size?: 'sm' | 'md';
}

export const Tabs: React.FC<TabsProps> = ({ items, activeTab, onChange, className, size = 'md' }) => {
  return (
    <div
      className={cn(
        'flex items-center gap-1.5 p-1 bg-[#14151a] rounded-lg border border-[#2a2e39] font-mono text-xs overflow-x-auto',
        className
      )}
      role="tablist"
    >
      {items.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              'px-3 py-1.5 rounded-md font-semibold transition-all flex items-center gap-1.5 shrink-0 focus:outline-none focus:ring-1 focus:ring-[#38bdf8]',
              size === 'sm' ? 'text-[11px] px-2.5 py-1' : 'text-xs px-3 py-1.5',
              isActive
                ? 'bg-[#2563eb] text-white shadow-sm font-bold'
                : 'text-[#8e95a5] hover:text-[#f4f5f7] hover:bg-[#1b1e26]'
            )}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined ? (
              <span
                className={cn(
                  'px-1.5 py-0.2 rounded text-[10px]',
                  isActive ? 'bg-white/20 text-white' : 'bg-[#1b1e26] text-[#8e95a5] border border-[#2a2e39]'
                )}
              >
                {tab.badge}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
};
