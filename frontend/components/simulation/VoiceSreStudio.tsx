'use client';

import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Bot, User, Radio, ShieldCheck, Terminal, Play, Sparkles } from 'lucide-react';
import { synthesizeSreSpeech, generateSreAiResponse, VoiceDialogueTurn } from '@/lib/voiceSreEngine';

export const VoiceSreStudio: React.FC = () => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<VoiceDialogueTurn[]>([
    {
      id: 1,
      speaker: 'sre_ai',
      text: 'NetOps Autonomous SRE Co-Pilot standing by. Ask me to diagnose outages, inspect BGP routes, or fix degraded links.',
      timestamp: '00:00:01',
      actionTaken: 'Initialized multi-modal audio telemetry engine.',
    },
  ]);
  const [inputQuery, setInputQuery] = useState<string>('Why is packet loss occurring on Core-R1?');

  const handleSendPrompt = (promptText: string) => {
    if (!promptText.trim()) return;

    const time = new Date().toISOString().split('T')[1].slice(0, 8);
    const userTurn: VoiceDialogueTurn = {
      id: Date.now(),
      speaker: 'user',
      text: promptText,
      timestamp: time,
    };

    const { responseText, actionTaken } = generateSreAiResponse(promptText);
    const aiTurn: VoiceDialogueTurn = {
      id: Date.now() + 1,
      speaker: 'sre_ai',
      text: responseText,
      timestamp: time,
      actionTaken,
    };

    setTranscript((prev) => [...prev, userTurn, aiTurn]);
    setIsSpeaking(true);
    synthesizeSreSpeech(responseText, () => setIsSpeaking(false));
  };

  return (
    <div className="surface-1 rounded-2xl border border-[#2a2e39] p-6 text-[#f4f5f7] font-sans shadow-instrument flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2a2e39] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#22c55e]">
              EPOCH XII // AUTONOMOUS MULTI-AGENT VOICE AI SRE
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Voice-Driven NetOps SRE Co-Pilot Studio
          </h2>
          <p className="text-xs text-[#8e95a5]">
            Real-time conversational voice assistant with autonomous root cause analysis and proactive topology remediation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setIsListening(!isListening);
              if (!isListening) {
                handleSendPrompt(inputQuery);
              }
            }}
            className={`px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-[#22c55e] text-[#062817] hover:bg-[#16a34a]'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span>{isListening ? 'Listening...' : 'Voice Query'}</span>
          </button>
        </div>
      </div>

      {/* Voice Waveform Activity Indicator */}
      <div className="p-4 rounded-xl bg-[#090d14] border border-[#1e293b] flex items-center justify-between font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {[40, 75, 90, 60, 100, 45, 80, 55, 95, 30].map((h, idx) => (
              <span
                key={idx}
                style={{ height: `${isSpeaking || isListening ? h : 15}%` }}
                className={`w-1 rounded-full transition-all duration-150 ${
                  isSpeaking ? 'bg-[#22c55e]' : isListening ? 'bg-rose-500' : 'bg-[#334155]'
                }`}
              />
            ))}
          </div>
          <span className="text-white text-xs font-bold">
            {isSpeaking ? 'SRE AI Speaking...' : isListening ? 'Listening for command...' : 'Voice Engine Idle'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#64748b]">SYNTHESIS: WEB SPEECH API</span>
        </div>
      </div>

      {/* Dialogue Transcript */}
      <div className="rounded-xl bg-[#090d14] border border-[#1e293b] p-4 flex flex-col gap-3 max-h-[300px] overflow-y-auto font-mono text-xs">
        {transcript.map((item) => (
          <div
            key={item.id}
            className={`p-3 rounded-lg flex flex-col gap-1 ${
              item.speaker === 'user' ? 'bg-[#1e293b]/60 border border-[#334155]' : 'bg-[#0f172a] border border-[#22c55e]/30'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] text-[#64748b]">
              <span className="font-bold flex items-center gap-1.5 text-white">
                {item.speaker === 'user' ? <User className="w-3 h-3 text-[#38bdf8]" /> : <Bot className="w-3 h-3 text-[#22c55e]" />}
                <span>{item.speaker === 'user' ? 'Network Engineer' : 'NetOps Autonomous SRE'}</span>
              </span>
              <span>{item.timestamp}</span>
            </div>
            <p className="text-white text-xs leading-relaxed mt-1">{item.text}</p>
            {item.actionTaken && (
              <div className="mt-1 p-2 rounded bg-[#020617] border border-[#22c55e]/30 text-[#22c55e] text-[11px] font-bold">
                ✓ Action: {item.actionTaken}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Interactive Quick Prompts */}
      <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
        <span className="text-[#8e95a5]">Quick Voice Commands:</span>
        <button
          type="button"
          onClick={() => handleSendPrompt('Diagnose BGP route leak on AS65001')}
          className="px-2.5 py-1 rounded bg-[#1e293b] hover:bg-[#334155] text-[#38bdf8] cursor-pointer"
        >
          &quot;Diagnose BGP route leak&quot;
        </button>
        <button
          type="button"
          onClick={() => handleSendPrompt('Why is packet loss occurring on Core-R1?')}
          className="px-2.5 py-1 rounded bg-[#1e293b] hover:bg-[#334155] text-[#22c55e] cursor-pointer"
        >
          &quot;Inspect packet loss&quot;
        </button>
        <button
          type="button"
          onClick={() => handleSendPrompt('Verify telemetry across spine-leaf cluster')}
          className="px-2.5 py-1 rounded bg-[#1e293b] hover:bg-[#334155] text-[#a855f7] cursor-pointer"
        >
          &quot;Verify spine-leaf telemetry&quot;
        </button>
      </div>
    </div>
  );
};
