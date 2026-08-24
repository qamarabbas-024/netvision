'use client';

import React, { useState } from 'react';
import {
  Radio,
  Activity,
  Layers,
  CheckCircle2,
  Zap,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  DepinMeshEngine,
  DepinMeshState,
} from '@/lib/depinMeshEngine';
import { SoundFx } from '@/lib/soundFx';

export const DepinMeshStudio: React.FC = () => {
  const [state, setState] = useState<DepinMeshState>(() =>
    DepinMeshEngine.getInitialState()
  );
  const [isGossiping, setIsGossiping] = useState<boolean>(false);
  const [gossipLog, setGossipLog] = useState<string | null>(null);

  const handleBroadcastGossip = () => {
    setIsGossiping(true);
    SoundFx.playPacketDispatch();

    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        totalRelayedGigabytes: +(prev.totalRelayedGigabytes + 1.2).toFixed(1),
        peers: prev.peers.map((peer) => ({
          ...peer,
          relayedBandwidthMb: peer.relayedBandwidthMb + 300,
          tokensEarned: +(peer.tokensEarned + 3.0).toFixed(1),
        })),
      }));
      setGossipLog(
        '⚡ libp2p Gossipsub message disseminated across 4 global Hotspot peers (Target Degree D=6). Cryptographic Proof-of-Bandwidth verified; +12.0 NV-DEPIN tokens minted to peer wallets.'
      );
      setIsGossiping(false);
      SoundFx.playSuccessChime();
    }, 500);
  };

  const handleReset = () => {
    SoundFx.playTerminalKeyPress();
    setState(DepinMeshEngine.getInitialState());
    setGossipLog(null);
  };

  return (
    <div className="w-full rounded-3xl bg-[#090b10] border border-[#202538] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10131d] border-b border-[#202538] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                Version 7.9 DePIN & Web3 Mesh
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold">
                libp2p Gossipsub • Kademlia DHT
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Decentralized Physical Infrastructure & Bandwidth Proof
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isGossiping ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleBroadcastGossip}
              leftIcon={<Zap className="w-3.5 h-3.5" />}
            >
              Broadcast Gossipsub Block (+Tokens)
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Gossiping to Mesh Peers...
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset
          </Button>
        </div>
      </div>

      {/* Main Grid: Peer Mesh Nodes (Left) & DePIN Proof Telemetry (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#202538]">
        {/* Left 7 Cols: Peer Mesh Nodes */}
        <div className="lg:col-span-7 p-6 flex flex-col gap-4 bg-[#0c0e17]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-400" /> Active libp2p Mesh Hotspots
            </span>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
              Relayed: {state.totalRelayedGigabytes} GB
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {state.peers.map((peer) => (
              <div
                key={peer.peerId}
                className="p-3.5 rounded-2xl bg-[#121522] border border-[#262c42] flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono">{peer.locationCity}</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30 font-bold">
                    {peer.status}
                  </span>
                </div>

                <span className="text-[10px] font-mono text-zinc-500 truncate">{peer.multiaddr}</span>

                <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-zinc-400 mt-1">
                  <div>Degree: <span className="text-cyan-300 font-bold">D={peer.gossipDegree}</span></div>
                  <div>Tokens: <span className="text-amber-400 font-bold">+{peer.tokensEarned}</span></div>
                </div>
              </div>
            ))}
          </div>

          {gossipLog && (
            <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs font-mono text-amber-200 leading-relaxed animate-in fade-in">
              {gossipLog}
            </div>
          )}
        </div>

        {/* Right 5 Cols: DePIN Tokenomics */}
        <div className="lg:col-span-5 p-5 bg-[#090b10] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202538]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-amber-400" /> Proof-of-Bandwidth Network State
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#121522] border border-[#262c42] space-y-1.5 text-xs font-mono">
            <span className="text-zinc-400 uppercase text-[10px] font-bold block">Gossipsub Topic:</span>
            <span className="text-cyan-300 block truncate">{state.topicName}</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#10131d] border border-[#202538] space-y-1.5 text-[11px] font-mono text-zinc-400">
            <div className="text-white font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Decentralized Infrastructure Protocols
            </div>
            <div>• libp2p Gossipsub maintains a low-latency epidemic overlay mesh</div>
            <div>• Kademlia XOR routing finds decentralized content hashes in O(log N) hops</div>
            <div>• Tokenized micro-incentives reward community operators for relaying enterprise traffic</div>
          </div>
        </div>
      </div>
    </div>
  );
};
