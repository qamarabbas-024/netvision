import { SandboxStatus } from '@prisma/client';

export interface SandboxResourceLimits {
  ramMb: number;
  cpuCores: number;
  timeoutSec: number;
  maxProcesses: number;
}

export interface SandboxExecutionResult {
  command: string;
  output: string;
  exitCode: number;
  durationMs: number;
  isSimulated: boolean;
  timestamp: string;
}

export interface ISandboxProvider {
  readonly providerName: string;

  createEnvironment(
    userId: string,
    labId?: string,
    limits?: Partial<SandboxResourceLimits>
  ): Promise<{
    providerSessionId: string;
    status: SandboxStatus;
    expiresAt: Date;
    resourceLimits: SandboxResourceLimits;
    networkState: Record<string, any>;
  }>;

  executeCommand(
    sessionId: string,
    command: string,
    limits?: SandboxResourceLimits
  ): Promise<SandboxExecutionResult>;

  terminateSession(sessionId: string): Promise<boolean>;

  getStatus(sessionId: string): Promise<SandboxStatus>;
}
