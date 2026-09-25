'use client';

import React, { useState, useEffect } from 'react';
import type { VisualSimulationStateDto, SanitizedDiagnosticHintsDto } from '@netvision/shared';
import { LabHeader } from './LabHeader';
import { LabObjectives } from './LabObjectives';
import { LabInstructions } from './LabInstructions';
import { CommandPanel } from './CommandPanel';
import { ExpectedResult } from './ExpectedResult';
import { HintSystem } from './HintSystem';
import { DiagnosticHintEngine } from './DiagnosticHintEngine';
import { Validation } from './Validation';
import { LabProgress } from './LabProgress';
import { LabCompletionCard } from './LabCompletionCard';
import { NetworkTopologyViewer } from '@/components/visuals/NetworkTopologyViewer';
import { PacketFlowAnimator } from '@/components/visuals/PacketFlowAnimator';
import { validateLabApi, getLabSimulationStateApi } from '@/lib/api';

export interface PracticalLabValidationResult {
  passed: boolean;
  score: number;
  checks: Array<{ rule: string; passed: boolean; message: string }>;
  completionSummary: string;
}

export interface PracticalLabEngineProps {
  lab: {
    id: string;
    title: string;
    type: 'GUIDED' | 'ASSISTED' | 'CHALLENGE' | 'TROUBLESHOOTING_INCIDENT' | string;
    difficulty: string;
    estimatedMinutes: number;
    objectives: string[];
    prerequisites?: string[];
    environment?: Record<string, unknown> | null;
    instructions: string;
    commands?: string[];
    expectedObservations?: string[];
    hints?: string[];
    solution?: Record<string, unknown> | null;
    commonMistakes?: string[];
    completionCriteria?: string;
  };
  onComplete?: (score: number, passed: boolean) => void;
  onContinue?: () => void;
}

