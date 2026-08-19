import React from 'react';
import { Cpu, Server, Monitor, Shield, Cloud, Globe, Radio, Database, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NetworkIconProps {
  className?: string;
  size?: number;
}

export const RouterIcon: React.FC<NetworkIconProps> = ({ className, size = 20 }) => (
  <div className={cn('p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 inline-flex items-center justify-center shadow-glow-cyan', className)}>
    <Radio size={size} />
  </div>
);

export const SwitchIcon: React.FC<NetworkIconProps> = ({ className, size = 20 }) => (
  <div className={cn('p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 inline-flex items-center justify-center shadow-glow-blue', className)}>
    <Cpu size={size} />
  </div>
);

export const FirewallIcon: React.FC<NetworkIconProps> = ({ className, size = 20 }) => (
  <div className={cn('p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 inline-flex items-center justify-center', className)}>
    <Shield size={size} />
  </div>
);

export const ServerIcon: React.FC<NetworkIconProps> = ({ className, size = 20 }) => (
  <div className={cn('p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 inline-flex items-center justify-center shadow-glow-purple', className)}>
    <Server size={size} />
  </div>
);

export const PCIcon: React.FC<NetworkIconProps> = ({ className, size = 20 }) => (
  <div className={cn('p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 inline-flex items-center justify-center', className)}>
    <Monitor size={size} />
  </div>
);

export const CloudIcon: React.FC<NetworkIconProps> = ({ className, size = 20 }) => (
  <div className={cn('p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 inline-flex items-center justify-center', className)}>
    <Cloud size={size} />
  </div>
);

export const DNSIcon: React.FC<NetworkIconProps> = ({ className, size = 20 }) => (
  <div className={cn('p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 inline-flex items-center justify-center', className)}>
    <Database size={size} />
  </div>
);

export const LaptopIcon: React.FC<NetworkIconProps> = ({ className, size = 20 }) => (
  <div className={cn('p-2 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 inline-flex items-center justify-center', className)}>
    <Monitor size={size} />
  </div>
);

export const DHCPIcon: React.FC<NetworkIconProps> = ({ className, size = 20 }) => (
  <div className={cn('p-2 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 inline-flex items-center justify-center', className)}>
    <Server size={size} />
  </div>
);

export const AccessPointIcon: React.FC<NetworkIconProps> = ({ className, size = 20 }) => (
  <div className={cn('p-2 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 inline-flex items-center justify-center', className)}>
    <Radio size={size} />
  </div>
);

export const PacketIcon: React.FC<NetworkIconProps> = ({ className, size = 20 }) => (
  <div className={cn('p-2 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] inline-flex items-center justify-center shadow-glow-cyan animate-pulse', className)}>
    <Activity size={size} />
  </div>
);
