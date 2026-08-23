'use client';

import React, { useState } from 'react';
import {
  Code,
  Terminal,
  Download,
  Copy,
  Check,
  Play,
  FileCode,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  IacGeneratorEngine,
  IacDevice,
} from '@/lib/iacGeneratorEngine';
import { SoundFx } from '@/lib/soundFx';

export const IacAutomationStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'TERRAFORM' | 'ANSIBLE' | 'NETMIKO'>('TERRAFORM');
  const [copied, setCopied] = useState<boolean>(false);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);

  const sampleDevices: IacDevice[] = [
    { id: 'd1', name: 'Core-Switch-01', type: 'SWITCH', ip: '10.0.0.1', os: 'cisco_ios', vlans: [10, 20, 99], ospfArea: 0 },
    { id: 'd2', name: 'Core-Switch-02', type: 'SWITCH', ip: '10.0.0.2', os: 'cisco_ios', vlans: [10, 20, 99], ospfArea: 0 },
    { id: 'd3', name: 'Edge-Router-01', type: 'ROUTER', ip: '10.0.0.254', os: 'cisco_ios', ospfArea: 0 },
  ];

  const getCodeContent = () => {
    if (activeTab === 'TERRAFORM') {
      return IacGeneratorEngine.generateTerraformHcl('NetVision-Production-Fabric', sampleDevices);
    }
    if (activeTab === 'ANSIBLE') {
      return IacGeneratorEngine.generateAnsiblePlaybook(sampleDevices);
    }
    return IacGeneratorEngine.generatePythonNetmiko(sampleDevices);
  };

  const handleCopy = () => {
    SoundFx.playTerminalKeyPress();
    navigator.clipboard.writeText(getCodeContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    SoundFx.playTerminalKeyPress();
    const content = getCodeContent();
    const filename =
      activeTab === 'TERRAFORM'
        ? 'main.tf'
        : activeTab === 'ANSIBLE'
        ? 'provision_fleet.yaml'
        : 'deploy_netmiko.py';

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRunExecution = () => {
    setIsExecuting(true);
    setExecutionLogs([]);
    SoundFx.playPacketDispatch();

    const logs = [
      `[*] Initializing ${activeTab} execution runner in isolated NetVision sandbox container...`,
      `[*] Validating syntax and configuration schema...`,
      `[✓] Schema validation passed with 0 warnings.`,
      `[*] Establishing cryptographic SSH tunnels to fleet (3 nodes)...`,
      `[✓] 10.0.0.1 (Core-Switch-01): Configuration merged successfully.`,
      `[✓] 10.0.0.2 (Core-Switch-02): Configuration merged successfully.`,
      `[✓] 10.0.0.254 (Edge-Router-01): OSPF Area 0 neighbor adjacencies established (FULL state).`,
      `[🎉] ALL TASKS COMPLETED (3 changed, 0 failed, 0 unreachable).`,
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setExecutionLogs((prev) => [...prev, log]);
        SoundFx.playTerminalKeyPress();
        if (index === logs.length - 1) {
          setIsExecuting(false);
          SoundFx.playSuccessChime();
        }
      }, (index + 1) * 350);
    });
  };

  return (
    <div className="w-full rounded-3xl bg-[#090a0f] border border-[#222533] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10121a] border-b border-[#222533] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                Version 4.5 NetDevOps
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                Infrastructure-as-Code
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Terraform, Ansible & Netmiko Automation Studio
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {copied ? 'Copied' : 'Copy Code'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            leftIcon={<Download className="w-3.5 h-3.5 text-emerald-400" />}
          >
            Download File
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleRunExecution}
            disabled={isExecuting}
            leftIcon={<Play className="w-3.5 h-3.5" />}
          >
            {isExecuting ? 'Running Provisioning...' : 'Test Run Provisioning'}
          </Button>
        </div>
      </div>

      {/* Main Grid: Code Editor (Left) & Simulated Output Terminal (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#222533]">
        {/* Left 7 Cols: Code Editor with Format Tabs */}
        <div className="lg:col-span-7 flex flex-col bg-[#0c0d14]">
          {/* Format Tabs Bar */}
          <div className="px-4 py-2 bg-[#12141f] border-b border-[#222533] flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {(['TERRAFORM', 'ANSIBLE', 'NETMIKO'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    SoundFx.playTerminalKeyPress();
                    setActiveTab(tab);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                    activeTab === tab
                      ? 'bg-emerald-500 text-black shadow-glow-cyan'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {tab === 'TERRAFORM' ? 'Terraform (.tf)' : tab === 'ANSIBLE' ? 'Ansible (.yaml)' : 'Python (.py)'}
                </button>
              ))}
            </div>

            <span className="text-[10px] font-mono text-zinc-500">Auto-Generated from Canvas Topology</span>
          </div>

          {/* Code Viewer Area */}
          <pre className="p-4 text-xs font-mono text-emerald-300 leading-relaxed overflow-x-auto max-h-[420px] bg-[#07080c]">
            <code>{getCodeContent()}</code>
          </pre>
        </div>

        {/* Right 5 Cols: Execution Runner Terminal */}
        <div className="lg:col-span-5 p-5 bg-[#090a0f] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#222533]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-emerald-400" /> Provisioning Execution Terminal
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
              Sandboxed CI/CD
            </span>
          </div>

          {/* Terminal Console Output */}
          <div className="p-4 rounded-2xl bg-black/70 border border-[#222533] min-h-[340px] max-h-[380px] overflow-y-auto space-y-1.5 font-mono text-xs">
            {executionLogs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-zinc-600 gap-2 min-h-[280px]">
                <Code className="w-8 h-8 opacity-40 text-zinc-500" />
                <span>Click "Test Run Provisioning" above to simulate live IaC deployment.</span>
              </div>
            ) : (
              executionLogs.map((log, idx) => (
                <div
                  key={idx}
                  className={`leading-relaxed ${
                    log.includes('✓') || log.includes('🎉')
                      ? 'text-emerald-400 font-bold'
                      : log.includes('!')
                      ? 'text-rose-400'
                      : 'text-zinc-300'
                  }`}
                >
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
