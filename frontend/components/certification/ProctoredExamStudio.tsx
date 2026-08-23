'use client';

import React, { useState, useEffect } from 'react';
import {
  Award,
  ShieldAlert,
  ShieldCheck,
  Camera,
  CheckCircle2,
  Lock,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  ProctoredExamEngine,
  ProctorViolation,
} from '@/lib/proctoredExamEngine';
import { SoundFx } from '@/lib/soundFx';

export const ProctoredExamStudio: React.FC = () => {
  const [examActive, setExamActive] = useState<boolean>(false);
  const [examSubmitted, setExamSubmitted] = useState<boolean>(false);
  const [integrityScore, setIntegrityScore] = useState<number>(100);
  const [violations, setViolations] = useState<ProctorViolation[]>([]);
  const [certHash, setCertHash] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: string]: number }>({});

  const sampleQuestions = [
    {
      id: 'q1',
      question: 'Which BGP EVPN Route Type is responsible for advertising MAC and IP binding across VTEP overlays?',
      options: ['EVPN Route Type 1 (Auto-Discovery)', 'EVPN Route Type 2 (MAC/IP Advertisement)', 'EVPN Route Type 5 (IP Prefix)', 'EVPN Route Type 3 (Inclusive Multicast)'],
      correct: 1,
    },
    {
      id: 'q2',
      question: 'What is the default UDP destination port used for VXLAN packet encapsulation across Layer-3 underlays?',
      options: ['UDP Port 53', 'UDP Port 4789', 'UDP Port 8080', 'UDP Port 67'],
      correct: 1,
    },
  ];

  // Tab switch / visibility monitor
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && examActive && !examSubmitted) {
        SoundFx.playPacketDrop();
        setIntegrityScore((prev) => Math.max(0, prev - 15));
        const newViol: ProctorViolation = {
          id: `v-${Date.now()}`,
          type: 'TAB_SWITCH',
          timestamp: new Date().toLocaleTimeString(),
          severity: 'CRITICAL',
          details: 'Candidate navigated away from proctored viewport window.',
        };
        setViolations((prev) => [newViol, ...prev]);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [examActive, examSubmitted]);

  const handleStartExam = () => {
    SoundFx.playTerminalKeyPress();
    setExamActive(true);
    setExamSubmitted(false);
    setIntegrityScore(100);
    setViolations([]);
    setCertHash(null);
    setSelectedAnswers({});
    SoundFx.playSuccessChime();
  };

  const handleSubmitExam = () => {
    SoundFx.playTerminalKeyPress();
    setExamSubmitted(true);
    const hash = ProctoredExamEngine.generateAuditHash('Alex Rivers', 'NV-NET-PRO', 92);
    setCertHash(hash);
    SoundFx.playSuccessChime();
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00f0ff]">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#00f0ff] font-bold uppercase tracking-wider">
                Version 4.9 AI Proctoring
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                Anti-Cheat Telemetry
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              High-Stakes Examination & Tamper-Proof Audit
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!examActive ? (
            <Button variant="primary" size="sm" onClick={handleStartExam} leftIcon={<Zap className="w-3.5 h-3.5" />}>
              Start Proctored Exam
            </Button>
          ) : !examSubmitted ? (
            <Button variant="primary" size="sm" onClick={handleSubmitExam} leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />}>
              Submit for Certification
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={handleStartExam}>
              Retake Examination
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid: Exam Questions (Left) & Proctoring Telemetry + Webcam (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 7 Cols: Examination Questions */}
        <div className="lg:col-span-7 p-6 flex flex-col gap-5 bg-[#0c0e17]">
          {!examActive ? (
            <div className="p-8 text-center flex flex-col items-center gap-3">
              <Lock className="w-10 h-10 text-cyan-400 opacity-60" />
              <h3 className="text-base font-bold text-white">Proctored Certification Environment Locked</h3>
              <p className="text-xs text-zinc-400 max-w-md">
                Click "Start Proctored Exam" to initialize AI facial tracking and browser focus telemetry.
              </p>
            </div>
          ) : !examSubmitted ? (
            <div className="space-y-5">
              {sampleQuestions.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-2xl bg-[#121522] border border-[#262c42] space-y-3">
                  <span className="text-xs font-bold text-white block">
                    Question {idx + 1}: {q.question}
                  </span>
                  <div className="space-y-2">
                    {q.options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        onClick={() => {
                          SoundFx.playTerminalKeyPress();
                          setSelectedAnswers({ ...selectedAnswers, [q.id]: oIdx });
                        }}
                        className={`w-full p-2.5 rounded-xl border text-left text-xs font-mono transition-all ${
                          selectedAnswers[q.id] === oIdx
                            ? 'border-[#00f0ff] bg-cyan-950/30 text-white font-bold'
                            : 'border-[#262c42] bg-[#0f111a] text-zinc-300 hover:border-zinc-600'
                        }`}
                      >
                        {String.fromCharCode(65 + oIdx)}. {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 flex flex-col items-center text-center gap-3 animate-in fade-in">
              <CheckCircle2 className="w-12 h-12 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">Certification Assessment Passed (Score: 92%)</h3>
              <p className="text-xs text-zinc-300">
                Integrity Score: <span className="font-bold text-emerald-400">{integrityScore}%</span> (Verified by NetVision AI Proctor)
              </p>
              {certHash && (
                <div className="p-3 rounded-xl bg-black/60 border border-emerald-500/30 font-mono text-[11px] text-emerald-400 break-all">
                  Cryptographic Audit Signature: {certHash}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right 5 Cols: AI Proctor Webcam & Integrity Feed */}
        <div className="lg:col-span-5 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-[#00f0ff]" /> AI Proctoring Neural Feed
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
              Gaze Mesh Locked
            </span>
          </div>

          {/* Simulated Webcam Mesh View */}
          <div className="p-4 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col items-center justify-center relative min-h-[160px] overflow-hidden">
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#00f0ff]/60 flex items-center justify-center relative animate-pulse">
              <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-[#00f0ff] flex items-center justify-center text-[#00f0ff]">
                <Camera className="w-8 h-8 opacity-80" />
              </div>
            </div>
            <span className="text-[10px] font-mono text-zinc-400 mt-2">
              Candidate Verified: Alex Rivers (ID: #NV-8821)
            </span>
          </div>

          {/* Integrity Score Meter */}
          <div className="p-3 rounded-2xl bg-[#121522] border border-[#262c42] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="text-xs font-bold text-white">Integrity Score</div>
                <div className="text-[10px] text-zinc-400">Anti-Cheating Telemetry</div>
              </div>
            </div>
            <span className="text-xl font-bold font-mono text-emerald-400">{integrityScore}%</span>
          </div>

          {/* Violation Stream */}
          <div className="space-y-1.5 max-h-[140px] overflow-y-auto">
            <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold block">
              Audit Event Log
            </span>
            {violations.length === 0 ? (
              <div className="text-[11px] font-mono text-zinc-500">Zero infractions recorded. Clean session.</div>
            ) : (
              violations.map((v) => (
                <div key={v.id} className="p-2 rounded-xl bg-rose-950/30 border border-rose-500/30 text-[10px] font-mono text-rose-300 flex items-center gap-2">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>[{v.timestamp}] {v.details}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
