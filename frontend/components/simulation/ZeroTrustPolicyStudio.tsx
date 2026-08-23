'use client';

import React, { useState } from 'react';
import {
  Lock,
  Key,
  Laptop,
  Check,
  X,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  ZeroTrustEngine,
  DevicePostureState,
  ZtnaAccessDecision,
} from '@/lib/zeroTrustEngine';
import { SoundFx } from '@/lib/soundFx';

export const ZeroTrustPolicyStudio: React.FC = () => {
  const [posture, setPosture] = useState<DevicePostureState>({
    isEdrActive: true,
    isDiskEncrypted: true,
    isCertInstalled: true,
    isGeoTrusted: true,
  });

  const [decision, setDecision] = useState<ZtnaAccessDecision>(() =>
    ZeroTrustEngine.evaluateAccess(posture, 'ENGINEER', 'Internal Payroll App')
  );

  const togglePosture = (key: keyof DevicePostureState) => {
    SoundFx.playTerminalKeyPress();
    const updated = { ...posture, [key]: !posture[key] };
    setPosture(updated);
    const newDecision = ZeroTrustEngine.evaluateAccess(updated, 'ENGINEER', 'Internal Payroll App');
    setDecision(newDecision);

    if (newDecision.status === 'GRANTED') {
      SoundFx.playSuccessChime();
    } else {
      SoundFx.playPacketDrop();
    }
  };

  const handleReset = () => {
    SoundFx.playTerminalKeyPress();
    const cleanPosture: DevicePostureState = {
      isEdrActive: true,
      isDiskEncrypted: true,
      isCertInstalled: true,
      isGeoTrusted: true,
    };
    setPosture(cleanPosture);
    setDecision(ZeroTrustEngine.evaluateAccess(cleanPosture, 'ENGINEER', 'Internal Payroll App'));
    SoundFx.playSuccessChime();
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                Version 5.5 Zero Trust (ZTNA)
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                NIST SP 800-207 Architecture
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Continuous Device Posture & Dynamic mTLS Policy Engine
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset Posture
          </Button>
        </div>
      </div>

      {/* Main Grid: Device Posture Toggles (Left) & PDP/PEP Access Decision Wall (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 6 Cols: Continuous Device Posture Matrix */}
        <div className="lg:col-span-6 p-6 flex flex-col gap-4 bg-[#0c0e17]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Laptop className="w-4 h-4 text-emerald-400" /> Endpoint Device Health Signals
            </span>
            <span className="text-[10px] font-mono text-zinc-400">Host: MacBook-Pro-M3</span>
          </div>

          <div className="space-y-2.5">
            {[
              { key: 'isCertInstalled', label: 'Hardware mTLS Identity Certificate', desc: 'Cryptographic TPM/Secure Enclave Certificate (X.509)' },
              { key: 'isEdrActive', label: 'Endpoint Detection & Response (EDR)', desc: 'CrowdStrike Falcon / SentinelOne real-time telemetry' },
              { key: 'isDiskEncrypted', label: 'Full Disk Encryption (FileVault/BitLocker)', desc: 'XTS-AES-256 hardware storage encryption' },
              { key: 'isGeoTrusted', label: 'Trusted Ingress GeoIP & ASN', desc: 'Corporate IP range without VPN or Tor exit hops' },
            ].map((item) => {
              const active = posture[item.key as keyof DevicePostureState];
              return (
                <div
                  key={item.key}
                  onClick={() => togglePosture(item.key as keyof DevicePostureState)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    active
                      ? 'border-emerald-500/40 bg-emerald-950/20'
                      : 'border-rose-500/40 bg-rose-950/20'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      {active ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <X className="w-3.5 h-3.5 text-rose-400" />}
                      {item.label}
                    </span>
                    <span className="text-[10px] text-zinc-400">{item.desc}</span>
                  </div>

                  <span
                    className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
                      active
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                        : 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                    }`}
                  >
                    {active ? 'COMPLIANT' : 'FAIL'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 6 Cols: PDP Policy Decision & Ephemeral mTLS Tunnel */}
        <div className="lg:col-span-6 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Key className="w-4 h-4 text-emerald-400" /> Policy Decision Point (PDP)
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                decision.status === 'GRANTED'
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                  : decision.status === 'STEP_UP_MFA'
                  ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                  : 'bg-rose-950/60 text-rose-300 border-rose-500/40'
              }`}
            >
              DECISION: {decision.status}
            </span>
          </div>

          {/* Identity & SPIFFE Card */}
          <div className="p-3.5 rounded-2xl bg-[#121522] border border-[#262c42] space-y-1.5 text-xs font-mono">
            <div className="text-zinc-400">
              mTLS Subject: <span className="text-white font-bold">{decision.mTLSCertSubject}</span>
            </div>
            <div className="text-zinc-400">
              SPIFFE ID: <span className="text-emerald-400">{decision.spiffeId}</span>
            </div>
            <div className="text-zinc-400">
              Tunnel: <span className="text-cyan-300">{decision.assignedTunnel}</span>
            </div>
          </div>

          {/* Audit Reasons */}
          <div className="p-4 rounded-2xl bg-[#10131d] border border-[#202538] space-y-2">
            <span className="text-xs font-bold text-white block">Continuous Trust Audit Trail</span>
            <ul className="space-y-1 text-[11px] font-mono">
              {decision.reasons.map((r, idx) => (
                <li
                  key={idx}
                  className={`flex items-center gap-1.5 ${
                    decision.status === 'GRANTED' ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  <span>{decision.status === 'GRANTED' ? '✓' : '✗'}</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