export const PracticalLabEngine: React.FC<PracticalLabEngineProps> = ({
  lab,
  onComplete,
  onContinue,
}) => {
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [hintsUsedCount, setHintsUsedCount] = useState<number>(0);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [validationResult, setValidationResult] = useState<PracticalLabValidationResult | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Drop P Authoritative State Synchronization
  const [visualState, setVisualState] = useState<VisualSimulationStateDto | null>(null);
  const [hintsData, setHintsData] = useState<SanitizedDiagnosticHintsDto | undefined>(undefined);
  const [stateVersion, setStateVersion] = useState<number>(1);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Initialize authoritative simulation state on mount or lab change
  useEffect(() => {
    let isMounted = true;
    const loadAuthoritativeState = async () => {
      try {
        const state = await getLabSimulationStateApi(lab.id, sessionId);
        if (isMounted && state) {
          setVisualState(state);
          if (state.hints) setHintsData(state.hints);
          if (state.stateVersion) setStateVersion(state.stateVersion);
          if (state.sessionId) setSessionId(state.sessionId);
        }
      } catch (err) {
        console.warn('Could not initialize remote lab simulation state, fallback to local sandbox mode:', err);
      }
    };

    loadAuthoritativeState();
    return () => {
      isMounted = false;
    };
  }, [lab.id]);

  const handleCommandRun = (
    cmd: string,
    output: string,
    newVisualState?: VisualSimulationStateDto,
    newHints?: SanitizedDiagnosticHintsDto,
    newVersion?: number,
    newSessionId?: string
  ) => {
    setCommandHistory((prev) => [...prev, cmd]);
    if (newVisualState) setVisualState(newVisualState);
    if (newHints) setHintsData(newHints);
    if (newVersion) setStateVersion(newVersion);
    if (newSessionId) setSessionId(newSessionId);
  };

  const handleValidate = async () => {
    setIsValidating(true);
    try {
      const hintsCount = hintsData?.currentLevel || hintsUsedCount;
      const res = await validateLabApi(lab.id, commandHistory, hintsCount);
      setValidationResult(res);
      if (res.passed) {
        setIsCompleted(true);
        if (onComplete) onComplete(res.score, true);
      }
    } catch (err: any) {
      console.error('Lab validation error:', err);
      const fallbackResult: PracticalLabValidationResult = {
        passed: false,
        score: 0,
        checks: [
          {
            rule: 'Server Authoritative Validation',
            passed: false,
            message: err?.message || 'Failed to reach validation service. Lab attempt cannot be verified.',
          },
        ],
        completionSummary: 'Lab validation could not be completed. Please ensure network connectivity and retry.',
      };
      setValidationResult(fallbackResult);
      setIsCompleted(false);
      if (onComplete) onComplete(0, false);
    } finally {
      setIsValidating(false);
    }
  };

  const handleReset = () => {
    setCommandHistory([]);
    setHintsUsedCount(0);
    setValidationResult(null);
    setIsCompleted(false);
    setSelectedNodeId(null);
    // Reload state fresh from server
    getLabSimulationStateApi(lab.id)
      .then((state) => {
        if (state) {
          setVisualState(state);
          if (state.hints) setHintsData(state.hints);
          if (state.stateVersion) setStateVersion(state.stateVersion);
          if (state.sessionId) setSessionId(state.sessionId);
        }
      })
      .catch(() => {});
  };

  if (isCompleted && validationResult) {
    return (
      <LabCompletionCard
        title={lab.title}
        score={validationResult.score}
        hintsUsedCount={hintsData?.currentLevel || hintsUsedCount}
        onRetry={handleReset}
        onContinue={onContinue}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* 1. Header */}
      <LabHeader
        title={lab.title}
        type={lab.type}
        difficulty={lab.difficulty}
        estimatedMinutes={lab.estimatedMinutes}
        onReset={handleReset}
      />

      {/* 2. Progress Tracker */}
      <LabProgress
        completedStepsCount={commandHistory.length > 0 ? 1 : 0}
        totalStepsCount={1}
      />

      {/* 3. Objectives */}
      <LabObjectives objectives={lab.objectives} />

      {/* 4. Instructions & Environment */}
      <LabInstructions
        instructions={lab.instructions}
        environmentSummary={lab.environment ? JSON.stringify(lab.environment) : undefined}
      />

      {/* 5. Authoritative Network Topology Canvas (Drop P) */}
      {visualState?.topologyNodes && (
        <NetworkTopologyViewer
          nodes={visualState.topologyNodes}
          links={visualState.topologyLinks}
          causalConsequence={visualState.causalConsequence}
          lastActionSummary={visualState.lastActionSummary}
          stateVersion={stateVersion}
          selectedNodeId={selectedNodeId || undefined}
          onSelectNode={(id) => setSelectedNodeId(id)}
        />
      )}

      {/* 6. Authoritative Packet Flow Animator (Drop P) */}
      {visualState?.recentPacketEvents && visualState.recentPacketEvents.length > 0 && (
        <PacketFlowAnimator
          packetEvents={visualState.recentPacketEvents}
        />
      )}

      {/* 7. CLI Command Sandbox Panel */}
      <CommandPanel
        labId={lab.id}
        allowedCommands={lab.commands}
        clientStateVersion={stateVersion}
        sessionId={sessionId}
        onCommandRun={handleCommandRun}
      />

      {/* 8. Expected Observations */}
      {lab.expectedObservations && (
        <ExpectedResult observations={lab.expectedObservations} />
      )}

      {/* 9. Progressive Diagnostic Hint Engine (Drop P) */}
      {hintsData ? (
        <DiagnosticHintEngine
          labId={lab.id}
          sessionId={sessionId}
          hintsData={hintsData}
          onHintUnlocked={(newHints) => setHintsData(newHints)}
        />
      ) : lab.hints && lab.hints.length > 0 ? (
        <HintSystem
          hints={lab.hints}
          onUnlockHint={(count) => setHintsUsedCount(count)}
        />
      ) : null}

      {/* 10. Validation Runner */}
      <Validation
        isValidating={isValidating}
        onValidate={handleValidate}
        result={validationResult}
      />
    </div>
  );
};

