'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Code,
  Terminal,
  Play,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Database,
  ShieldCheck,
  Activity,
  Layers,
  HelpCircle,
  RotateCcw,
  Cpu,
  FileCode,
} from 'lucide-react';

export const NetworkAutomationVisual: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'rest_api' | 'json_parser' | 'drift' | 'practice'>('pipeline');

  // Pipeline execution state
  const [pipelineStep, setPipelineStep] = useState<number>(0);
  const [pipelineRunning, setPipelineRunning] = useState<boolean>(false);
  const [pipelineLogs, setPipelineLogs] = useState<string[]>([
    '[INIT] Automation pipeline initialized. Awaiting deployment trigger.',
  ]);

  // REST API workbench state
  const [selectedMethod, setSelectedMethod] = useState<'GET' | 'POST' | 'PATCH' | 'DELETE'>('GET');
  const [endpointUri, setEndpointUri] = useState<string>('/api/v1/interfaces/GigabitEthernet0/1');
  const [apiRequestBody, setApiRequestBody] = useState<string>(
    JSON.stringify(
      {
        interface: 'GigabitEthernet0/1',
        description: 'Uplink-to-Core-Switch',
        enabled: true,
        ipv4_address: '10.100.1.1',
        subnet_mask: '255.255.255.252',
        vlan_id: 100,
      },
      null,
      2
    )
  );
  const [apiResponse, setApiResponse] = useState<any>({
    status: 200,
    statusText: 'OK',
    data: {
      interface: 'GigabitEthernet0/1',
      admin_status: 'UP',
      oper_status: 'UP',
      ip_address: '10.100.1.1/30',
      vlan_id: 100,
      last_change: '2026-08-17T13:40:00Z',
    },
  });

  // Practice state
  const [practiceIndex, setPracticeIndex] = useState<number>(0);
  const [practiceAnswer, setPracticeAnswer] = useState<string>('');
  const [practiceFeedback, setPracticeFeedback] = useState<{ correct: boolean; msg: string } | null>(null);

  const pipelineStages = [
    { name: '1. Intended State (JSON)', desc: 'Define declarative target configuration in structured format' },
    { name: '2. Schema Validation', desc: 'Verify IP formats, VLAN bounds, and mandatory key requirements' },
    { name: '3. Dry-Run Diff Preview', desc: 'Compare live running state vs intended state without making changes' },
    { name: '4. Atomic Deployment', desc: 'Push validated changes through device REST API / NETCONF' },
    { name: '5. Post-Check Verification', desc: 'Query operational telemetry to confirm routing and interface status' },
    { name: '6. Centralized Logging', desc: 'Record immutable audit trail and emit operational event metrics' },
  ];

  const runAutomationPipeline = () => {
    if (pipelineRunning) return;
    setPipelineRunning(true);
    setPipelineStep(0);
    setPipelineLogs(['[START] Initiating automated configuration pipeline for Core-Switch-01...']);

    const runStep = (step: number) => {
      setPipelineStep(step);
      if (step === 1) {
        setPipelineLogs((prev) => [
          ...prev,
          '✓ [STEP 1] Loaded JSON payload: GigabitEthernet0/1 -> IP: 10.100.1.1/30, VLAN: 100.',
        ]);
      } else if (step === 2) {
        setPipelineLogs((prev) => [
          ...prev,
          '✓ [STEP 2] Schema Validation PASSED: IP address syntax valid, VLAN 100 within range (1-4094).',
        ]);
      } else if (step === 3) {
        setPipelineLogs((prev) => [
          ...prev,
          '✓ [STEP 3] Dry-Run Diff: +description: "Uplink-to-Core-Switch", ~admin_status: DOWN -> UP. No errors found.',
        ]);
      } else if (step === 4) {
        setPipelineLogs((prev) => [
          ...prev,
          '✓ [STEP 4] Atomic Deployment: PATCH /api/v1/interfaces/GigabitEthernet0/1 -> HTTP 200 OK.',
        ]);
      } else if (step === 5) {
        setPipelineLogs((prev) => [
          ...prev,
          '✓ [STEP 5] Post-Check: Interface GigabitEthernet0/1 is UP/UP, ARP adjacency established with 10.100.1.2.',
        ]);
      } else if (step === 6) {
        setPipelineLogs((prev) => [
          ...prev,
          '🎉 [STEP 6] Pipeline completed successfully with idempotency preserved. Audit logged to telemetry backend.',
        ]);
        setPipelineRunning(false);
        return;
      }
      setTimeout(() => runStep(step + 1), 700);
    };

    setTimeout(() => runStep(1), 500);
  };

  const handleRestApiSend = () => {
    if (selectedMethod === 'GET') {
      setApiResponse({
        status: 200,
        statusText: 'OK',
        data: {
          interface: 'GigabitEthernet0/1',
          admin_status: 'UP',
          oper_status: 'UP',
          ip_address: '10.100.1.1/30',
          vlan_id: 100,
          speed: '10Gbps',
          duplex: 'Full',
        },
      });
    } else if (selectedMethod === 'POST') {
      setApiResponse({
        status: 201,
        statusText: 'Created',
        data: {
          message: 'Interface resource successfully instantiated in device database.',
          resource_id: 'GigabitEthernet0/1',
        },
      });
    } else if (selectedMethod === 'PATCH') {
      setApiResponse({
        status: 200,
        statusText: 'OK (Idempotent Modification)',
        data: {
          interface: 'GigabitEthernet0/1',
          updated_fields: ['description', 'ipv4_address', 'vlan_id'],
          applied_timestamp: new Date().toISOString(),
        },
      });
    } else if (selectedMethod === 'DELETE') {
      setApiResponse({
        status: 204,
        statusText: 'No Content (Resource Removed)',
        data: null,
      });
    }
  };

  const practiceItems = [
    {
      id: 1,
      prompt:
        'A network team discovers that engineers made undocumented manual CLI changes directly on edge switches, causing live running configs to diverge from the central Git repository. What is this condition called? (Type "Configuration Drift", "Idempotency", or "Dry Run")',
      expected: 'Configuration Drift',
      hints: 'Configuration drift occurs when manual interventions or out-of-band changes cause production device state to diverge from intended source-of-truth definitions.',
    },
    {
      id: 2,
      prompt:
        'In a declarative automation model, does the engineer specify the step-by-step commands to execute, or the desired final target state? (Type "Final State" or "Commands")',
      expected: 'Final State',
      hints: 'Declarative automation describes WHAT the desired end-state should be, allowing the automation engine to compute necessary actions.',
    },
    {
      id: 3,
      prompt:
        'In the JSON payload `{"vlans": [{"id": 10, "name": "Eng"}]}`, what data structure is used for the `vlans` field? (Type "List", "Dictionary", or "String")',
      expected: 'List',
      hints: 'In JSON, square brackets `[...]` represent an ordered List (array) of elements.',
    },
    {
      id: 4,
      prompt:
        'Which HTTP method should an automation script send to a REST API endpoint to retrieve operational interface telemetry without modifying device state? (Type GET, POST, PUT, PATCH, or DELETE)',
      expected: 'GET',
      hints: 'HTTP GET is a safe, read-only method used to query data from a server or network device without side effects.',
    },
    {
      id: 5,
      prompt:
        'Is pushing unvalidated configuration changes directly to 500 production devices without dry-run diffs considered a "Safe" or "Unsafe" automation practice? (Type "Safe" or "Unsafe")',
      expected: 'Unsafe',
      hints: 'Unvalidated global deployments without dry-run verification or automated rollback violate safety guidelines.',
    },
    {
      id: 6,
      prompt:
        'Why does idempotency matter in network automation? Because executing the same script multiple times produces the exact same end state without errors or duplicate changes. What is this property called? (Type "Idempotency", "Telemetry", or "Drift")',
      expected: 'Idempotency',
      hints: 'Idempotency ensures that re-running automation routines produces predictable, non-disruptive results.',
    },
  ];

  const checkPractice = () => {
    const current = practiceItems[practiceIndex];
    const cleanedUser = practiceAnswer.trim().toLowerCase();
    const cleanedExpected = current.expected.trim().toLowerCase();

    if (cleanedUser === cleanedExpected) {
      setPracticeFeedback({
        correct: true,
        msg: `🎉 Correct! "${current.expected}" is the accurate engineering answer.`,
      });
    } else {
      setPracticeFeedback({
        correct: false,
        msg: `❌ Incorrect. Expected "${current.expected}". Hint: ${current.hints}`,
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 text-zinc-100 font-sans">
      {/* Header & Mode Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <FileCode className="w-5 h-5 text-[#00f0ff]" />
          <h3 className="text-lg font-bold tracking-wide text-white">
            Network Automation, Programmable APIs & Safe Deployment Pipelines
          </h3>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Button
            size="sm"
            variant={activeTab === 'pipeline' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('pipeline')}
            className={activeTab === 'pipeline' ? 'bg-[#00f0ff] text-black hover:bg-[#00f0ff]/90' : 'text-zinc-300'}
          >
            <Play className="w-3.5 h-3.5 mr-1.5" /> Automation Pipeline
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'rest_api' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('rest_api')}
            className={activeTab === 'rest_api' ? 'bg-[#00f0ff] text-black hover:bg-[#00f0ff]/90' : 'text-zinc-300'}
          >
            <Code className="w-3.5 h-3.5 mr-1.5" /> REST API Workbench
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'json_parser' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('json_parser')}
            className={activeTab === 'json_parser' ? 'bg-[#00f0ff] text-black hover:bg-[#00f0ff]/90' : 'text-zinc-300'}
          >
            <Database className="w-3.5 h-3.5 mr-1.5" /> JSON Data Model
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'drift' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('drift')}
            className={activeTab === 'drift' ? 'bg-[#00f0ff] text-black hover:bg-[#00f0ff]/90' : 'text-zinc-300'}
          >
            <ShieldCheck className="w-3.5 h-3.5 mr-1.5" /> Safe Practices & Drift
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'practice' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('practice')}
            className={activeTab === 'practice' ? 'bg-[#00f0ff] text-black hover:bg-[#00f0ff]/90' : 'text-zinc-300'}
          >
            <HelpCircle className="w-3.5 h-3.5 mr-1.5" /> Practice Workbench
          </Button>
        </div>
      </div>

      {/* TAB 1: AUTOMATION PIPELINE WORKFLOW */}
      {activeTab === 'pipeline' && (
        <div className="flex flex-col gap-6">
          {/* Pipeline Stage Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2">
            {pipelineStages.map((stage, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border flex flex-col gap-1 transition-all ${
                  pipelineStep === idx + 1
                    ? 'border-[#00f0ff] bg-[#00f0ff]/10 text-white shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                    : pipelineStep > idx + 1
                    ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300'
                    : 'border-zinc-800 bg-zinc-900/60 text-zinc-400'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>{stage.name}</span>
                  {pipelineStep > idx + 1 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                </div>
                <div className="text-[10px] text-zinc-500 leading-snug">{stage.desc}</div>
              </div>
            ))}
          </div>

          {/* Action Trigger & Terminal Output */}
          <Card className="p-5 border-zinc-800 bg-zinc-950 flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-[#00f0ff]" />
                <span className="text-sm font-bold text-white">Safe Network Deployment Pipeline Simulation</span>
                <Badge variant={pipelineRunning ? 'amber' : pipelineStep === 6 ? 'emerald' : 'cyan'}>
                  {pipelineRunning ? 'PIPELINE RUNNING...' : pipelineStep === 6 ? 'DEPLOYMENT COMPLETE' : 'READY'}
                </Badge>
              </div>
              <Button
                size="sm"
                disabled={pipelineRunning}
                onClick={runAutomationPipeline}
                className="bg-[#00f0ff] text-black hover:bg-[#00f0ff]/90 font-bold"
              >
                <Play className="w-4 h-4 mr-1.5" /> Run Safe Automation Pipeline
              </Button>
            </div>

            {/* Simulated Execution Log */}
            <div className="p-4 rounded-lg bg-black/90 border border-zinc-800 font-mono text-xs text-zinc-300 flex flex-col gap-2 min-h-[160px] max-h-[260px] overflow-y-auto">
              {pipelineLogs.map((log, i) => (
                <div
                  key={i}
                  className={
                    log.includes('✓')
                      ? 'text-emerald-400'
                      : log.includes('🎉')
                      ? 'text-[#00f0ff] font-bold'
                      : log.includes('[START]')
                      ? 'text-amber-300'
                      : 'text-zinc-400'
                  }
                >
                  {log}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: REST API WORKBENCH */}
      {activeTab === 'rest_api' && (
        <Card className="p-6 border-zinc-800 bg-zinc-950 flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white">Programmable Device REST API Inspector</h4>
              <p className="text-xs text-zinc-400">
                Execute standard HTTP methods against model-driven device APIs (RESTCONF / Device REST API).
              </p>
            </div>
            <div className="flex gap-1.5">
              {(['GET', 'POST', 'PATCH', 'DELETE'] as const).map((method) => (
                <button
                  key={method}
                  onClick={() => setSelectedMethod(method)}
                  className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
                    selectedMethod === method
                      ? method === 'GET'
                        ? 'bg-blue-500 text-white'
                        : method === 'POST'
                        ? 'bg-emerald-500 text-black'
                        : method === 'PATCH'
                        ? 'bg-amber-500 text-black'
                        : 'bg-rose-500 text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 flex-1 font-mono text-xs text-zinc-200">
              <span className="font-bold text-[#00f0ff]">{selectedMethod}</span>
              <span className="text-zinc-500">https://switch-01.corp</span>
              <input
                type="text"
                value={endpointUri}
                onChange={(e) => setEndpointUri(e.target.value)}
                className="bg-transparent border-none outline-none flex-1 text-white"
              />
            </div>
            <Button className="bg-[#00f0ff] text-black hover:bg-[#00f0ff]/90 font-bold text-xs" onClick={handleRestApiSend}>
              Send API Request
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Request Body */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono font-bold text-zinc-400">// JSON REQUEST PAYLOAD:</span>
              <textarea
                rows={8}
                value={apiRequestBody}
                onChange={(e) => setApiRequestBody(e.target.value)}
                className="p-3 rounded-lg bg-black/80 border border-zinc-800 font-mono text-xs text-zinc-300 focus:outline-none focus:border-[#00f0ff]"
              />
            </div>

            {/* Response Body */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-400">// DEVICE HTTP RESPONSE:</span>
                <span
                  className={`text-xs font-mono font-bold ${
                    apiResponse.status >= 200 && apiResponse.status < 300 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  Status: {apiResponse.status} {apiResponse.statusText}
                </span>
              </div>
              <pre className="p-3 rounded-lg bg-black/80 border border-zinc-800 font-mono text-xs text-emerald-400 overflow-x-auto min-h-[160px]">
                {JSON.stringify(apiResponse.data, null, 2)}
              </pre>
            </div>
          </div>
        </Card>
      )}

      {/* TAB 3: JSON DATA MODEL & PYTHON PARSER */}
      {activeTab === 'json_parser' && (
        <Card className="p-6 border-zinc-800 bg-zinc-950 flex flex-col gap-5">
          <div className="border-b border-zinc-800 pb-3">
            <h4 className="text-sm font-bold text-white">JSON Data Fundamentals & Python Object Parsing</h4>
            <p className="text-xs text-zinc-400">
              Network automation extracts structured key-value dictionaries and lists instead of regex screen-scraping CLI strings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {/* JSON Network Data */}
            <div className="flex flex-col gap-2">
              <span className="font-bold text-[#00f0ff]">// 1. STRUCTURED JSON DEVICE PAYLOAD:</span>
              <div className="p-3.5 rounded-lg bg-black/90 border border-zinc-800 text-zinc-300 leading-relaxed overflow-x-auto">
                {`{
  "hostname": "core-sw-01",
  "interfaces": [
    { "name": "Gi0/1", "vlan": 10, "status": "up" },
    { "name": "Gi0/2", "vlan": 20, "status": "down" }
  ]
}`}
              </div>
            </div>

            {/* Python Snippet */}
            <div className="flex flex-col gap-2">
              <span className="font-bold text-emerald-400">// 2. PYTHON PARSING & ITERATION:</span>
              <div className="p-3.5 rounded-lg bg-black/90 border border-zinc-800 text-zinc-300 leading-relaxed overflow-x-auto">
                {`import json

# Parse JSON into native Python dictionary
data = json.loads(payload)

# Iterate through structured interfaces
for intf in data["interfaces"]:
    if intf["status"] == "up":
        print(f"Active: {intf['name']} in VLAN {intf['vlan']}")`}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* TAB 4: SAFE AUTOMATION PRACTICES & DRIFT */}
      {activeTab === 'drift' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-5 border-zinc-800 bg-zinc-950 flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm font-bold text-white">Understanding Configuration Drift</h4>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Configuration drift occurs when manual CLI changes or hotfixes are applied directly on physical switches without updating the central version-controlled source of truth.
            </p>
            <div className="p-3 rounded bg-zinc-900 border border-zinc-800 font-mono text-xs text-amber-300 flex flex-col gap-1">
              <div>⚠️ Intended (Git Repo): VLAN 100 on Gi0/1</div>
              <div>⚠️ Running (Live Switch): VLAN 200 on Gi0/1 (Manual CLI modification)</div>
              <div>➔ Result: Next automated push will overwrite or fail without reconciliation.</div>
            </div>
          </Card>

          <Card className="p-5 border-zinc-800 bg-zinc-950 flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm font-bold text-white">Safe Automation Best Practices</h4>
            </div>
            <ul className="text-xs text-zinc-300 flex flex-col gap-2 list-disc pl-4">
              <li>
                <strong className="text-white">Pre-Deployment Validation:</strong> Validate JSON schema, IP formatting, and VLAN limits before connecting to devices.
              </li>
              <li>
                <strong className="text-white">Dry-Run / Check Mode:</strong> Generate diffs of what will change without altering operational state.
              </li>
              <li>
                <strong className="text-white">Canary Deployments:</strong> Roll out changes to 1 non-critical switch before updating 100 core routers.
              </li>
              <li>
                <strong className="text-white">Automated Rollback:</strong> Automatically revert configuration if post-deployment health checks fail.
              </li>
            </ul>
          </Card>
        </div>
      )}

      {/* TAB 5: PRACTICE WORKBENCH */}
      {activeTab === 'practice' && (
        <Card className="p-6 border-zinc-800 bg-zinc-950 flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <span className="text-xs font-mono text-[#00f0ff] font-bold">
              EXERCISE {practiceIndex + 1} OF {practiceItems.length}
            </span>
            <div className="flex gap-1.5">
              {practiceItems.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setPracticeIndex(i);
                    setPracticeAnswer('');
                    setPracticeFeedback(null);
                  }}
                  className={`w-6 h-6 rounded text-xs font-mono font-bold ${
                    practiceIndex === i ? 'bg-[#00f0ff] text-black' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-bold text-white leading-relaxed">{practiceItems[practiceIndex].prompt}</h4>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={practiceAnswer}
              onChange={(e) => setPracticeAnswer(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && checkPractice()}
              placeholder="Type your answer here..."
              className="flex-1 px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 font-mono text-sm text-white focus:outline-none focus:border-[#00f0ff]"
            />
            <Button className="bg-[#00f0ff] text-black hover:bg-[#00f0ff]/90" onClick={checkPractice}>
              Verify Answer
            </Button>
          </div>

          {practiceFeedback && (
            <div
              className={`p-3.5 rounded-lg border text-xs font-mono ${
                practiceFeedback.correct
                  ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300'
                  : 'border-amber-500/50 bg-amber-950/20 text-amber-300'
              }`}
            >
              {practiceFeedback.msg}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
