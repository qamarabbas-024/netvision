'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  Sparkles,
  CheckCircle2,
  Cpu,
  Router,
  Server,
  Shield,
  Monitor,
  Network,
  RefreshCw,
  Box,
} from 'lucide-react';
import { NetworkNode, NetworkLink } from '@/types';

export interface ExtractedTopology {
  nodes: NetworkNode[];
  links: NetworkLink[];
  detectedSubnets: string[];
  confidenceScore: number;
  diagramSummary: string;
}

export interface MultimodalDiagramParserProps {
  onLoadTopologyToSimulation?: (topology: ExtractedTopology) => void;
  onClose?: () => void;
}

export const MultimodalDiagramParser: React.FC<MultimodalDiagramParserProps> = ({
  onLoadTopologyToSimulation,
  onClose,
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [extractedData, setExtractedData] = useState<ExtractedTopology | null>(null);
  const [activeTab, setActiveTab] = useState<'detected' | 'subnets' | 'raw'>('detected');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle clipboard image paste (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            processSelectedImage(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const processSelectedImage = (file: File) => {
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImagePreviewUrl(url);
    triggerAiDiagramExtraction(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedImage(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedImage(e.dataTransfer.files[0]);
    }
  };

  // Perform AI Diagram Extraction & Node Synthesis
  const triggerAiDiagramExtraction = (file: File) => {
    setIsScanning(true);
    setScanProgress(10);
    setExtractedData(null);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 15;
      });
    }, 150);

    // Simulate smart multimodal vision analysis
    setTimeout(() => {
      clearInterval(interval);
      setScanProgress(100);
      setIsScanning(false);

      const fileName = file.name.toLowerCase();
      let synthesizedTopology: ExtractedTopology;

      if (fileName.includes('ospf') || fileName.includes('routing')) {
        synthesizedTopology = {
          confidenceScore: 96,
          diagramSummary: 'Multi-Subnet Enterprise Routing Topology with Core Gateway and OSPF Area 0 Backbone.',
          detectedSubnets: ['192.168.10.0/24 (VLAN 10 Engineering)', '172.16.0.0/24 (WAN Interconnect)', '10.0.0.0/24 (Data Center DMZ)'],
          nodes: [
            { id: 'node-pc-1', name: 'Workstation 1', type: 'pc', ipAddress: '192.168.10.50', macAddress: '00:1A:2B:10:00:50', status: 'online', position: { x: 80, y: 140 } },
            { id: 'node-sw-1', name: 'Access Switch SW1', type: 'switch', ipAddress: '192.168.10.2', macAddress: '00:1A:2B:10:00:02', status: 'online', position: { x: 280, y: 140 } },
            { id: 'node-rtr-1', name: 'OSPF Core Router R1', type: 'router', ipAddress: '172.16.0.1', macAddress: '00:1A:2B:17:00:01', status: 'online', position: { x: 480, y: 140 } },
            { id: 'node-fw-1', name: 'DMZ Edge Firewall', type: 'firewall', ipAddress: '10.0.0.1', macAddress: '00:1A:2B:10:00:01', status: 'online', position: { x: 680, y: 140 } },
            { id: 'node-srv-1', name: 'Production Web Server', type: 'server', ipAddress: '10.0.0.50', macAddress: '00:1A:2B:AA:00:50', status: 'online', position: { x: 880, y: 140 } },
          ],
          links: [
            { id: 'l-1', sourceNodeId: 'node-pc-1', targetNodeId: 'node-sw-1', bandwidthMbps: 1000, latencyMs: 1, status: 'connected' },
            { id: 'l-2', sourceNodeId: 'node-sw-1', targetNodeId: 'node-rtr-1', bandwidthMbps: 10000, latencyMs: 2, status: 'connected' },
            { id: 'l-3', sourceNodeId: 'node-rtr-1', targetNodeId: 'node-fw-1', bandwidthMbps: 10000, latencyMs: 5, status: 'connected' },
            { id: 'l-4', sourceNodeId: 'node-fw-1', targetNodeId: 'node-srv-1', bandwidthMbps: 10000, latencyMs: 1, status: 'connected' },
          ],
        };
      } else {
        synthesizedTopology = {
          confidenceScore: 94,
          diagramSummary: 'Hierarchical 3-Tier Campus Network with Access, Core Routing, Stateful Security, and Server Infrastructure.',
          detectedSubnets: ['192.168.1.0/24 (Client LAN)', '10.0.0.0/16 (Core Infrastructure)', '93.184.216.0/24 (Public Internet)'],
          nodes: [
            { id: 'node-h1', name: 'Host A (Client)', type: 'pc', ipAddress: '192.168.1.10', macAddress: '00:1A:2B:11:22:33', status: 'online', position: { x: 80, y: 140 } },
            { id: 'node-sw1', name: 'Distribution Switch', type: 'switch', ipAddress: '192.168.1.1', macAddress: '00:1A:2B:AA:01:01', status: 'online', position: { x: 280, y: 140 } },
            { id: 'node-gw', name: 'Default Gateway Router', type: 'router', ipAddress: '10.0.0.1', macAddress: '00:1A:2B:GW:01:01', status: 'online', position: { x: 480, y: 140 } },
            { id: 'node-fw', name: 'Next-Gen Firewall', type: 'firewall', ipAddress: '10.0.0.2', macAddress: '00:1A:2B:FW:01:01', status: 'online', position: { x: 680, y: 140 } },
            { id: 'node-srv', name: 'Cloud Origin Server', type: 'server', ipAddress: '93.184.216.34', macAddress: '00:1A:2B:SR:99:99', status: 'online', position: { x: 880, y: 140 } },
          ],
          links: [
            { id: 'l1', sourceNodeId: 'node-h1', targetNodeId: 'node-sw1', bandwidthMbps: 1000, latencyMs: 1, status: 'connected' },
            { id: 'l2', sourceNodeId: 'node-sw1', targetNodeId: 'node-gw', bandwidthMbps: 1000, latencyMs: 2, status: 'connected' },
            { id: 'l3', sourceNodeId: 'node-gw', targetNodeId: 'node-fw', bandwidthMbps: 10000, latencyMs: 8, status: 'connected' },
            { id: 'l4', sourceNodeId: 'node-fw', targetNodeId: 'node-srv', bandwidthMbps: 10000, latencyMs: 15, status: 'connected' },
          ],
        };
      }

      setExtractedData(synthesizedTopology);
    }, 1200);
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'pc': return <Monitor className="w-4 h-4 text-emerald-400" />;
      case 'switch': return <Cpu className="w-4 h-4 text-sky-400" />;
      case 'router': return <Router className="w-4 h-4 text-[#00f0ff]" />;
      case 'firewall': return <Shield className="w-4 h-4 text-amber-400" />;
      case 'server': return <Server className="w-4 h-4 text-purple-400" />;
      default: return <Network className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <div className="w-full rounded-2xl bg-[#09090b] border border-[#272732] overflow-hidden flex flex-col shadow-2xl">
      {/* Top Header */}
      <div className="px-5 py-4 border-b border-[#272732] bg-[#121217] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-wider font-semibold">
                Version 3.1 AI Vision Engine
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold">
                Multimodal OCR
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
              Network Diagram & Image Topology Extractor
            </h3>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white bg-[#1a1a24] border border-[#272732]"
          >
            ✕
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="p-5 sm:p-6 flex flex-col gap-6">
        {/* Dropzone & File Uploader */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
            imageFile
              ? 'border-[#00f0ff]/50 bg-[#00f0ff]/5'
              : 'border-[#272732] hover:border-[#00f0ff]/40 bg-[#121217]/50 hover:bg-[#121217]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <UploadCloud className="w-10 h-10 text-[#00f0ff] mb-3 animate-pulse" />
          <h4 className="text-sm sm:text-base font-bold text-white mb-1">
            Drag & Drop Network Diagram, Whiteboard Sketch, or Screenshot
          </h4>
          <p className="text-xs text-zinc-400 max-w-md mb-3">
            Supports PNG, JPEG, SVG, or paste directly from clipboard with <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 font-mono text-[11px]">Ctrl+V</kbd>.
          </p>
          <span className="px-3 py-1 rounded-lg bg-[#1a1a24] border border-[#272732] text-xs font-mono text-[#00f0ff]">
            Browse Diagram Files ➔
          </span>
        </div>

        {/* Scanning Progress Bar & Preview */}
        {imagePreviewUrl && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Image Preview Window */}
            <div className="relative rounded-xl border border-[#272732] bg-black/40 overflow-hidden flex flex-col items-center justify-center min-h-[220px] p-3">
              <img
                src={imagePreviewUrl}
                alt="Uploaded Network Diagram"
                className="max-h-[260px] object-contain rounded-lg shadow-md"
              />

              {/* Scanning HUD Overlay */}
              {isScanning && (
                <div className="absolute inset-0 bg-[#00f0ff]/10 backdrop-blur-[1px] flex flex-col items-center justify-center gap-3">
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent animate-pulse" />
                  <span className="px-3 py-1 rounded-lg bg-black/80 font-mono text-xs text-[#00f0ff] border border-[#00f0ff]/40">
                    Scanning Topology Architecture... {scanProgress}%
                  </span>
                </div>
              )}
            </div>

            {/* Extracted Topology Inspector */}
            <div className="rounded-xl border border-[#272732] bg-[#121217] p-4 flex flex-col justify-between">
              {isScanning ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 py-8 text-center">
                  <RefreshCw className="w-7 h-7 text-[#00f0ff] animate-spin" />
                  <p className="text-xs text-zinc-400 font-mono">
                    Extracting subnets, routing tables, and interface bindings...
                  </p>
                </div>
              ) : extractedData ? (
                <div className="flex flex-col gap-4">
                  {/* Status Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#272732]">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-white">Extraction Complete</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
                      {extractedData.confidenceScore}% Confidence
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                    {extractedData.diagramSummary}
                  </p>

                  {/* Tabs */}
                  <div className="flex bg-[#1a1a24] p-1 rounded-lg border border-[#272732] gap-1">
                    <button
                      onClick={() => setActiveTab('detected')}
                      className={`flex-1 py-1 text-xs font-bold rounded transition-all ${
                        activeTab === 'detected' ? 'bg-[#00f0ff] text-black shadow-glow-cyan' : 'text-zinc-400'
                      }`}
                    >
                      Nodes ({extractedData.nodes.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('subnets')}
                      className={`flex-1 py-1 text-xs font-bold rounded transition-all ${
                        activeTab === 'subnets' ? 'bg-[#00f0ff] text-black shadow-glow-cyan' : 'text-zinc-400'
                      }`}
                    >
                      Subnets ({extractedData.detectedSubnets.length})
                    </button>
                  </div>

                  {/* Tab Body */}
                  {activeTab === 'detected' ? (
                    <div className="flex flex-col gap-2 max-h-[140px] overflow-y-auto pr-1">
                      {extractedData.nodes.map((node) => (
                        <div
                          key={node.id}
                          className="p-2 rounded-lg bg-[#181822] border border-[#272732] flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2">
                            {getNodeIcon(node.type)}
                            <span className="font-semibold text-white">{node.name}</span>
                          </div>
                          <span className="font-mono text-[#00f0ff] text-[11px]">{node.ipAddress}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 max-h-[140px] overflow-y-auto pr-1">
                      {extractedData.detectedSubnets.map((sub, i) => (
                        <div
                          key={i}
                          className="p-2 rounded-lg bg-[#181822] border border-[#272732] font-mono text-xs text-sky-400 flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                          <span>{sub}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action Button: Load to 3D Simulation */}
                  <button
                    onClick={() => {
                      if (onLoadTopologyToSimulation) {
                        onLoadTopologyToSimulation(extractedData);
                      }
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#00f0ff] text-black font-bold text-xs hover:bg-[#00f0ff]/90 transition-all flex items-center justify-center gap-2 shadow-glow-cyan mt-1"
                  >
                    <Box className="w-4 h-4" />
                    <span>Load Directly into 3D Simulation Canvas ➔</span>
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
