'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export interface TechnicalDataCardProps {
  title: string;
  value: string;
  type?: 'ip' | 'mac' | 'port' | 'header' | 'protocol';
  description?: string;
}

export const TechnicalDataCard: React.FC<TechnicalDataCardProps> = ({
  title,
  value,
  type = 'protocol',
  description,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTypeBadge = () => {
    switch (type) {
      case 'ip':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30">IPv4 / IPv6</span>;
      case 'mac':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">MAC Address</span>;
      case 'port':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">L4 Port</span>;
      case 'header':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Packet Field</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">Protocol Data</span>;
    }
  };

  return (
    <div className="p-4 rounded-2xl glass-panel border border-[#272732] hover:border-[#00f0ff]/40 transition-all flex flex-col gap-2 relative group my-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {getTypeBadge()}
          <span className="text-xs font-bold text-white">{title}</span>
        </div>

        <button
          onClick={handleCopy}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors flex items-center gap-1 text-[11px]"
          title="Copy value"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-bold">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="p-3 rounded-xl bg-[#09090b] border border-[#272732] font-mono text-sm text-[#00f0ff] font-extrabold tracking-wide break-all">
        {value}
      </div>

      {description && <p className="text-[11px] text-zinc-400 leading-relaxed mt-0.5">{description}</p>}
    </div>
  );
};
