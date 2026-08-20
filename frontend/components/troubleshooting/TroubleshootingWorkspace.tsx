'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Terminal,
  Search,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Sparkles,
  Award,
  Layers,
  ChevronRight,
  Info,
  Clock,
  ArrowRight,
  Flame,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  startTroubleshootingSessionApi,
  executeTroubleshootingCommandApi,
  submitTroubleshootingDiagnosisApi,
  applyTroubleshootingRemediationApi,
  runTroubleshootingVerificationApi,
  getTroubleshootingPostMortemApi,
} from '@/lib/api';

export interface TroubleshootingWorkspaceProps {
  scenario: any;
}

export const TroubleshootingWorkspace: React.FC<TroubleshootingWorkspaceProps> = ({ scenario }) => {
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cliInput, setCliInput] = useState<string>('');
  const [commandHistory, setCommandHistory] = useState<Array<{ command: string; output: string; timestamp: string }>>([]);
  const [isExecutingCmd, setIsExecutingCmd] = useState<boolean>(false);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<string>('');
  const [diagnosisFeedback, setDiagnosisFeedback] = useState<{ isCorrect?: boolean; feedback?: string } | null>(null);
  const [isSubmittingDiagnosis, setIsSubmittingDiagnosis] = useState<boolean>(false);
  const [selectedRemediation, setSelectedRemediation] = useState<string>('');
  const [remediationFeedback, setRemediationFeedback] = useState<{ isCorrect?: boolean; feedback?: string } | null>(null);
  const [isApplyingRemediation, setIsApplyingRemediation] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [postMortemData, setPostMortemData] = useState<any>(null);
  const [unlockedEvidenceList, setUnlockedEvidenceList] = useState<any[]>([]);

  // Initialize session on mount
  useEffect(() => {
    initSession();
  }, [scenario.id]);

  const initSession = async () => {
    setIsLoading(true);
    try {
      const res = await startTroubleshootingSessionApi(scenario.id || scenario.slug);
      setSession(res);
      setCommandHistory(res.executedCommands || []);
      setUnlockedEvidenceList([]);
      setDiagnosisFeedback(null);
      setRemediationFeedback(null);
      setVerificationResult(null);
      setPostMortemData(null);
      setSelectedDiagnosis('');
      setSelectedRemediation('');
    } catch (err) {
      console.error('Failed to initialize session:', err);
      // Fallback client session for offline demo
      setSession({
        sessionId: 'client-offline-sess',
        scenarioId: scenario.id,
        scenarioSlug: scenario.slug,
        currentStage: 'INCIDENT',
        discoveredEvidenceIds: [],
        scoreBreakdown: { totalScore: 0 },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunCommand = async (cmdToRun?: string) => {
    const cmd = (cmdToRun || cliInput).trim();
    if (!cmd || isExecutingCmd || !session) return;

    setIsExecutingCmd(true);
    try {
      const res = await executeTroubleshootingCommandApi(session.sessionId, scenario.id, cmd);
      setSession(res.session);
      setCommandHistory((prev) => [
        ...prev,
        { command: cmd, output: res.commandOutput, timestamp: new Date().toLocaleTimeString() },
      ]);
      if (res.newEvidenceUnlocked) {
        setUnlockedEvidenceList((prev) => {
          if (prev.some((e) => e.id === res.newEvidenceUnlocked.id)) return prev;
          return [...prev, res.newEvidenceUnlocked];
        });
      }
      setCliInput('');
    } catch (err) {
      console.error('Command execution error:', err);
      // Client-side fallback matching
      const matched = scenario.allowedCommands?.find((c: any) => c.command.toLowerCase() === cmd.toLowerCase());
      const out = matched ? matched.brokenOutput : `Executed '${cmd}'. 0 packets dropped.`;
      setCommandHistory((prev) => [
        ...prev,
        { command: cmd, output: out, timestamp: new Date().toLocaleTimeString() },
      ]);
      setCliInput('');
    } finally {
      setIsExecutingCmd(false);
    }
  };

  const handleSubmitDiagnosis = async () => {
    if (!selectedDiagnosis || !session || isSubmittingDiagnosis) return;
    setIsSubmittingDiagnosis(true);
    try {
      const res = await submitTroubleshootingDiagnosisApi(session.sessionId, scenario.id, selectedDiagnosis);
      setSession(res.session);
      setDiagnosisFeedback({ isCorrect: res.isCorrect, feedback: res.feedback });
    } catch (err: any) {
      console.error('Diagnosis error:', err);
      setDiagnosisFeedback({ isCorrect: false, feedback: 'Error validating diagnosis. Please check network connection.' });
    } finally {
      setIsSubmittingDiagnosis(false);
    }
  };

  const handleApplyRemediation = async () => {
    if (!selectedRemediation || !session || isApplyingRemediation) return;
    setIsApplyingRemediation(true);
    try {
      const res = await applyTroubleshootingRemediationApi(session.sessionId, scenario.id, selectedRemediation);
      setSession(res.session);
      setRemediationFeedback({ isCorrect: res.isCorrect, feedback: res.feedback });
    } catch (err: any) {
      console.error('Remediation error:', err);
      setRemediationFeedback({ isCorrect: false, feedback: 'Error applying remediation.' });
    } finally {
      setIsApplyingRemediation(false);
    }
  };

  const handleRunVerification = async () => {
    if (!session || isVerifying) return;
    setIsVerifying(true);
    try {
      const res = await runTroubleshootingVerificationApi(session.sessionId, scenario.id);
      setSession(res.session);
      setVerificationResult(res);
      // Load post-mortem analysis
      const pm = await getTroubleshootingPostMortemApi(scenario.slug || scenario.id);
      setPostMortemData(pm);
    } catch (err: any) {
      console.error('Verification error:', err);
      // Client fallback
      setVerificationResult({
        passed: true,
        score: 95,
        testResults: [
          { testId: 't1', testName: 'Service Health Check', passed: true, output: 'Service restored successfully.' },
        ],
        postMortemSummary: scenario.postMortem?.summary || 'Fault remediated successfully.',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const stageOrder = ['INCIDENT', 'INVESTIGATION', 'DIAGNOSIS', 'REMEDIATION', 'VERIFICATION', 'COMPLETED'];
  const currentStageIndex = stageOrder.indexOf(session?.currentStage || 'INCIDENT');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-16">
        <div className="flex flex-col items-center gap-3 text-zinc-400">
          <div className="w-8 h-8 border-2 border-[#00f0ff] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono">Initializing Virtual Topology Sandbox...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      {/* 1. Incident Briefing Header */}
      <div className="glass-panel p-6 rounded-3xl border border-[#272732] flex flex-col gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-rose-500/10 via-transparent to-transparent pointer-events-none rounded-full blur-3xl" />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Badge variant="rose" className="flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" /> Broken Network Incident
            </Badge>
            <Badge variant="cyan">{scenario.category}</Badge>
            <Badge variant={scenario.difficulty === 'ADVANCED' ? 'purple' : 'neutral'}>
              {scenario.difficulty}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#00f0ff]" /> {scenario.estimatedMinutes} Mins
            </span>
            <Button variant="ghost" size="sm" onClick={initSession} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
              Reset Incident
            </Button>
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {scenario.title}
          </h1>
          <p className="text-sm text-zinc-300 mt-2 leading-relaxed">
            {scenario.incidentDescription}
          </p>
        </div>

        {/* Concept Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#272732]/60">
          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Concepts Involved:</span>
          {scenario.networkingConcepts?.map((c: string, idx: number) => (
            <span
              key={idx}
              className="text-[11px] font-mono px-2.5 py-0.5 rounded-lg bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/20 font-medium"
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* 2. Interactive 6-Stage Workflow Progress Stepper */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {stageOrder.map((st, idx) => {
          const isDone = currentStageIndex > idx || session?.passed;
          const isCurrent = currentStageIndex === idx && !session?.passed;
          const stageLabels: Record<string, string> = {
            INCIDENT: '1. Incident',
            INVESTIGATION: '2. Evidence',
            DIAGNOSIS: '3. Diagnosis',
            REMEDIATION: '4. Fix',
            VERIFICATION: '5. Verify',
            COMPLETED: '6. Post-Mortem',
          };
          return (
            <div
              key={st}
              className={`p-3 rounded-lg border text-center transition-all flex flex-col items-center justify-center gap-1 font-mono ${
                isCurrent
                  ? 'bg-[#14151a] border-[#38bdf8] text-[#38bdf8] font-bold shadow-inner'
                  : isDone
                  ? 'bg-[#10b981]/10 border-[#10b981]/30 text-[#10b981]'
                  : 'bg-[#14151a] border-[#2a2e39] text-[#646c7d]'
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {stageLabels[st]}
              </span>
              <span className="text-[11px] font-semibold font-sans">
                {isDone ? '✓ Completed' : isCurrent ? 'Active Stage' : 'Pending'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Main Multi-Pane Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Topology Context & Evidence Locker (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Topology Preview Card */}
          <Card className="p-5 flex flex-col gap-4 border border-[#2a2e39] surface-2 rounded-xl shadow-instrument">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#f4f5f7] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#38bdf8]" /> Network Topology Context
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#14151a] border border-[#2a2e39] text-[#8e95a5]">
                {scenario.topology?.nodes?.length || 0} Nodes Active
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-[#14151a] border border-[#2a2e39] flex flex-col gap-2.5">
              {scenario.topology?.nodes?.map((node: any) => (
                <div
                  key={node.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-[#1b1e26] border border-[#2a2e39]"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        node.status === 'degraded'
                          ? 'bg-[#ef4444] animate-pulse'
                          : node.status === 'offline'
                          ? 'bg-[#646c7d]'
                          : 'bg-[#10b981]'
                      }`}
                    />
                    <div>
                      <span className="text-xs font-bold text-[#f4f5f7] block">{node.name}</span>
                      <span className="text-[10px] font-mono text-[#8e95a5] uppercase">{node.type}</span>
                    </div>
                  </div>

                  {node.ipAddress && (
                    <span className="text-[11px] font-mono text-[#38bdf8] bg-[#14151a] border border-[#2a2e39] px-2 py-0.5 rounded">
                      {node.ipAddress}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Reported Symptoms List */}
            <div>
              <span className="text-[11px] font-mono text-[#f87171] font-bold uppercase tracking-wider block mb-2">
                Reported Incident Symptoms:
              </span>
              <ul className="flex flex-col gap-1.5">
                {scenario.initialSymptoms?.map((sym: string, idx: number) => (
                  <li
                    key={idx}
                    className="text-xs text-[#c4c9d4] flex items-start gap-2 bg-[#ef4444]/5 p-2 rounded-lg border border-[#ef4444]/15"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-[#ef4444] shrink-0 mt-0.5" />
                    <span>{sym}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          {/* Evidence Locker Card */}
          <Card className="p-5 flex flex-col gap-4 border border-[#2a2e39] surface-2 rounded-xl shadow-instrument">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#f4f5f7] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#818cf8]" /> Evidence Locker
              </h3>
              <Badge variant="purple">
                {unlockedEvidenceList.length} / {scenario.evidenceItems?.length || 0} Discovered
              </Badge>
            </div>

            {unlockedEvidenceList.length === 0 ? (
              <div className="p-6 rounded-lg border border-dashed border-[#2a2e39] text-center flex flex-col items-center gap-2 text-[#646c7d]">
                <Search className="w-5 h-5" />
                <span className="text-xs text-[#8e95a5]">No evidence discovered yet.</span>
                <span className="text-[11px] text-[#646c7d]">
                  Run diagnostic CLI commands on the terminal to uncover technical clues.
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {unlockedEvidenceList.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3 rounded-lg bg-[#818cf8]/10 border border-[#818cf8]/20 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#f4f5f7]">{ev.title}</span>
                      <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-[#818cf8]/20 text-[#a5b4fc]">
                        {ev.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8e95a5]">{ev.description}</p>
                    <pre className="p-2 rounded-md bg-[#14151a] font-mono text-[10px] text-[#38bdf8] overflow-x-auto whitespace-pre-wrap border border-[#2a2e39]">
                      {ev.data}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Interactive Diagnostic Console & Stages (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Diagnostic CLI Terminal */}
          <Card className="p-5 flex flex-col gap-4 border border-[#2a2e39] surface-3 rounded-xl shadow-instrument">
            <div className="flex items-center justify-between border-b border-[#242731] pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#38bdf8]" />
                <h3 className="text-sm font-bold text-[#f4f5f7]">Investigation CLI Terminal</h3>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
                <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                <span className="w-2 h-2 rounded-full bg-[#10b981]" />
              </div>
            </div>

            {/* Quick Diagnostic Command Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono text-[#646c7d]">Allowed Commands:</span>
              {scenario.allowedCommands?.map((cmdObj: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => handleRunCommand(cmdObj.command)}
                  disabled={isExecutingCmd}
                  className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-[#1b1e26] hover:bg-[#2563eb]/20 hover:text-[#38bdf8] text-[#8e95a5] border border-[#2a2e39] transition-all cursor-pointer"
                >
                  $ {cmdObj.command}
                </button>
              ))}
            </div>

            {/* Terminal Output Screen */}
            <div className="h-64 rounded-lg bg-[#101115] p-4 font-mono text-xs text-[#e2e4e9] overflow-y-auto flex flex-col gap-3 border border-[#242731]">
              <div className="text-[#646c7d] text-[11px]">
                NetVision Incident Diagnostic Shell [Version 1.0.0]
                <br />
                Connected to virtual topology node. Type commands below to gather telemetry.
              </div>

              {commandHistory.map((entry, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <div className="text-[#38bdf8] flex items-center gap-2">
                    <span>netvision@incident:~$</span>
                    <span className="text-white font-bold">{entry.command}</span>
                    <span className="text-[9px] text-[#646c7d] ml-auto">{entry.timestamp}</span>
                  </div>
                  <pre className="text-[#34d399] font-mono text-[11px] whitespace-pre-wrap pl-2 border-l border-[#242731]">
                    {entry.output}
                  </pre>
                </div>
              ))}
            </div>

            {/* CLI Input Bar */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={cliInput}
                onChange={(e) => setCliInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRunCommand();
                }}
                placeholder="Type diagnostic command (e.g. ping, nslookup, ipconfig, show...)"
                className="flex-1 bg-[#101115] border border-[#242731] rounded-lg px-3.5 py-2 text-xs font-mono text-[#f4f5f7] focus:outline-none focus:border-[#38bdf8]"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleRunCommand()}
                disabled={isExecutingCmd || !cliInput.trim()}
                leftIcon={<Play className="w-3.5 h-3.5" />}
              >
                Execute
              </Button>
            </div>
          </Card>

          {/* Stage 3: Root Cause Diagnosis Selection */}
          <Card className="p-5 flex flex-col gap-4 border-[#272732]">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-400" /> Stage 3: Formulate Root Cause Diagnosis
              </h3>
              {session?.diagnosisCorrect && <Badge variant="emerald">Diagnosis Confirmed ✓</Badge>}
            </div>

            <p className="text-xs text-zinc-400">
              Based on the telemetry and discovered evidence, identify the exact technical root cause of the incident.
              Blind guessing incurs penalty deductions.
            </p>

            <div className="flex flex-col gap-2.5">
              {scenario.rootCauseOptions?.map((opt: any) => (
                <label
                  key={opt.id}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                    selectedDiagnosis === opt.id
                      ? 'bg-rose-500/10 border-rose-500 text-white'
                      : 'bg-zinc-900/40 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="diagnosis"
                    value={opt.id}
                    checked={selectedDiagnosis === opt.id}
                    onChange={() => setSelectedDiagnosis(opt.id)}
                    disabled={session?.diagnosisCorrect}
                    className="mt-1"
                  />
                  <span className="text-xs leading-relaxed">{opt.description}</span>
                </label>
              ))}
            </div>

            {diagnosisFeedback && (
              <div
                className={`p-3.5 rounded-2xl text-xs flex items-start gap-2 ${
                  diagnosisFeedback.isCorrect
                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
                    : 'bg-rose-500/10 border border-rose-500/20 text-rose-300'
                }`}
              >
                {diagnosisFeedback.isCorrect ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                <span>{diagnosisFeedback.feedback}</span>
              </div>
            )}

            {!session?.diagnosisCorrect && (
              <Button
                variant="danger"
                size="sm"
                onClick={handleSubmitDiagnosis}
                disabled={!selectedDiagnosis || isSubmittingDiagnosis}
                className="self-end"
              >
                {isSubmittingDiagnosis ? 'Evaluating Hypothesis...' : 'Lock In Diagnosis →'}
              </Button>
            )}
          </Card>

          {/* Stage 4: Remediation Action Console */}
          {session?.diagnosisCorrect && (
            <Card className="p-5 flex flex-col gap-4 border-[#272732] animate-fadeIn">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Stage 4: Apply Technical Remediation
                </h3>
                {session?.remediationCorrect && <Badge variant="emerald">Fix Applied ✓</Badge>}
              </div>

              <p className="text-xs text-zinc-400">
                Select the correct configuration or operational fix to restore normal service.
              </p>

              <div className="flex flex-col gap-2.5">
                {scenario.remediationOptions?.map((rem: any) => (
                  <label
                    key={rem.id}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col gap-1.5 ${
                      selectedRemediation === rem.id
                        ? 'bg-amber-500/10 border-amber-500 text-white'
                        : 'bg-zinc-900/40 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="remediation"
                        value={rem.id}
                        checked={selectedRemediation === rem.id}
                        onChange={() => setSelectedRemediation(rem.id)}
                        disabled={session?.remediationCorrect}
                      />
                      <span className="text-xs font-bold text-white">{rem.title}</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 pl-6">{rem.actionDescription}</p>
                    {rem.commandSyntax && (
                      <pre className="ml-6 p-2 rounded-lg bg-black font-mono text-[10px] text-[#00f0ff]">
                        {rem.commandSyntax}
                      </pre>
                    )}
                  </label>
                ))}
              </div>

              {remediationFeedback && (
                <div
                  className={`p-3.5 rounded-2xl text-xs flex items-start gap-2 ${
                    remediationFeedback.isCorrect
                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
                      : 'bg-rose-500/10 border border-rose-500/20 text-rose-300'
                  }`}
                >
                  {remediationFeedback.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <span>{remediationFeedback.feedback}</span>
                </div>
              )}

              {!session?.remediationCorrect && (
                <Button
                  variant="cyan"
                  size="sm"
                  onClick={handleApplyRemediation}
                  disabled={!selectedRemediation || isApplyingRemediation}
                  className="self-end"
                >
                  {isApplyingRemediation ? 'Applying Configuration...' : 'Apply Remediation Fix →'}
                </Button>
              )}
            </Card>
          )}

          {/* Stage 5: Verification Suite Runner */}
          {session?.remediationCorrect && !session?.passed && (
            <Card className="p-5 flex flex-col gap-4 border-emerald-500/30 bg-emerald-500/5 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Stage 5: Verification & Service Restoration
                </h3>
              </div>

              <p className="text-xs text-zinc-300">
                Remediation has been applied. Run the automated multi-point verification suite to confirm service restoration.
              </p>

              <Button
                variant="primary"
                size="md"
                onClick={handleRunVerification}
                disabled={isVerifying}
                leftIcon={<Play className="w-4 h-4" />}
                className="w-full"
              >
                {isVerifying ? 'Running Verification Suite...' : 'Run Automated Verification Suite'}
              </Button>
            </Card>
          )}

          {/* Stage 6: Post-Mortem & Completion Showcase */}
          {session?.passed && (
            <Card className="p-6 flex flex-col gap-6 border-emerald-500/40 bg-gradient-to-b from-emerald-500/10 to-[#0c0c10] animate-fadeIn">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-white">Incident Resolved!</h3>
                    <span className="text-xs font-mono text-emerald-400">
                      Score: {session?.scoreBreakdown?.totalScore || 100}% | Status: PASSED
                    </span>
                  </div>
                </div>

                <Link href="/troubleshooting">
                  <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    More Scenarios
                  </Button>
                </Link>
              </div>

              {/* Score Breakdown Table */}
              <div className="p-4 rounded-2xl bg-black/60 border border-zinc-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase">Evidence</span>
                  <span className="text-sm font-bold text-white">+{session?.scoreBreakdown?.evidenceScore || 25} pts</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase">Diagnosis</span>
                  <span className="text-sm font-bold text-white">+{session?.scoreBreakdown?.diagnosisScore || 30} pts</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase">Remediation</span>
                  <span className="text-sm font-bold text-white">+{session?.scoreBreakdown?.remediationScore || 30} pts</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase">Verification</span>
                  <span className="text-sm font-bold text-emerald-400">+{session?.scoreBreakdown?.verificationScore || 15} pts</span>
                </div>
              </div>

              {/* Post-Mortem Technical Deep Dive */}
              <div className="flex flex-col gap-4 border-t border-zinc-800 pt-4">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#00f0ff]" />
                  <h4 className="text-sm font-bold text-white">Technical Post-Mortem & OSI Layer Analysis</h4>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col gap-3 text-xs text-zinc-300 leading-relaxed">
                  <div>
                    <strong className="text-white block font-mono text-[11px] mb-1">Root Cause Analysis:</strong>
                    {postMortemData?.postMortem?.rootCauseAnalysis || scenario.postMortem?.rootCauseAnalysis}
                  </div>

                  <div className="flex items-center gap-2">
                    <strong className="text-white font-mono text-[11px]">OSI Layer:</strong>
                    <Badge variant="purple">
                      {postMortemData?.postMortem?.osiLayer || scenario.postMortem?.osiLayer}
                    </Badge>
                  </div>

                  <div>
                    <strong className="text-white block font-mono text-[11px] mb-1">Prevention Best Practices:</strong>
                    <ul className="list-disc list-inside flex flex-col gap-1 text-zinc-400">
                      {(postMortemData?.postMortem?.preventionBestPractices || scenario.postMortem?.preventionBestPractices)?.map(
                        (bp: string, idx: number) => (
                          <li key={idx}>{bp}</li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
