'use client';

import React, { useState } from 'react';
import { NodeType } from '@/types';
import { RouterIcon, SwitchIcon, FirewallIcon, ServerIcon, PCIcon, CloudIcon, DNSIcon, LaptopIcon, DHCPIcon, AccessPointIcon } from '@/components/ui/Icons';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DevicePaletteProps {
  onAddDevice: (type: NodeType) => void;
}

export const DevicePalette: React.FC<DevicePaletteProps> = ({ onAddDevice }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const paletteItems: { type: NodeType; label: string; icon: React.ReactNode }[] = [
    { type: 'pc', label: 'Desktop PC', icon: <PCIcon size={18} /> },
    { type: 'laptop', label: 'Laptop Client', icon: <LaptopIcon size={18} /> },
    { type: 'switch', label: 'L2 Switch', icon: <SwitchIcon size={18} /> },
    { type: 'router', label: 'Gateway Router', icon: <RouterIcon size={18} /> },
    { type: 'firewall', label: 'Firewall ACL', icon: <FirewallIcon size={18} /> },
    { type: 'server', label: 'Web Server', icon: <ServerIcon size={18} /> },
    { type: 'dns', label: 'DNS Server', icon: <DNSIcon size={18} /> },
    { type: 'dhcp', label: 'DHCP Server', icon: <DHCPIcon size={18} /> },
    { type: 'ap', label: 'Access Point', icon: <AccessPointIcon size={18} /> },
    { type: 'cloud', label: 'Internet WAN', icon: <CloudIcon size={18} /> },
  ];

  return (
    <div
      className={cn(
        'surface-2 p-3.5 rounded-xl border border-[#2a2e39] flex flex-col gap-3 shrink-0 transition-all duration-300 shadow-instrument font-sans',
        isCollapsed ? 'w-full lg:w-16 items-center' : 'w-full lg:w-60'
      )}
    >
      <div className="flex items-center justify-between w-full border-b border-[#2a2e39] pb-2">
        {!isCollapsed && (
          <h3 className="text-xs font-mono font-bold uppercase text-[#8e95a5] tracking-wider">
            DEVICE PALETTE
          </h3>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            'p-1.5 rounded-lg bg-[#14151a] hover:bg-[#1b1e26] text-[#8e95a5] hover:text-[#f4f5f7] transition-colors border border-[#2a2e39] shrink-0',
            isCollapsed && 'mx-auto'
          )}
          title={isCollapsed ? 'Expand Palette' : 'Collapse Palette'}
          aria-label={isCollapsed ? 'Expand Palette' : 'Collapse Palette'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4 text-[#38bdf8]" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <div className={cn('grid gap-2 w-full', isCollapsed ? 'grid-cols-6 lg:grid-cols-1' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-1')}>
        {paletteItems.map((item) => (
          <button
            key={item.type}
            onClick={() => onAddDevice(item.type)}
            className={cn(
              'p-2.5 rounded-lg bg-[#14151a] hover:bg-[#1f222c] border border-[#2a2e39] hover:border-[#38bdf8]/40 text-xs font-semibold text-[#f4f5f7] transition-all flex items-center justify-between group cursor-pointer shadow-subtle',
              isCollapsed && 'justify-center p-2'
            )}
            title={`Add ${item.label}`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-[#38bdf8] group-hover:scale-110 transition-transform">
                {item.icon}
              </span>
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </div>

            {!isCollapsed && (
              <Plus className="w-3.5 h-3.5 text-[#646c7d] group-hover:text-[#38bdf8] transition-colors shrink-0" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
