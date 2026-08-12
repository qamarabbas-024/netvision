'use client';

import React, { useState } from 'react';
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
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Wrench,
} from 'lucide-react';

export interface SimulationEventLogProps {
  events: SimulationEvent[];
  onClearEvents?: () => void;
}

export const SimulationEventLog: React.FC<SimulationEventLogProps> = ({
  events,
  onClearEvents,
}) => {
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

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
    <div className="glass-panel p-4 sm:p-5 rounded-3xl border border-[#272732] flex flex-col gap-4 max-h-[420px] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#272732] pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#00f0ff]" />
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            Protocol Event Lifecycle & Pedagogical Stream
          </h3>
        </div>

        {onClearEvents && events.length > 0 && (
          <button
            onClick={onClearEvents}
            className="text-zinc-500 hover:text-white transition-colors p-1 flex items-center gap-1 text-[11px] font-mono"
            title="Clear Log History"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear History
          </button>
        )}
      </div>

      {/* Events Stream */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
        {events.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-500 font-mono flex flex-col items-center gap-2">
            <Layers className="w-6 h-6 text-zinc-600" />
            <span>
              No simulation events dispatched yet. Click "Play" or "Dispatch" to observe protocol behavior.
            </span>
          </div>
        ) : (
          events.map((evt) => {
            const isExpanded = expandedEventId === evt.id;

            return (
              <div
                key={evt.id}
                className={`p-3.5 rounded-2xl border text-xs flex flex-col gap-2 transition-all ${
                  evt.type === 'error'
                    ? 'bg-rose-500/10 border-rose-500/30'
                    : evt.type === 'warning'
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : evt.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                {/* Event Summary Bar */}
                <div
                  className="flex items-center justify-between gap-2 cursor-pointer select-none"
                  onClick={() => setExpandedEventId(isExpanded ? null : evt.id)}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {getEventIcon(evt.type)}
                    <span className="font-bold text-white truncate">{evt.eventTitle}</span>
                    {evt.packetProtocol && (
                      <Badge variant="cyan" className="text-[9px] py-0 px-1.5 font-mono">
                        {evt.packetProtocol}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono text-zinc-500">{evt.timestamp}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5 text-zinc-400" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                    )}
                  </div>
                </div>

                <p className="text-zinc-300 text-[11px] leading-relaxed">{evt.explanation}</p>

                {/* Node Label */}
                {evt.nodeName && (
                  <span className="text-[10px] font-mono text-zinc-400 font-semibold flex items-center gap-1">
                    <span className="text-[#00f0ff]">Node:</span> {evt.nodeName}
                  </span>
                )}

                {/* Progressive Educational Details Collapsible */}
                {isExpanded && (
                  <div className="mt-2 pt-2 border-t border-white/10 flex flex-col gap-2 text-[11px] font-mono">
                    {evt.why && (
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
                        <span className="text-[#00f0ff] font-bold block flex items-center gap-1 uppercase text-[9px]">
                          <HelpCircle className="w-3 h-3 text-[#00f0ff]" /> Educational Rationale (WHY):
                        </span>
                        <span className="text-zinc-300 leading-normal">{evt.why}</span>
                      </div>
                    )}

                    {evt.technical && (
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
                        <span className="text-purple-400 font-bold block uppercase text-[9px]">
                          Technical Specification (RFC Detail):
                        </span>
                        <span className="text-zinc-300 leading-normal">{evt.technical}</span>
                      </div>
                    )}

                    {evt.type === 'error' && (
                      <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-0.5">
                        <span className="text-rose-400 font-bold block flex items-center gap-1 uppercase text-[9px]">
                          <Wrench className="w-3 h-3 text-rose-400" /> Diagnostic & Troubleshooting Guidance:
                        </span>
                        <span className="text-rose-200 leading-normal">
                          Inspect IP subnets, routing tables, and firewall ACL port rules to resolve connection state failures.
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
