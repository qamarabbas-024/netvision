'use client';

import React, { useState } from 'react';
import { Database, Search, Bot, Radio, Network, Terminal, ShieldAlert, Check } from 'lucide-react';
import { SAMPLE_SYSLOG_STREAM, queryTelemetryGraph, TelemetryLogEntry } from '@/lib/telemetryGraphRagEngine';

export const TelemetryGraphRagStudio: React.FC = () => {
  const [query, setQuery] = useState<string>('Find security incidents involving SYN flood or DDoS');
  const [result, setResult] = useState(queryTelemetryGraph(query));

  const handleSearch = () => {
    setResult(queryTelemetryGraph(query));
  };

  return (
    <div className="surface-1 rounded-2xl border border-[#2a2e39] p-6 text-[#f4f5f7] font-sans shadow-instrument flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2a2e39] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#22c55e]">
              EPOCH XII // REAL-TIME SYSLOG & NETFLOW GRAPHRAG
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Telemetry GraphRAG Knowledge & Incident Correlation Studio
          </h2>
          <p className="text-xs text-[#8e95a5]">
            Query multi-modal Syslog and IPFIX telemetry streams using graph retrieval-augmented generation and Cypher query synthesis.
          </p>
        </div>
      </div>

      {/* Query Bar */}
      <div className="p-4 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col sm:flex-row items-center gap-3 font-mono text-xs">
        <div className="relative w-full">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask GraphRAG (e.g. Which interface caused the BGP flap?)"
            className="w-full p-2.5 pl-9 rounded-lg bg-[#020617] border border-[#1e293b] text-white text-xs outline-none focus:border-[#22c55e]"
          />
          <Search className="w-4 h-4 text-[#64748b] absolute left-3 top-3" />
        </div>

        <button
          type="button"
          onClick={handleSearch}
          className="px-4 py-2.5 rounded-lg bg-[#22c55e] text-[#062817] hover:bg-[#16a34a] font-bold text-xs shrink-0 cursor-pointer flex items-center gap-1.5"
        >
          <Bot className="w-3.5 h-3.5" />
          <span>Execute Graph Query</span>
        </button>
      </div>

      {/* Graph Summary & Cypher Query */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 font-mono text-xs">
        {/* Cypher & Synthesis */}
        <div className="lg:col-span-6 p-4 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#1e293b] text-white font-bold">
            <span>Generated Cypher Query</span>
            <span className="text-[10px] text-[#22c55e]">GRAPH EMBEDDING OK</span>
          </div>
          <pre className="text-[#38bdf8] text-[11px] leading-relaxed whitespace-pre bg-[#020617] p-2.5 rounded border border-[#1e293b]">
            {result.cypherQuery}
          </pre>

          <div className="p-3 rounded-lg bg-[#0f172a] border border-[#22c55e]/30">
            <span className="text-[10px] text-[#64748b] block mb-1">GRAPHRAG SYNTHESIS:</span>
            <p className="text-white text-xs leading-relaxed font-bold">{result.summary}</p>
          </div>
        </div>

        {/* Matched Correlated Logs */}
        <div className="lg:col-span-6 p-4 rounded-xl bg-[#090d14] border border-[#1e293b] flex flex-col gap-2">
          <div className="flex items-center justify-between pb-2 border-b border-[#1e293b] text-white font-bold">
            <span>Correlated Telemetry Records ({result.matchingNodes.length})</span>
            <span className="text-[10px] text-[#64748b]">INGEST: 100K EPS</span>
          </div>

          <div className="flex flex-col gap-2">
            {result.matchingNodes.map((item) => (
              <div key={item.id} className="p-3 rounded-lg bg-[#020617] border border-[#1e293b] flex flex-col gap-1 text-[11px]">
                <div className="flex items-center justify-between">
                  <strong className="text-white">{item.hostname} [{item.facility}]</strong>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      item.severity === 'ALERT' || item.severity === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    {item.severity}
                  </span>
                </div>
                <p className="text-[#8e95a5]">{item.message}</p>
                {item.extractedEntities.ipAddresses.length > 0 && (
                  <div className="text-[10px] text-[#22c55e]">
                    Entities: {item.extractedEntities.ipAddresses.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
