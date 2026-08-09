export type SandboxStatus =
  | 'created'
  | 'starting'
  | 'running'
  | 'stopped'
  | 'expired'
  | 'failed';

export interface SandboxResourceLimits {
  ramMb: number;
  cpuCores: number;
  timeoutSec: number;
  maxProcesses: number;
}

export interface LabEnvironment {
  id: string;
  hostname: string;
  interfaces: Array<{
    name: string;
    ip: string;
    netmask: string;
    mac?: string;
    status: 'UP' | 'DOWN';
  }>;
  gateway?: string;
  dnsServers?: string[];
  topologyNodesCount?: number;
}

export interface SandboxCommand {
  sessionId: string;
  command: string;
  args?: string[];
  timestamp?: string;
}

export interface SandboxResult {
  command: string;
  output: string;
  exitCode: number;
  durationMs: number;
  isSimulated: boolean;
  timestamp: string;
}

export interface SandboxSession {
  id: string;
  userId: string;
  labId?: string | null;
  status: SandboxStatus;
  createdAt: string | Date;
  expiresAt: string | Date;
  providerType: 'SIMULATED' | 'DOCKER' | string;
  resourceLimits?: SandboxResourceLimits;
  environment?: LabEnvironment;
  history?: SandboxResult[];
}

export interface Sandbox {
  id: string;
  name: string;
  providerName: string;
  activeSessionsCount: number;
  maxSessionsAllowed: number;
  isAvailable: boolean;
}
