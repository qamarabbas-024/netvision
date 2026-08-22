'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Wrench, AlertTriangle, CheckCircle2, XCircle, RefreshCw, Network } from 'lucide-react';

export interface BreakFixScenarioCardProps {
  topicSlug: string;
  scenario?: {
    id: string;
    title: string;
    symptom: string;
    topologySummary: string;
    options: Array<{
      id: string;
      label: string;
      isCorrectFix: boolean;
      explanation: string;
    }>;
  };
}

export const BreakFixScenarioCard: React.FC<BreakFixScenarioCardProps> = ({
  topicSlug,
  scenario,
}) => {
  // Default fallbacks tailored per topic if custom scenario is not explicitly provided
  const activeScenario = scenario || {
    id: `breakfix-${topicSlug}`,
    title: `Troubleshooting Challenge: ${topicSlug.toUpperCase()} Network Outage`,
    symptom: `Host PC-A (192.168.1.50/24) cannot reach Gateway Router R1 or external web servers. Ping requests time out.`,
    topologySummary: `PC-A (192.168.1.50) ➔ Switch SW1 ➔ Router R1 (192.168.1.1)`,
    options: [
      {
        id: 'opt-1',
        label: 'Fix Gateway IP: Change PC-A default gateway from 192.168.1.254 to 192.168.1.1',
        isCorrectFix: true,
        explanation: 'Correct! PC-A was configured with invalid gateway IP 192.168.1.254. Changing it to 192.168.1.1 restores outbound Layer 3 routing.',
      },
      {
        id: 'opt-2',
        label: 'Replace Cat6 Ethernet cable on Switch SW1',
        isCorrectFix: false,
        explanation: 'Incorrect. The physical link LED is green and local loopback works; the cable is not physically broken.',
      },
      {
        id: 'opt-3',
        label: 'Flush DNS Cache on PC-A',
        isCorrectFix: false,
        explanation: 'Incorrect. Direct IP pinging to 192.168.1.1 fails before any DNS name resolution is attempted.',
      },
    ],
  };

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [resolved, setResolved] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);

  const selectedOpt = activeScenario.options.find((o) => o.id === selectedOptionId);

  const handleTestFix = () => {
    if (!selectedOpt) return;
    setAttempts((prev) => prev + 1);
    if (selectedOpt.isCorrectFix) {
      setResolved(true);
    }
  };

  const handleReset = () => {
    setSelectedOptionId(null);
    setResolved(false);
  };

  return (
    <Card className="p-6 glass-panel-glow border-[#00f0ff]/30 flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-[#272732] pb-4">
        <div className="flex items-center gap-2">
          <Badge variant="purple">STAGE 6: BREAK / FIX</Badge>
          <span className="text-xs font-mono text-zinc-400">Troubleshooting & Diagnostic Scenario</span>
        </div>

        {resolved && (
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Fault Resolved 100%
          </span>
        )}
      </div>

      {/* Symptom & Topology Banner */}
      <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          {activeScenario.title}
        </div>
        <p className="text-xs text-rose-200 leading-relaxed">{activeScenario.symptom}</p>

        <div className="p-3 rounded-xl bg-[#09090b] border border-rose-500/20 font-mono text-[11px] text-zinc-300 flex items-center gap-2">
          <Network className="w-4 h-4 text-purple-400 shrink-0" />
          <span className="text-zinc-400">Topology:</span> {activeScenario.topologySummary}
        </div>
      </div>

      {/* Diagnosis Fix Action Selection */}
      <div className="flex flex-col gap-3" role="radiogroup" aria-label="Diagnostic Fix Actions">
        <span className="text-xs font-mono font-bold text-zinc-300 flex items-center gap-1.5">
          <Wrench className="w-3.5 h-3.5 text-[#00f0ff]" /> Select Diagnostic Fix Action:
        </span>

        {activeScenario.options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          let borderClass = 'border-[#272732] bg-[#09090b] text-zinc-300 hover:border-zinc-500';

          if (isSelected) {
            borderClass = resolved && opt.isCorrectFix
              ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-bold'
              : 'border-[#00f0ff] bg-[#00f0ff]/10 text-[#00f0ff] font-bold shadow-glow-cyan';
          }

          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={opt.label}
              onClick={() => {
                if (!resolved) setSelectedOptionId(opt.id);
              }}
              className={`p-4 rounded-xl border text-left font-mono text-xs transition-all flex items-start gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00f0ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b] ${borderClass}`}
            >
              <div className={`w-4 h-4 rounded-full border mt-0.5 shrink-0 flex items-center justify-center ${isSelected ? 'border-[#00f0ff] bg-[#00f0ff]' : 'border-zinc-600'}`}>
                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
              </div>
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>

      {/* Action Footer & Verification Feedback */}
      <div className="flex flex-col gap-4 border-t border-[#272732] pt-4">
        {!resolved ? (
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-500">Attempts: {attempts}</span>
            <Button
              variant="cyan"
              disabled={!selectedOptionId}
              onClick={handleTestFix}
              leftIcon={<Wrench className="w-4 h-4" />}
            >
              Apply Diagnostic Fix
            </Button>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-200 leading-relaxed flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Troubleshooting Success!
              </span>
              <button onClick={handleReset} className="text-zinc-400 hover:text-white flex items-center gap-1 text-[11px]">
                <RefreshCw className="w-3.5 h-3.5" /> Replay Scenario
              </button>
            </div>
            <p>{selectedOpt?.explanation}</p>
          </div>
        )}

        {selectedOpt && !resolved && attempts > 0 && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-200 leading-relaxed flex items-start gap-2">
            <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-white mb-0.5">Diagnostic Evaluation:</span>
              {selectedOpt.explanation}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
