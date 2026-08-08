'use client';

import React, { useState } from 'react';
import { Monitor, Server, ArrowRight, ArrowLeft } from 'lucide-react';

export const ClientServerVisual: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'http' | 'https'>('http');

  return (
    <div className="p-6 rounded-2xl glass-panel border border-[#272732] flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-wider font-semibold block mb-1">
            Application Protocol Architecture
          </span>
          <h3 className="text-xl font-bold text-white">HTTP (Plaintext Port 80) vs HTTPS (TLS Encrypted Port 443)</h3>
        </div>

        <div className="flex items-center gap-2 bg-[#121217] p-1.5 rounded-xl border border-[#272732]">
          <button
            onClick={() => setActiveTab('http')}
            className={`px-3 py-1 text-xs font-mono font-bold rounded-lg transition-all ${
              activeTab === 'http' ? 'bg-amber-400 text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            HTTP (Unencrypted)
          </button>
          <button
            onClick={() => setActiveTab('https')}
            className={`px-3 py-1 text-xs font-mono font-bold rounded-lg transition-all ${
              activeTab === 'https' ? 'bg-emerald-400 text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            HTTPS (TLS 1.3 Encrypted)
          </button>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-[#09090b] border border-[#272732] flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col items-center gap-2">
            <Monitor className="w-10 h-10 text-[#00f0ff]" />
            <span className="text-xs font-bold text-white">Web Browser</span>
          </div>

          <div className="flex-1 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-[#00f0ff]">
              <ArrowRight className="w-5 h-5" />
              <span className="text-xs font-mono font-bold">
                {activeTab === 'http' ? 'GET /index.html' : 'Encrypted TLS Record Data'}
              </span>
              <ArrowLeft className="w-5 h-5" />
            </div>

            <span className={`text-[11px] font-mono px-3 py-1 rounded-full border ${
              activeTab === 'http' ? 'border-amber-400/30 text-amber-400 bg-amber-400/10' : 'border-emerald-400/30 text-emerald-400 bg-emerald-400/10'
            }`}>
              {activeTab === 'http' ? '⚠️ Plaintext payload visible to eavesdroppers' : '🔒 TLS Session Key Encrypted (AES-256-GCM)'}
            </span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Server className="w-10 h-10 text-purple-400" />
            <span className="text-xs font-bold text-white">Nginx Web Server</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#121217] border border-[#272732] font-mono text-xs text-zinc-300">
          <strong>Payload Wire Snapshot:</strong>
          <pre className="mt-2 p-3 rounded bg-black/60 border border-zinc-800 text-[11px] text-[#00f0ff] overflow-x-auto">
            {activeTab === 'http'
              ? `GET /login HTTP/1.1\nHost: example.com\nUser-Agent: Mozilla/5.0\nAuthorization: Basic dXNlcjpwYXNz`
              : `\x16\x03\x03\x00\x97\x01\x00\x00\x93\x03\x03 [ENCRYPTED CYPERTEXT DATA STREAM]\nClient Hello + CipherSuites TLS_AES_256_GCM_SHA384`}
          </pre>
        </div>
      </div>
    </div>
  );
};
