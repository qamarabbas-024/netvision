'use client';

import React, { useState } from 'react';
import {
  Layers,
  Cpu,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Zap,
  Send,
  RotateCcw,
  Activity,
  Boxes,
  Network,
  CheckCircle2,
  Terminal,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { K8sCniEngine, CniMeshState, K8sPod } from '@/lib/k8sCniEngine';
import { SoundFx } from '@/lib/soundFx';

export const K8sCniMeshStudio: React.FC = () => {
  const [state, setState] = useState<CniMeshState>(() =>
    K8sCniEngine.getInitialState()
  );
  const [selectedSourcePod, setSelectedSourcePod] = useState<string>('pod-1');
  const [selectedTargetPod, setSelectedTargetPod] = useState<string>('pod-2');
  const [isTransmitting, setIsTransmitting] = useState<boolean>(false);
  const [transmissionLog, setTransmissionLog] = useState<{
    text: string;
    success: boolean;
  } | null>(null);

  const handleSendPodTraffic = () => {
    setIsTransmitting(true);
    SoundFx.playPacketDispatch();

    setTimeout(() => {
      const result = K8sCniEngine.simulateTraffic(
        state,
        selectedSourcePod,
        selectedTargetPod
      );
      setState(result.newState);
      setTransmissionLog({ text: result.log, success: result.success });
      setIsTransmitting(false);

      if (result.success) {
        SoundFx.playSuccessChime();
      } else {
        SoundFx.playPacketDrop();
      }
    }, 450);
  };

  const handleSwitchCni = (plugin: 'CILIUM_EBPF' | 'CALICO_BGP' | 'FLANNEL_VXLAN') => {
    SoundFx.playTerminalKeyPress();
    const latencyMap = {
      CILIUM_EBPF: 0.04,
      CALICO_BGP: 0.38,
      FLANNEL_VXLAN: 1.45,
    };
    const modeMap = {
      CILIUM_EBPF: 'eBPF Direct Redirection',
      CALICO_BGP: 'IPVS / BGP Node Mesh',
      FLANNEL_VXLAN: 'iptables NAT Overlay',
    } as const;

    setState((prev) => ({
      ...prev,
      cniPlugin: plugin,
      kubeProxyMode: modeMap[plugin],
      datapathLatencyMs: latencyMap[plugin],
      forwardingEvents: [
        `🔄 CNI Datapath switched to ${plugin} (Kube-Proxy: ${modeMap[plugin]})`,
        ...prev.forwardingEvents.slice(0, 5),
      ],
    }));
  };

  const handleReset = () => {
    SoundFx.playTerminalKeyPress();
    setState(K8sCniEngine.getInitialState());
    setSelectedSourcePod('pod-1');
    setSelectedTargetPod('pod-2');
    setTransmissionLog(null);
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider">
                Version 9.4 Kubernetes CNI
              </span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono font-bold">
                eBPF Cilium • Pod Policy Mesh
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Kubernetes CNI & eBPF Host-Routing Datapath
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleSendPodTraffic}
            disabled={isTransmitting || selectedSourcePod === selectedTargetPod}
            leftIcon={<Send className="w-3.5 h-3.5" />}
          >
            {isTransmitting ? 'Synthesizing Flow...' : 'Send Pod-to-Pod Traffic'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset
          </Button>
        </div>
      </div>

      {/* CNI Plugin Switcher Banner */}
      <div className="px-6 py-3 bg-[#0c0e17] border-b border-[#1b2030] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-zinc-400">Active CNI Engine:</span>
          {(['CILIUM_EBPF', 'CALICO_BGP', 'FLANNEL_VXLAN'] as const).map((plugin) => (
            <button
              key={plugin}
              onClick={() => handleSwitchCni(plugin)}
              className={`px-3 py-1 rounded-xl font-mono text-xs font-bold transition-all ${
                state.cniPlugin === plugin
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-[#151928] text-zinc-400 hover:text-white border border-[#252c42]'
              }`}
            >
              {plugin === 'CILIUM_EBPF'
                ? 'Cilium (eBPF)'
                : plugin === 'CALICO_BGP'
                ? 'Calico (BGP/IPAM)'
                : 'Flannel (VXLAN)'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 font-mono text-[11px]">
          <div className="flex items-center gap-1.5 text-zinc-300">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Datapath Latency:</span>
            <span className="text-cyan-300 font-bold">{state.datapathLatencyMs} ms</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-300">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>Kube-Proxy Mode:</span>
            <span className="text-indigo-300 font-bold">{state.kubeProxyMode}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Pod Topology (Left) & NetworkPolicy / eBPF Flow Engine (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 7 Cols: Interactive Cluster Pods */}
        <div className="lg:col-span-7 p-6 flex flex-col gap-5 bg-[#0a0c13]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Network className="w-4 h-4 text-indigo-400" /> Cluster Pod Topology & Virtual Ethernets
            </span>
            <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-500/30">
              4 Pods Across 3 Nodes
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {state.pods.map((pod: K8sPod) => {
              const isSource = selectedSourcePod === pod.id;
              const isTarget = selectedTargetPod === pod.id;

              return (
                <div
                  key={pod.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col gap-2.5 relative ${
                    isSource
                      ? 'border-cyan-400 bg-cyan-950/20 shadow-glow-cyan'
                      : isTarget
                      ? 'border-indigo-400 bg-indigo-950/20 shadow-glow-indigo'
                      : 'border-[#202538] bg-[#10131f] hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          pod.labels.tier === 'untrusted'
                            ? 'bg-rose-500 animate-pulse'
                            : 'bg-emerald-400'
                        }`}
                      />
                      <span className="text-xs font-bold text-white font-mono">{pod.name}</span>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-zinc-400 border border-zinc-800">
                      {pod.namespace}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-zinc-400 bg-black/30 p-2 rounded-xl">
                    <div>
                      <span className="text-zinc-500">IP:</span> {pod.ip}
                    </div>
                    <div>
                      <span className="text-zinc-500">Node:</span> {pod.node}
                    </div>
                    <div className="col-span-2 flex flex-wrap gap-1 mt-0.5">
                      {Object.entries(pod.labels).map(([k, v]) => (
                        <span
                          key={k}
                          className="px-1.5 py-0.5 rounded bg-[#1e2338] text-zinc-300 text-[9px]"
                        >
                          {k}={v}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        SoundFx.playTerminalKeyPress();
                        setSelectedSourcePod(pod.id);
                      }}
                      className={`flex-1 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                        isSource
                          ? 'bg-cyan-500 text-black'
                          : 'bg-[#181d2e] text-zinc-400 hover:text-white'
                      }`}
                    >
                      {isSource ? '● Source' : 'Set as Source'}
                    </button>
                    <button
                      onClick={() => {
                        SoundFx.playTerminalKeyPress();
                        setSelectedTargetPod(pod.id);
                      }}
                      className={`flex-1 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                        isTarget
                          ? 'bg-indigo-500 text-white'
                          : 'bg-[#181d2e] text-zinc-400 hover:text-white'
                      }`}
                    >
                      {isTarget ? '● Target' : 'Set as Target'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live Outcome Banner */}
          {transmissionLog && (
            <div
              className={`p-4 rounded-2xl border text-xs flex items-start gap-3 animate-fadeIn ${
                transmissionLog.success
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
              }`}
            >
              {transmissionLog.success ? (
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="flex flex-col gap-0.5">
                <span className="font-bold uppercase tracking-wider font-mono text-[10px]">
                  {transmissionLog.success ? 'Cilium eBPF Path Verified' : 'NetworkPolicy Violation Intercepted'}
                </span>
                <p className="leading-relaxed">{transmissionLog.text}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right 5 Cols: CiliumNetworkPolicy & BPF Ring Buffer Telemetry */}
        <div className="lg:col-span-5 p-6 flex flex-col gap-5 bg-[#0d0f19]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-indigo-400" /> Active CiliumNetworkPolicies
            </span>
            <span className="text-[10px] font-mono text-zinc-400">
              Drops: <strong className="text-rose-400">{state.packetDropCount}</strong>
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {state.policies.map((policy, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#121624] border border-[#23293e] flex flex-col gap-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-white text-[11px]">{policy.name}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                      policy.action === 'ALLOW'
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-950/60 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {policy.action}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-zinc-400">
                  <span className="text-zinc-500">Target:</span> {policy.appliedTo}
                </div>
                <div className="text-[10px] font-mono text-zinc-400">
                  <span className="text-zinc-500">Rule:</span> {policy.ingressRule}
                </div>
              </div>
            ))}
          </div>

          {/* eBPF Forwarding Log Terminal */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" /> eBPF Hook Event Stream
            </span>
            <div className="p-3.5 rounded-2xl bg-black/60 border border-[#202538] font-mono text-[10px] text-zinc-300 flex flex-col gap-1.5 max-h-48 overflow-y-auto">
              {state.forwardingEvents.map((evt, idx) => (
                <div key={idx} className="leading-relaxed">
                  {evt}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
