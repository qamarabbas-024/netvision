'use client';

import React, { useState } from 'react';
import { Monitor, Server, ArrowRight, ArrowLeft } from 'lucide-react';

export const ClientServerVisual: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'http' | 'https'>('http');

  return (
    <div className="p-4 sm:p-6 rounded-2xl glass-panel border border-[#272732] flex flex-col gap-5 sm:gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-wider font-semibold block mb-1">
            Application Protocol Architecture
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">HTTP (Port 80) vs HTTPS (Port 443)</h3>
        </div>

        <div className="flex items-center gap-1.5 bg-[#121217] p-1.5 rounded-xl border border-[#272732] w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('http')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-all text-center ${
              activeTab === 'http' ? 'bg-amber-400 text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            HTTP
          </button>
          <button
            onClick={() => setActiveTab('https')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-all text-center ${
              activeTab === 'https' ? 'bg-emerald-400 text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            HTTPS (TLS)
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6 rounded-xl bg-[#09090b] border border-[#272732] flex flex-col gap-4 sm:gap-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center gap-1.5 text-center">
            <Monitor className="w-8 h-8 sm:w-10 sm:h-10 text-[#00f0ff]" />
            <span className="text-xs font-bold text-white">Browser</span>
          </div>

          <div className="flex-1 flex flex-col items-center gap-2 text-center py-2 sm:py-0">
            <div className="flex items-center gap-2 text-[#00f0ff]">
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="text-xs font-mono font-bold">
                {activeTab === 'http' ? 'GET /index.html' : 'Encrypted TLS Record'}
              </span>
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            </div>

            <span className={`text-[10px] sm:text-[11px] font-mono px-2.5 py-1 rounded-full border leading-snug ${
              activeTab === 'http' ? 'border-amber-400/30 text-amber-400 bg-amber-400/10' : 'border-emerald-400/30 text-emerald-400 bg-emerald-400/10'
            }`}>
              {activeTab === 'http' ? '⚠️ Plaintext payload visible' : '🔒 TLS Encrypted (AES-256)'}
            </span>
          </div>

          <div className="flex flex-col items-center gap-1.5 text-center">
            <Server className="w-8 h-8 sm:w-10 sm:h-10 text-purple-400" />
            <span className="text-xs font-bold text-white">Nginx Server</span>
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl bg-[#121217] border border-[#272732] font-mono text-xs text-zinc-300">
          <strong>Payload Wire Snapshot:</strong>
          <pre className="mt-2 p-3 rounded bg-black/60 border border-zinc-800 text-[10px] sm:text-[11px] text-[#00f0ff] overflow-x-auto whitespace-pre">
            {activeTab === 'http'
              ? `GET /login HTTP/1.1\nHost: example.com\nUser-Agent: Mozilla/5.0\nAuthorization: Basic dXNlcjpwYXNz`
              : `\x16\x03\x03\x00\x97\x01\x00\x00\x93\x03\x03 [ENCRYPTED CYPERTEXT DATA STREAM]\nClient Hello + CipherSuites TLS_AES_256_GCM_SHA384`}
          </pre>
        </div>
      </div>
    </div>
  );
};
