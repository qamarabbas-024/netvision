'use client';

import React, { useState } from 'react';
import {
  Activity,
  Layers,
  CheckCircle2,
  RotateCcw,
  Zap,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  EncryptedDnsEngine,
  DnsPrivacyProtocol,
} from '@/lib/encryptedDnsEngine';
import { SoundFx } from '@/lib/soundFx';

export const EncryptedDnsStudio: React.FC = () => {
  const [protocols] = useState<DnsPrivacyProtocol[]>(() => EncryptedDnsEngine.getProtocols());
  const [selectedProto, setSelectedProto] = useState<DnsPrivacyProtocol>(protocols[2]); // DoH + ECH
  const [wiretapActive, setWiretapActive] = useState<boolean>(false);

  const handleExecuteWiretap = () => {
    SoundFx.playPacketDrop();
    setWiretapActive(true);
    if (selectedProto.dnsQueryExposed || selectedProto.sniExposed) {
      SoundFx.playPacketDrop();
    } else {
      SoundFx.playSuccessChime();
    }
  };

  const handleReset = () => {
    SoundFx.playTerminalKeyPress();
    setWiretapActive(false);
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00f0ff]">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#00f0ff] font-bold uppercase tracking-wider">
                Version 6.5 DNS Privacy & ECH
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                DoH • DoT • ECH RFC 8744
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Encrypted DNS & Encrypted Client Hello Wiretap Simulator
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!wiretapActive ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleExecuteWiretap}
              leftIcon={<Zap className="w-3.5 h-3.5" />}
            >
              Simulate ISP Wiretap Snooping
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
              Reset Wiretap
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid: Protocol Selector (Left) & Wiretap Dissection (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 6 Cols: Protocol Cards */}
        <div className="lg:col-span-6 p-6 flex flex-col gap-4 bg-[#0c0e17]">
          <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[#00f0ff]" /> Select DNS Transport Architecture
          </span>

          <div className="space-y-2.5">
            {protocols.map((p) => {
              const isSelected = selectedProto.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    SoundFx.playTerminalKeyPress();
                    setSelectedProto(p);
                    setWiretapActive(false);
                  }}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col gap-1.5 ${
                    isSelected
                      ? 'border-[#00f0ff] bg-cyan-950/30 shadow-glow-cyan'
                      : 'border-[#262c42] bg-[#121522] hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white font-mono">{p.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-cyan-300 border border-zinc-800">
                      {p.transportPort}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-zinc-400 mt-1">
                    <div>
                      DNS Query:{' '}
                      <span className={p.dnsQueryExposed ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                        {p.dnsQueryExposed ? 'EXPOSED' : 'ENCRYPTED'}
                      </span>
                    </div>
                    <div>
                      TLS SNI:{' '}
                      <span className={p.sniExposed ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                        {p.sniExposed ? 'EXPOSED' : 'ENCRYPTED (ECH)'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 6 Cols: Wiretap Inspector */}
        <div className="lg:col-span-6 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" /> Wire Packet Payload Capture
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                !wiretapActive
                  ? 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  : selectedProto.dnsQueryExposed
                  ? 'bg-rose-950/60 text-rose-300 border-rose-500/40 animate-pulse'
                  : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
              }`}
            >
              {!wiretapActive
                ? 'STANDBY'
                : selectedProto.dnsQueryExposed
                ? 'PRIVACY LEAKED'
                : 'CIPHERTEXT PROTECTED'}
            </span>
          </div>

          {/* Captured Packet */}
          <div className="p-3.5 rounded-2xl bg-[#121522] border border-[#262c42] space-y-2">
            <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold block">
              Dissected Wire Frame:
            </span>
            <pre className="p-3 rounded-xl bg-black/60 border border-zinc-800 text-xs font-mono text-cyan-300 overflow-x-auto">
              <code>{selectedProto.wirePayloadSample}</code>
            </pre>
          </div>

          <div className="p-4 rounded-2xl bg-[#10131d] border border-[#202538] space-y-1.5 text-[11px] font-mono text-zinc-400">
            <div className="text-white font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Privacy Architecture Insight
            </div>
            <div>• DoH encrypts DNS lookups inside standard HTTPS traffic</div>
            <div>• ECH (Encrypted Client Hello) encrypts Server Name Indication (SNI)</div>
            <div>• Combined DoH + ECH achieves complete end-to-end ISP metadata confidentiality</div>
          </div>
        </div>
      </div>
    </div>
  );
};
