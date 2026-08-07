'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  defaultOpenId?: string;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({ items, defaultOpenId, className }) => {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId || null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className={cn('flex flex-col gap-3 w-full', className)}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id} className="glass-panel rounded-2xl border border-[#272732] overflow-hidden">
            <button
              onClick={() => toggle(item.id)}
              className="w-full p-4 text-left flex items-center justify-between font-bold text-white text-sm hover:text-[#00f0ff] transition-colors"
            >
              <span>{item.title}</span>
              <ChevronDown
                className={cn('w-4 h-4 text-zinc-400 transition-transform duration-200', isOpen && 'rotate-180 text-[#00f0ff]')}
              />
            </button>
            {isOpen && <div className="px-4 pb-4 text-xs text-zinc-400 border-t border-[#272732]/60 pt-3">{item.content}</div>}
          </div>
        );
      })}
    </div>
  );
};
