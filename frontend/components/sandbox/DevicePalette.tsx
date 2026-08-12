'use client';

import React, { useState } from 'react';
import { NodeType } from '@/types';
import { RouterIcon, SwitchIcon, FirewallIcon, ServerIcon, PCIcon, CloudIcon } from '@/components/ui/Icons';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DevicePaletteProps {
  onAddDevice: (type: NodeType) => void;
}

export const DevicePalette: React.FC<DevicePaletteProps> = ({ onAddDevice }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const paletteItems: { type: NodeType; label: string; icon: React.ReactNode }[] = [
    { type: 'pc', label: 'Client PC', icon: <PCIcon size={20} /> },
    { type: 'server', label: 'Server Node', icon: <ServerIcon size={20} /> },
    { type: 'router', label: 'Gateway Router', icon: <RouterIcon size={20} /> },
    { type: 'switch', label: 'L2/L3 Switch', icon: <SwitchIcon size={20} /> },
    { type: 'firewall', label: 'Stateful Firewall', icon: <FirewallIcon size={20} /> },
    { type: 'cloud', label: 'Internet WAN', icon: <CloudIcon size={20} /> },
  ];

  return (
    <div
      className={cn(
        'glass-panel p-3.5 rounded-3xl border border-[#272732] flex flex-col gap-3 shrink-0 transition-all duration-300',
        isCollapsed ? 'w-full lg:w-16 items-center' : 'w-full lg:w-60'
      )}
    >
      <div className="flex items-center justify-between w-full border-b border-[#272732] pb-2">
        {!isCollapsed && (
          <h3 className="text-xs font-mono font-bold uppercase text-zinc-400 tracking-wider">
            Device Palette
          </h3>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            'p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors border border-white/10 shrink-0',
            isCollapsed && 'mx-auto'
          )}
          title={isCollapsed ? 'Expand Palette' : 'Collapse Palette'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4 text-[#00f0ff]" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <div className={cn('grid gap-2 w-full', isCollapsed ? 'grid-cols-6 lg:grid-cols-1' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-1')}>
        {paletteItems.map((item) => (
          <button
            key={item.type}
            onClick={() => onAddDevice(item.type)}
            className={cn(
              'flex items-center gap-2.5 p-2.5 rounded-2xl glass-panel border border-[#272732] hover:border-[#00f0ff]/50 hover:bg-[#00f0ff]/10 transition-all text-left group min-h-[44px]',
              isCollapsed && 'justify-center p-2'
            )}
            title={item.label}
          >
            <span className="shrink-0 group-hover:scale-110 transition-transform">{item.icon}</span>
            {!isCollapsed && (
              <span className="text-xs font-bold text-zinc-300 group-hover:text-white transition-colors truncate flex-1">
                {item.label}
              </span>
            )}
            {!isCollapsed && <Plus className="w-3.5 h-3.5 text-zinc-500 group-hover:text-[#00f0ff] shrink-0" />}
          </button>
        ))}
      </div>
    </div>
  );
};
