'use client';

import React from 'react';
import { NodeType } from '@/types';
import { RouterIcon, SwitchIcon, FirewallIcon, ServerIcon, PCIcon, CloudIcon } from '@/components/ui/Icons';
import { Radio } from 'lucide-react';

export interface DevicePaletteProps {
  onAddDevice: (type: NodeType) => void;
}

export const DevicePalette: React.FC<DevicePaletteProps> = ({ onAddDevice }) => {
  const paletteItems: { type: NodeType; label: string; icon: React.ReactNode }[] = [
    { type: 'pc', label: 'Client PC', icon: <PCIcon size={20} /> },
    { type: 'server', label: 'Server Node', icon: <ServerIcon size={20} /> },
    { type: 'router', label: 'Gateway Router', icon: <RouterIcon size={20} /> },
    { type: 'switch', label: 'L2 Switch', icon: <SwitchIcon size={20} /> },
    { type: 'firewall', label: 'Firewall ACL', icon: <FirewallIcon size={20} /> },
    { type: 'cloud', label: 'Internet Cloud', icon: <CloudIcon size={20} /> },
  ];

  return (
    <div className="glass-panel p-4 rounded-2xl border border-[#272732] flex flex-col gap-3 shrink-0 w-56">
      <h3 className="text-xs font-mono font-bold uppercase text-zinc-400 tracking-wider mb-1">
        Device Palette
      </h3>

      <div className="flex flex-col gap-2">
        {paletteItems.map((item) => (
          <button
            key={item.type}
            onClick={() => onAddDevice(item.type)}
            className="flex items-center gap-3 p-3 rounded-xl glass-panel border border-[#272732] hover:border-[#00f0ff]/40 hover:bg-white/5 transition-all text-left group"
          >
            {item.icon}
            <span className="text-xs font-bold text-zinc-300 group-hover:text-white transition-colors">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
