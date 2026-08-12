'use client';

import React from 'react';
import { SimulationEvent } from '@/types';
import { Badge } from '@/components/ui/Badge';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Trash2,
  Layers,
} from 'lucide-react';

export interface SimulationEventLogProps {
  events: SimulationEvent[];
  onClearEvents?: () => void;
}

export const SimulationEventLog: React.FC<SimulationEventLogProps> = ({
  events,
  onClearEvents,
}) => {
  const getEventIcon = (type: SimulationEvent['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-rose-400 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-[#00f0ff] shrink-0" />;
    }
  };

  return (
    <div className="glass-panel p-4 sm:p-5 rounded-3xl border border-[#272732] flex flex-col gap-4 max-h-[380px] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#272732] pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#00f0ff]" />
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            Live Protocol Lifecycle Event Log
          </h3>
        </div>

        {onClearEvents && events.length > 0 && (
          <button
            onClick={onClearEvents}
            className="text-zinc-500 hover:text-white transition-colors p-1 flex items-center gap-1 text-[11px] font-mono"
            title="Clear Log History"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Log
          </button>
        )}
      </div>

      {/* Events Stream */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
        {events.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-500 font-mono flex flex-col items-center gap-2">
            <Layers className="w-6 h-6 text-zinc-600" />
            <span>No simulation events dispatched yet. Click "Play" or "Dispatch" to observe protocol behavior.</span>
          </div>
        ) : (
          events.map((evt) => (
            <div
              key={evt.id}
              className={`p-3 rounded-2xl border text-xs flex flex-col gap-1.5 transition-all ${
                evt.type === 'error'
                  ? 'bg-rose-500/10 border-rose-500/30'
                  : evt.type === 'warning'
                  ? 'bg-amber-500/10 border-amber-500/30'
                  : evt.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  {getEventIcon(evt.type)}
                  <span className="font-bold text-white truncate">{evt.eventTitle}</span>
                  {evt.packetProtocol && (
                    <Badge variant="cyan" className="text-[9px] py-0 px-1.5 font-mono">
                      {evt.packetProtocol}
                    </Badge>
                  )}
                </div>
                <span className="text-[10px] font-mono text-zinc-500 shrink-0">
                  {evt.timestamp}
                </span>
              </div>

              <p className="text-zinc-300 text-[11px] leading-relaxed">{evt.explanation}</p>

              {evt.nodeName && (
                <span className="text-[10px] font-mono text-zinc-400 font-semibold flex items-center gap-1">
                  <span className="text-[#00f0ff]">Node:</span> {evt.nodeName}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
