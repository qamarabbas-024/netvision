'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Tooltip } from '@/components/ui/Tooltip';
import { Alert } from '@/components/ui/Alert';
import { Progress } from '@/components/ui/Progress';
import { RouterIcon, SwitchIcon, PacketIcon } from '@/components/ui/Icons';
import {
  ArrowLeft,
  ArrowRight,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  CheckCircle2,
  Bookmark,
  HelpCircle,
  Cpu,
  Server,
  Zap,
  Award,
} from 'lucide-react';

export default function LessonViewerPage() {
  const [activeStep, setActiveStep] = useState<'theory' | 'animation' | 'simulation' | 'quiz' | 'summary'>('theory');
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Simulation State
  const [handshakeStep, setHandshakeStep] = useState<number>(0); // 0: Idle, 1: SYN Sent, 2: SYN-ACK Sent, 3: ACK Sent (Established)
  const [isSimulating, setIsSimulating] = useState(false);

  // Quiz State
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleNextStep = () => {
    if (activeStep === 'theory') setActiveStep('animation');
    else if (activeStep === 'animation') setActiveStep('simulation');
    else if (activeStep === 'simulation') setActiveStep('quiz');
    else if (activeStep === 'quiz') setActiveStep('summary');
  };

  const handlePrevStep = () => {
    if (activeStep === 'summary') setActiveStep('quiz');
    else if (activeStep === 'quiz') setActiveStep('simulation');
    else if (activeStep === 'simulation') setActiveStep('animation');
    else if (activeStep === 'animation') setActiveStep('theory');
  };

  const dispatchHandshakeStep = () => {
    if (handshakeStep < 3) {
      setIsSimulating(true);
      setTimeout(() => {
        setHandshakeStep((prev) => prev + 1);
        setIsSimulating(false);
      }, 1000);
    }
  };

  const resetHandshake = () => {
    setHandshakeStep(0);
    setIsSimulating(false);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col justify-between">
        {/* Top Lesson Header */}
        <header className="sticky top-0 z-40 glass-panel border-b border-[#272732]/80 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/courses/tcp-ip-protocol-suite" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-zinc-500">TCP/IP Protocol Suite</span>
                <span className="text-zinc-600">•</span>
                <span className="text-[11px] font-mono text-[#00f0ff]">Lesson 2.2</span>
              </div>
              <h1 className="text-base font-bold text-white tracking-tight">
                TCP 3-Way Handshake Interactive Simulation
              </h1>
            </div>
          </div>

          {/* Step Progress Tabs */}
          <div className="hidden md:flex items-center gap-2 glass-panel p-1 rounded-2xl border border-[#272732]">
            {(['theory', 'animation', 'simulation', 'quiz', 'summary'] as const).map((step, idx) => (
              <button
                key={step}
                onClick={() => setActiveStep(step)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeStep === step
                    ? 'bg-[#00f0ff] text-black shadow-glow-cyan font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {idx + 1}. {step}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-[#00f0ff] transition-colors"
          >
            <Bookmark className={`w-5 h-5 ${isBookmarked ? 'text-[#00f0ff] fill-[#00f0ff]' : ''}`} />
          </button>
        </header>

        {/* Main Lesson Body Canvas */}
        <main className="flex-1 max-w-6xl w-full mx-auto p-6 flex flex-col justify-center">
          {/* STEP 1: THEORY */}
          {activeStep === 'theory' && (
            <Card className="p-8 glass-panel-glow border-[#00f0ff]/30">
              <Badge variant="cyan" className="mb-4">STEP 1: CONCEPT INTUITION</Badge>
              <h2 className="text-2xl font-bold text-white mb-4">Why Do We Need a 3-Way Handshake?</h2>

              <div className="text-sm text-zinc-300 leading-relaxed space-y-4 mb-8">
                <p>
                  Before two computers exchange HTTP web pages or files over TCP, they must establish a reliable, synchronized connection using the{' '}
                  <Tooltip content="SYN -> SYN-ACK -> ACK packet sequence">
                    <span className="text-[#00f0ff] underline cursor-help font-semibold">TCP 3-Way Handshake</span>
                  </Tooltip>.
                </p>

                <p>
                  Unlike UDP (which broadcasts packets without verifying if the receiver is ready), TCP guarantees that both sides agree on initial sequence numbers (ISN) and buffer allocations.
                </p>

                <Alert variant="info" title="Core Rule of TCP">
                  Every TCP segment contains control flags: <strong>SYN</strong> (Synchronize), <strong>ACK</strong> (Acknowledge), and <strong>FIN</strong> (Finish).
                </Alert>
              </div>

              <div className="flex justify-end">
                <Button variant="cyan" size="lg" onClick={handleNextStep} rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Next: Step 2 Visual Animation
                </Button>
              </div>
            </Card>
          )}

          {/* STEP 2: ANIMATION */}
          {activeStep === 'animation' && (
            <Card className="p-8 glass-panel-glow border-[#00f0ff]/30">
              <Badge variant="cyan" className="mb-4">STEP 2: 60 FPS VISUAL ANIMATION</Badge>
              <h2 className="text-2xl font-bold text-white mb-4">Visualizing Packet Sequence Flow</h2>

              <div className="relative h-64 bg-[#09090b] rounded-2xl border border-[#272732] flex items-center justify-between px-12 mb-6 overflow-hidden">
                <div className="absolute top-1/2 left-20 right-20 h-1 bg-[#272732] -translate-y-1/2" />

                <div className="relative z-10 flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg">
                    <Cpu className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-mono font-bold text-zinc-300">Client (192.168.1.10)</span>
                </div>

                <div className="relative z-10 p-3 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] font-mono text-xs font-bold animate-pulse">
                  SYN [Seq=100] --&gt;
                </div>

                <div className="relative z-10 flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-lg">
                    <Server className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-mono font-bold text-zinc-300">Web Server (172.16.0.5)</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={handlePrevStep} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  Back to Theory
                </Button>
                <Button variant="cyan" size="lg" onClick={handleNextStep} rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Next: Step 3 Interactive Simulation
                </Button>
              </div>
            </Card>
          )}

          {/* STEP 3: INTERACTIVE SIMULATION */}
          {activeStep === 'simulation' && (
            <Card className="p-8 glass-panel-glow border-[#00f0ff]/30">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="cyan">STEP 3: HANDS-ON INTERACTIVE LAB</Badge>
                <span className="text-xs font-mono text-emerald-400">
                  {handshakeStep === 3 ? 'STATUS: ESTABLISHED ✅' : `STEP ${handshakeStep} OF 3`}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">Execute Handshake Packet Sequence</h2>
              <p className="text-xs text-zinc-400 mb-6">Click dispatch to send each packet phase across the network wire.</p>

              {/* Topology Canvas */}
              <div className="relative h-56 bg-[#09090b] rounded-2xl border border-[#272732] flex items-center justify-between px-12 mb-6">
                <div className="absolute top-1/2 left-24 right-24 h-1 bg-[#272732] -translate-y-1/2" />

                <div className="relative z-10 flex flex-col items-center gap-2">
                  <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center ${handshakeStep >= 1 ? 'bg-[#00f0ff]/10 border-[#00f0ff]/40 text-[#00f0ff] shadow-glow-cyan' : 'bg-white/5 border-white/10 text-zinc-400'}`}>
                    <Cpu className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-mono font-bold text-zinc-300">Client PC</span>
                </div>

                {/* Packet Flight Indicator */}
                <div className="relative z-10 flex flex-col items-center gap-1 font-mono text-xs">
                  {handshakeStep === 0 && <span className="text-zinc-500">Idle (Awaiting SYN)</span>}
                  {handshakeStep === 1 && <span className="px-3 py-1 rounded bg-[#00f0ff] text-black font-bold shadow-glow-cyan animate-pulse">1. SYN (Seq=100) --&gt;</span>}
                  {handshakeStep === 2 && <span className="px-3 py-1 rounded bg-purple-500 text-white font-bold shadow-glow-purple animate-pulse">&lt;-- 2. SYN-ACK (Ack=101, Seq=300)</span>}
                  {handshakeStep === 3 && <span className="px-3 py-1 rounded bg-emerald-500 text-black font-bold shadow-glow-cyan">3. ACK (Ack=301) --&gt; ESTABLISHED</span>}
                </div>

                <div className="relative z-10 flex flex-col items-center gap-2">
                  <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center ${handshakeStep >= 2 ? 'bg-purple-500/10 border-purple-500/40 text-purple-400 shadow-glow-purple' : 'bg-white/5 border-white/10 text-zinc-400'}`}>
                    <Server className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-mono font-bold text-zinc-300">Server Node</span>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center justify-between pt-4 border-t border-[#272732]">
                <Button variant="ghost" onClick={resetHandshake} leftIcon={<RotateCcw className="w-4 h-4" />}>
                  Reset Lab
                </Button>

                {handshakeStep < 3 ? (
                  <Button variant="cyan" onClick={dispatchHandshakeStep} isLoading={isSimulating} leftIcon={<PlayCircle className="w-4 h-4" />}>
                    Dispatch {handshakeStep === 0 ? 'SYN' : handshakeStep === 1 ? 'SYN-ACK' : 'ACK'} Packet
                  </Button>
                ) : (
                  <Button variant="cyan" size="lg" onClick={handleNextStep} rightIcon={<ArrowRight className="w-5 h-5" />}>
                    Lab Complete! Advance to Quiz
                  </Button>
                )}
              </div>
            </Card>
          )}

          {/* STEP 4: QUIZ */}
          {activeStep === 'quiz' && (
            <Card className="p-8 glass-panel-glow border-[#00f0ff]/30">
              <Badge variant="cyan" className="mb-4">STEP 4: MASTERY QUIZ</Badge>
              <h2 className="text-2xl font-bold text-white mb-2">Question 1 of 1</h2>
              <p className="text-sm text-zinc-300 mb-6">
                Which TCP flag sequence is sent by the server in response to an initial client SYN request?
              </p>

              <div className="flex flex-col gap-3 mb-6">
                {[
                  { id: 0, text: 'A. FIN-ACK' },
                  { id: 1, text: 'B. SYN-ACK', correct: true },
                  { id: 2, text: 'C. RST-SYN' },
                  { id: 3, text: 'D. UDP PING' },
                ].map((opt) => {
                  const isSelected = selectedQuizOption === opt.id;
                  const isCorrect = opt.correct;
                  let bgClass = 'bg-[#181820] border-[#272732] text-zinc-300 hover:border-zinc-500';

                  if (quizSubmitted) {
                    if (isCorrect) bgClass = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                    else if (isSelected && !isCorrect) bgClass = 'bg-rose-500/20 border-rose-500 text-rose-300';
                  } else if (isSelected) {
                    bgClass = 'bg-[#00f0ff]/10 border-[#00f0ff] text-[#00f0ff] font-bold shadow-glow-cyan';
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => !quizSubmitted && setSelectedQuizOption(opt.id)}
                      className={`p-4 rounded-xl border text-left text-sm font-mono transition-all ${bgClass}`}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>

              {!quizSubmitted ? (
                <div className="flex justify-end">
                  <Button
                    variant="cyan"
                    disabled={selectedQuizOption === null}
                    onClick={() => setQuizSubmitted(true)}
                  >
                    Submit Quiz Answer
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between pt-4 border-t border-[#272732]">
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Correct! SYN-ACK acknowledges initial client sequence number.
                  </span>
                  <Button variant="cyan" onClick={handleNextStep} rightIcon={<ArrowRight className="w-5 h-5" />}>
                    Unlock Lesson Completion
                  </Button>
                </div>
              )}
            </Card>
          )}

          {/* STEP 5: SUMMARY & ACHIEVEMENT UNLOCK */}
          {activeStep === 'summary' && (
            <Card className="p-8 glass-panel-glow border-[#00f0ff]/40 text-center flex flex-col items-center">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#00f0ff] to-[#3b82f6] flex items-center justify-center text-black shadow-glow-cyan mb-6">
                <Award className="w-10 h-10" />
              </div>

              <h2 className="text-3xl font-extrabold text-white mb-2">Lesson Completed! 🎉</h2>
              <p className="text-sm text-zinc-400 max-w-md mb-6">
                You've mastered the <strong>TCP 3-Way Handshake</strong> interactive simulation.
              </p>

              <div className="flex items-center gap-6 p-4 rounded-2xl bg-[#121217] border border-[#272732] mb-8 font-mono">
                <div>
                  <span className="text-xs text-zinc-500 block">XP REWARD</span>
                  <span className="text-lg font-bold text-[#00f0ff]">+150 XP</span>
                </div>
                <div className="w-px h-8 bg-[#272732]" />
                <div>
                  <span className="text-xs text-zinc-500 block">STREAK</span>
                  <span className="text-lg font-bold text-amber-400">7 Days 🔥</span>
                </div>
              </div>

              <Link href="/courses/tcp-ip-protocol-suite">
                <Button variant="cyan" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Continue To Next Lesson
                </Button>
              </Link>
            </Card>
          )}
        </main>

        {/* Footer Navigation Bar */}
        <footer className="glass-panel border-t border-[#272732]/80 px-6 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={handlePrevStep} disabled={activeStep === 'theory'}>
            Previous Step
          </Button>

          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
            NetVision Interactive Engine
          </span>

          <Button variant="cyan" onClick={handleNextStep} disabled={activeStep === 'summary'}>
            Next Step
          </Button>
        </footer>
      </div>
    </ProtectedRoute>
  );
}
