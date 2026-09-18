'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, XCircle, ShieldCheck, Loader2 } from 'lucide-react';

export interface ValidationProps {
  isValidating: boolean;
  onValidate: () => void;
  result?: {
    passed: boolean;
    score: number;
    checks: Array<{ rule: string; passed: boolean; message: string }>;
    completionSummary: string;
  } | null;
}

export const Validation: React.FC<ValidationProps> = ({
  isValidating,
  onValidate,
  result,
}) => {
  return (
    <Card className="p-5 glass-panel-glow border-[#00f0ff]/30 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="cyan">LAB VALIDATION</Badge>
          <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00f0ff]" /> Automated Target Verification
          </span>
        </div>

        <Button
          variant="cyan"
          onClick={onValidate}
          disabled={isValidating}
          rightIcon={isValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
        >
          {isValidating ? 'Validating Telemetry...' : 'Validate Lab Submission'}
        </Button>
      </div>

      {result && (
        <div className={`p-4 rounded-2xl border flex flex-col gap-3 ${result.passed ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                result.passed
                  ? 'bg-emerald-950 border border-emerald-600 text-emerald-300'
                  : 'bg-rose-950 border border-rose-600 text-rose-300'
              }`}>
                {result.passed ? 'PASS' : 'FAIL'}
              </span>
              {result.completionSummary}
            </span>
            <span className="text-sm font-mono font-bold text-white">{result.score}% Score</span>
          </div>

          <div className="flex flex-col gap-1.5 pt-2 border-t border-white/10">
            {result.checks.map((chk, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs text-zinc-300">
                <span className="flex items-center gap-2">
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider ${
                    chk.passed
                      ? 'bg-emerald-950/80 border border-emerald-700 text-emerald-300'
                      : 'bg-rose-950/80 border border-rose-700 text-rose-300'
                  }`}>
                    {chk.passed ? 'PASS' : 'FAIL'}
                  </span>
                  {chk.rule}
                </span>
                <span className="text-zinc-400 font-mono text-[11px]">{chk.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
