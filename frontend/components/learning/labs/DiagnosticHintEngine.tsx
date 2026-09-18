'use client';

import React, { useState } from 'react';
import type { SanitizedDiagnosticHintsDto, SanitizedDiagnosticHintItem } from '@netvision/shared';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  HelpCircle, 
  Lock, 
  Unlock, 
  Lightbulb, 
  Terminal, 
  Eye, 
  Search, 
  AlertCircle,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { unlockLabHintApi } from '@/lib/api';

export interface DiagnosticHintEngineProps {
  labId: string;
  sessionId?: string;
  hintsData?: SanitizedDiagnosticHintsDto;
  onHintUnlocked?: (newHints: SanitizedDiagnosticHintsDto) => void;
  className?: string;
}

export const DiagnosticHintEngine: React.FC<DiagnosticHintEngineProps> = ({
  labId,
  sessionId,
  hintsData,
  onHintUnlocked,
  className = '',
}) => {
  const [isUnlocking, setIsUnlocking] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const unlockedHints: SanitizedDiagnosticHintItem[] = hintsData?.unlockedHints || [];
  const currentUnlockedLevel = hintsData?.currentLevel || 0;
  const totalAvailableLevels = hintsData?.totalLevels || 4;

  const handleUnlock = async () => {
    setIsUnlocking(true);
    setErrorMsg(null);
    try {
      const res = await unlockLabHintApi(labId, sessionId);
      if (res && res.hints && onHintUnlocked) {
        onHintUnlocked(res.hints);
      }
    } catch (err: any) {
      console.error('Failed to unlock hint:', err);
      setErrorMsg(err?.message || 'Unable to unlock next hint. Please try again.');
    } finally {
      setIsUnlocking(false);
    }
  };

  const getLevelIcon = (level: number) => {
    switch (level) {
      case 1:
        return <Search className="w-4 h-4 text-blue-400" />;
      case 2:
        return <Terminal className="w-4 h-4 text-cyan-400" />;
      case 3:
        return <Eye className="w-4 h-4 text-purple-400" />;
      case 4:
        return <Lightbulb className="w-4 h-4 text-amber-400" />;
      default:
        return <HelpCircle className="w-4 h-4 text-zinc-400" />;
    }
  };

  const getLevelName = (level: number) => {
    switch (level) {
      case 1:
        return 'Subsystem Identification';
      case 2:
        return 'Diagnostic Command Recommendation';
      case 3:
        return 'Observation & Metric Analysis';
      case 4:
        return 'Fault Domain Isolation';
      default:
        return `Diagnostic Level ${level}`;
    }
  };

  return (
    <Card className={`glass-panel border-[#00f0ff]/20 p-4 sm:p-5 flex flex-col gap-4 ${className}`}>
      {/* 1. Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#272732] pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
              Progressive Diagnostic Hints
              <Badge variant="neutral" className="text-[10px] py-0 px-1.5 font-mono">
                {currentUnlockedLevel} of {totalAvailableLevels} Unlocked
              </Badge>
            </h3>
            <p className="text-[11px] text-zinc-400">
              Server-authoritative graduated assistance without giving away final solutions
            </p>
          </div>
        </div>

        {/* Lock / Unlock Button */}
        {currentUnlockedLevel < totalAvailableLevels ? (
          <Button
            variant="cyan"
            size="sm"
            onClick={handleUnlock}
            disabled={isUnlocking}
            leftIcon={<Unlock className="w-3.5 h-3.5" />}
          >
            {isUnlocking ? 'Unlocking...' : `Unlock Level ${currentUnlockedLevel + 1} Hint`}
          </Button>
        ) : (
          <Badge variant="amber" className="text-xs font-mono flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> All Diagnostic Hints Unlocked
          </Badge>
        )}
      </div>

      {errorMsg && (
        <div className="text-xs text-rose-400 bg-rose-950/30 border border-rose-800 p-2.5 rounded-lg font-mono">
          {errorMsg}
        </div>
      )}

      {/* 2. Hint Levels List */}
      <div className="flex flex-col gap-3">
        {/* Render each level from 1 to 4 */}
        {[1, 2, 3, 4].map((lvl) => {
          const unlocked = unlockedHints.find((h) => h.level === lvl);
          const isUnlocked = !!unlocked;
          const isNextToUnlock = lvl === currentUnlockedLevel + 1;

          if (isUnlocked && unlocked) {
            return (
              <div
                key={lvl}
                className="rounded-xl border border-[#272d42] bg-[#0c101d] p-3.5 flex flex-col gap-2 animate-in fade-in duration-300"
                role="region"
                aria-label={`Unlocked hint level ${lvl}: ${unlocked.title || getLevelName(lvl)}`}
              >
                <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-1.5">
                  <div className="flex items-center gap-2">
                    {getLevelIcon(lvl)}
                    <span className="font-mono text-xs font-bold text-white">
                      Level {lvl}: {unlocked.title || getLevelName(lvl)}
                    </span>
                  </div>
                  <Badge variant="cyan" className="text-[9px] py-0 px-1 font-mono">
                    UNLOCKED
                  </Badge>
                </div>

                <p className="text-xs text-zinc-200 leading-relaxed font-sans pl-6">
                  {unlocked.text}
                </p>
              </div>
            );
          }

          // Locked Level
          return (
            <div
              key={lvl}
              className={`rounded-xl border p-3 flex items-center justify-between transition-colors ${
                isNextToUnlock
                  ? 'bg-black/40 border-dashed border-cyan-500/40 text-zinc-400'
                  : 'bg-black/20 border-zinc-900 text-zinc-600'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-zinc-500" />
                <div>
                  <span className="font-mono text-xs font-semibold block">
                    Level {lvl}: {getLevelName(lvl)}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-sans">
                    {isNextToUnlock
                      ? 'Next available diagnostic tier. Click unlock above when stuck.'
                      : 'Locked. Must unlock previous diagnostic levels first.'}
                  </span>
                </div>
              </div>

              <Badge variant="neutral" className="text-[9px] py-0 px-1.5 font-mono text-zinc-500">
                LOCKED
              </Badge>
            </div>
          );
        })}
      </div>

      {/* 3. Screen Reader / Accessibility Summary */}
      <div className="text-[11px] font-mono text-zinc-500 bg-black/40 p-2.5 rounded-lg border border-zinc-800" aria-live="polite">
        Diagnostic Assistance Status: {currentUnlockedLevel} of {totalAvailableLevels} levels active. Solution details remain masked to preserve student inquiry.
      </div>
    </Card>
  );
};
