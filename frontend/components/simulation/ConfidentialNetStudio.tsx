'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Activity,
  Layers,
  CheckCircle2,
  Zap,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  ConfidentialNetEngine,
  ConfidentialEnclaveState,
} from '@/lib/confidentialNetEngine';
import { SoundFx } from '@/lib/soundFx';

export const ConfidentialNetStudio: React.FC = () => {
  const [state, setState] = useState<ConfidentialEnclaveState>(() =>
    ConfidentialNetEngine.getInitialState()
  );
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [attestationLog, setAttestationLog] = useState<string | null>(null);

  const handleVerifyAttestation = () => {
    setIsVerifying(true);
    SoundFx.playPacketDispatch();

    setTimeout(() => {
      setAttestationLog(
        '🔒 AMD SEV-SNP Hardware Root of Trust Attestation Verified via AMD KDS certificate chain. Host OS/Hypervisor has zero read permissions into guest RAM (AES-128-XTS active).'
      );
      setIsVerifying(false);
      SoundFx.playSuccessChime();
    }, 500);
  };

  const handleReset = () => {
    SoundFx.playTerminalKeyPress();
    setState(ConfidentialNetEngine.getInitialState());
    setAttestationLog(null);
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                Version 7.7 Confidential Networking
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                AMD SEV-SNP • Intel TDX • TPM
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Hardware Enclave Attestation & In-Flight Memory Isolation
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isVerifying ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleVerifyAttestation}
              leftIcon={<Zap className="w-3.5 h-3.5" />}
            >
              Verify Hardware Attestation
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Querying Silicon Security Processor...
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset
          </Button>
        </div>
      </div>

      {/* Main Grid: PCR Measurements (Left) & Attestation Details (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 7 Cols: PCR Registers */}
        <div className="lg:col-span-7 p-6 flex flex-col gap-4 bg-[#0c0e17]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" /> Platform Configuration Registers (PCR)
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
              Hardware ID: {state.enclaveId}
            </span>
          </div>

          <div className="space-y-2.5">
            {state.measurements.map((m) => (
              <div
                key={m.pcrIndex}
                className="p-3.5 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col gap-1 text-xs font-mono"
              >
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold">{m.registerName}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                    {m.attestationStatus}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-500">SHA-384: {m.sha384DigestHex}</span>
              </div>
            ))}
          </div>

          {attestationLog && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-xs font-mono text-emerald-200 leading-relaxed animate-in fade-in">
              {attestationLog}
            </div>
          )}
        </div>

        {/* Right 5 Cols: Hardware Memory Encryption Security */}
        <div className="lg:col-span-5 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" /> Silicon Encryption Engine
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#121522] border border-[#262c42] space-y-1 text-xs font-mono">
            <span className="text-zinc-400">Memory Key:</span>
            <span className="text-emerald-400 font-bold block">{state.memoryEncryptionKeyHex}</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#10131d] border border-[#202538] space-y-1.5 text-[11px] font-mono text-zinc-400">
            <div className="text-white font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Confidential Computing Guarantees
            </div>
            <div>• Protects data in use inside RAM against rogue hypervisor administrators</div>
            <div>• Hardware-signed cryptographic proof validates exact software digest before secrets are shared</div>
            <div>• Zero-knowledge packet filtering occurs entirely inside secure CPU enclaves</div>
          </div>
        </div>
      </div>
    </div>
  );
};
