'use client';

import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  Activity,
  CheckCircle2,
  Code2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  NetworkGraphRagEngine,
  GraphQueryResult,
} from '@/lib/networkGraphRagEngine';
import { SoundFx } from '@/lib/soundFx';

export const NetworkGraphRagStudio: React.FC = () => {
  const [queryInput, setQueryInput] = useState<string>('Find single points of failure (SPOF) across datacenter spines');
  const [result, setResult] = useState<GraphQueryResult>(() =>
    NetworkGraphRagEngine.executeNaturalLanguageQuery(queryInput)
  );
  const [isQuerying, setIsQuerying] = useState<boolean>(false);

  const handleRunQuery = (customText?: string) => {
    const textToRun = customText || queryInput;
    if (customText) setQueryInput(customText);
    setIsQuerying(true);
    SoundFx.playPacketDispatch();

    setTimeout(() => {
      const res = NetworkGraphRagEngine.executeNaturalLanguageQuery(textToRun);
      setResult(res);
      setIsQuerying(false);
      SoundFx.playSuccessChime();
    }, 400);
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider">
                Version 6.7 GraphRAG & AI Query
              </span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono font-bold">
                Natural Language to Cypher
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              AI Natural Language Network Topology & Diagnostics Engine
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleRunQuery()}
            disabled={isQuerying}
            leftIcon={<Search className="w-3.5 h-3.5" />}
          >
            {isQuerying ? 'Traversing Knowledge Graph...' : 'Execute GraphRAG Query'}
          </Button>
        </div>
      </div>

      {/* Query Bar & Presets */}
      <div className="p-6 bg-[#0c0e17] border-b border-[#202538] flex flex-col gap-3">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRunQuery()}
            placeholder="Ask any question about your network topology..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-black/60 border border-[#262c42] text-xs font-mono text-white focus:outline-none focus:border-indigo-400"
          />
        </div>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono text-zinc-500 uppercase">Suggested Prompts:</span>
          {[
            'Find single points of failure (SPOF) across datacenter spines',
            'Identify MTU mismatch drops between Core and Leaf switches',
            'Find shortest low-latency path between London and Singapore',
          ].map((promptText, idx) => (
            <button
              key={idx}
              onClick={() => handleRunQuery(promptText)}
              className="text-[10px] font-mono px-2.5 py-1 rounded-xl bg-[#121522] text-zinc-400 hover:text-white border border-[#262c42] hover:border-indigo-500/50 transition-all truncate max-w-xs"
            >
              {promptText}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Cypher Query Code (Left) & Diagnostics Insight (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 6 Cols: Cypher Translation */}
        <div className="lg:col-span-6 p-6 flex flex-col gap-3 bg-[#090b10]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-indigo-400" /> Synthesized Cypher Graph Query
            </span>
            <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-500/30">
              Neo4j / Memgraph Compatible
            </span>
          </div>

          <pre className="p-4 rounded-2xl bg-black/60 border border-zinc-800 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed">
            <code>{result.cypherQuery}</code>
          </pre>

          <div className="p-3.5 rounded-2xl bg-[#121522] border border-[#262c42] text-[11px] font-mono text-zinc-400 space-y-1">
            <span className="text-white font-bold block">Matched Topology Entities:</span>
            <div>• Nodes: <span className="text-white">{result.matchedNodes.join(', ')}</span></div>
            <div>• Edges: <span className="text-cyan-300">{result.matchedLinks.join(', ')}</span></div>
          </div>
        </div>

        {/* Right 6 Cols: Graph Diagnostics Insight */}
        <div className="lg:col-span-6 p-5 bg-[#0c0e17] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" /> AI Diagnostic Synthesis
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                result.severity === 'CRITICAL'
                  ? 'bg-rose-950/60 text-rose-300 border-rose-500/40 animate-pulse'
                  : result.severity === 'WARNING'
                  ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                  : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
              }`}
            >
              {result.severity}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 text-xs font-mono text-indigo-200 leading-relaxed">
            {result.insight}
          </div>

          <div className="p-4 rounded-2xl bg-[#10131d] border border-[#202538] space-y-1.5 text-[11px] font-mono text-zinc-400">
            <div className="text-white font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> GraphRAG Diagnostic Capabilities
            </div>
            <div>• Instant subgraph extraction without manual CLI ping sweeps</div>
            <div>• Correlates Layer 2 switching, Layer 3 routing & Optical links simultaneously</div>
            <div>• Translates multi-hop path intent into deterministic graph traversals</div>
          </div>
        </div>
      </div>
    </div>
  );
};
